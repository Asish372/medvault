import express from 'express'
import { protect, authorize, canAccessPatient, auditLog } from '../middleware/auth.js'

const router = express.Router()

// All routes are protected and require authentication
router.use(protect)

// @desc    Get all patients
// @route   GET /api/patients
// @access  Private/Doctor/Admin
router.get('/', authorize('doctor', 'admin'), auditLog('view_patients'), async (req, res) => {
  try {
    const { status, riskLevel, page = 1, limit = 10 } = req.query
    
    const filter = {}
    if (status) filter.status = status
    if (riskLevel) filter.riskLevel = riskLevel
    
    // If user is a doctor, only show assigned patients
    if (req.user.role === 'doctor') {
      filter['assignedDoctors.doctor'] = req.user._id
    }
    
    const Patient = (await import('../models/Patient.js')).default
    
    const patients = await Patient.find(filter)
      .populate('user', 'name email phone dateOfBirth gender bloodType')
      .populate('assignedDoctors.doctor', 'name specialization')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
    
    const total = await Patient.countDocuments(filter)
    
    res.status(200).json({
      success: true,
      count: patients.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      },
      data: patients
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
})

// @desc    Get single patient
// @route   GET /api/patients/:id
// @access  Private
router.get('/:id', canAccessPatient, auditLog('view_patient'), async (req, res) => {
  try {
    const Patient = (await import('../models/Patient.js')).default
    
    const patient = await Patient.findById(req.params.id)
      .populate('user', 'name email phone dateOfBirth gender bloodType emergencyContact')
      .populate('assignedDoctors.doctor', 'name specialization email')
      .populate('medications.prescribedBy', 'name specialization')
    
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      })
    }
    
    res.status(200).json({
      success: true,
      data: patient
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
})

// @desc    Update patient
// @route   PUT /api/patients/:id
// @access  Private/Doctor/Admin
router.put('/:id', canAccessPatient, authorize('doctor', 'admin'), auditLog('update_patient'), async (req, res) => {
  try {
    const Patient = (await import('../models/Patient.js')).default
    
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      { ...req.body, lastUpdatedBy: req.user._id },
      {
        new: true,
        runValidators: true
      }
    ).populate('user', 'name email phone')
    
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      })
    }
    
    res.status(200).json({
      success: true,
      data: patient,
      message: 'Patient updated successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
})

// @desc    Assign doctor to patient
// @route   POST /api/patients/:id/assign-doctor
// @access  Private/Admin
router.post('/:id/assign-doctor', canAccessPatient, authorize('admin'), auditLog('assign_doctor'), async (req, res) => {
  try {
    const { doctorId, isPrimary = false, specialization = '' } = req.body
    
    if (!doctorId) {
      return res.status(400).json({
        success: false,
        message: 'Doctor ID is required'
      })
    }
    
    const Patient = (await import('../models/Patient.js')).default
    const patient = await Patient.findById(req.params.id)
    
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      })
    }
    
    await patient.assignDoctor(doctorId, isPrimary, specialization)
    
    res.status(200).json({
      success: true,
      message: 'Doctor assigned successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
})

// @desc    Add medication to patient
// @route   POST /api/patients/:id/medications
// @access  Private/Doctor
router.post('/:id/medications', canAccessPatient, authorize('doctor'), auditLog('add_medication'), async (req, res) => {
  try {
    const { name, dosage, frequency, duration, instructions, notes } = req.body
    
    if (!name || !dosage || !frequency) {
      return res.status(400).json({
        success: false,
        message: 'Medication name, dosage, and frequency are required'
      })
    }
    
    const Patient = (await import('../models/Patient.js')).default
    const patient = await Patient.findById(req.params.id)
    
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      })
    }
    
    const medicationData = {
      name,
      dosage,
      frequency,
      duration,
      instructions,
      notes
    }
    
    await patient.addMedication(medicationData, req.user._id)
    
    res.status(201).json({
      success: true,
      message: 'Medication added successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
})

// @desc    Update vital signs
// @route   POST /api/patients/:id/vitals
// @access  Private/Doctor
router.post('/:id/vitals', canAccessPatient, authorize('doctor'), auditLog('update_vitals'), async (req, res) => {
  try {
    const { vitalType, value, unit } = req.body
    
    if (!vitalType || value === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Vital type and value are required'
      })
    }
    
    const Patient = (await import('../models/Patient.js')).default
    const patient = await Patient.findById(req.params.id)
    
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      })
    }
    
    await patient.updateVitals(vitalType, value, req.user._id, unit)
    
    res.status(200).json({
      success: true,
      message: 'Vital signs updated successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
})

// @desc    Get patient's medical history
// @route   GET /api/patients/:id/history
// @access  Private
router.get('/:id/history', canAccessPatient, auditLog('view_patient_history'), async (req, res) => {
  try {
    const Patient = (await import('../models/Patient.js')).default
    
    const patient = await Patient.findById(req.params.id)
      .select('medicalHistory allergies medications vitals')
      .populate('medications.prescribedBy', 'name specialization')
    
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      })
    }
    
    res.status(200).json({
      success: true,
      data: {
        medicalHistory: patient.medicalHistory,
        allergies: patient.allergies,
        medications: patient.medications.filter(med => med.isActive),
        vitals: patient.vitals
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
})

export default router
