import express from 'express'
import { protect, authorize, canAccessRecord, auditLog } from '../middleware/auth.js'

const router = express.Router()

// All routes are protected and require authentication
router.use(protect)

// @desc    Get all medical records
// @route   GET /api/records
// @access  Private/Doctor/Admin
router.get('/', authorize('doctor', 'admin'), auditLog('view_records'), async (req, res) => {
  try {
    const { patient, status, visitType, page = 1, limit = 10 } = req.query
    
    const filter = {}
    if (patient) filter.patient = patient
    if (status) filter.status = status
    if (visitType) filter.visitType = visitType
    
    // If user is a doctor, only show records they created or have access to
    if (req.user.role === 'doctor') {
      filter.$or = [
        { doctor: req.user._id },
        { 'sharedWith.user': req.user._id }
      ]
    }
    
    const MedicalRecord = (await import('../models/MedicalRecord.js')).default
    
    const records = await MedicalRecord.find(filter)
      .populate('patient', 'user')
      .populate('doctor', 'name specialization')
      .populate('patient.user', 'name email')
      .sort({ visitDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
    
    const total = await MedicalRecord.countDocuments(filter)
    
    res.status(200).json({
      success: true,
      count: records.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      },
      data: records
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
})

// @desc    Create new medical record
// @route   POST /api/records
// @access  Private/Doctor
router.post('/', authorize('doctor'), auditLog('create_record'), async (req, res) => {
  try {
    const recordData = {
      ...req.body,
      doctor: req.user._id
    }
    
    const MedicalRecord = (await import('../models/MedicalRecord.js')).default
    const record = await MedicalRecord.create(recordData)
    
    await record.populate('patient doctor', 'name email specialization')
    
    res.status(201).json({
      success: true,
      data: record,
      message: 'Medical record created successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
})

// @desc    Get single medical record
// @route   GET /api/records/:id
// @access  Private
router.get('/:id', canAccessRecord, auditLog('view_record'), async (req, res) => {
  try {
    const record = req.record
    
    // Add audit log entry for viewing
    await record.addAuditLog('viewed', req.user._id, 'Record viewed', req.ip)
    
    res.status(200).json({
      success: true,
      data: record
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
})

// @desc    Update medical record
// @route   PUT /api/records/:id
// @access  Private/Doctor
router.put('/:id', canAccessRecord, authorize('doctor'), auditLog('update_record'), async (req, res) => {
  try {
    const MedicalRecord = (await import('../models/MedicalRecord.js')).default
    
    // Check if user can edit this record
    if (req.record.doctor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      const hasWriteAccess = req.record.sharedWith.some(
        share => share.user.toString() === req.user._id.toString() && 
                share.permissions.includes('write') &&
                (!share.expiryDate || share.expiryDate > new Date())
      )
      
      if (!hasWriteAccess) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to edit this record'
        })
      }
    }
    
    const record = await MedicalRecord.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('patient doctor', 'name email specialization')
    
    res.status(200).json({
      success: true,
      data: record,
      message: 'Medical record updated successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
})

// @desc    Delete medical record
// @route   DELETE /api/records/:id
// @access  Private/Doctor/Admin
router.delete('/:id', canAccessRecord, authorize('doctor', 'admin'), auditLog('delete_record'), async (req, res) => {
  try {
    // Only the creator or admin can delete
    if (req.record.doctor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this record'
      })
    }
    
    const MedicalRecord = (await import('../models/MedicalRecord.js')).default
    await MedicalRecord.findByIdAndDelete(req.params.id)
    
    res.status(200).json({
      success: true,
      message: 'Medical record deleted successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
})

// @desc    Share medical record
// @route   POST /api/records/:id/share
// @access  Private/Doctor
router.post('/:id/share', canAccessRecord, authorize('doctor'), auditLog('share_record'), async (req, res) => {
  try {
    const { userId, permissions = ['read'], expiryDate } = req.body
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      })
    }
    
    // Only the creator can share
    if (req.record.doctor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the record creator can share it'
      })
    }
    
    await req.record.shareWith(userId, permissions, expiryDate)
    
    res.status(200).json({
      success: true,
      message: 'Record shared successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
})

// @desc    Add attachment to record
// @route   POST /api/records/:id/attachments
// @access  Private/Doctor
router.post('/:id/attachments', canAccessRecord, authorize('doctor'), auditLog('add_attachment'), async (req, res) => {
  try {
    const { fileName, filePath, fileType, fileSize, description } = req.body
    
    if (!fileName || !filePath || !fileType) {
      return res.status(400).json({
        success: false,
        message: 'File name, path, and type are required'
      })
    }
    
    const attachmentData = {
      fileName,
      filePath,
      fileType,
      fileSize,
      description
    }
    
    await req.record.addAttachment(attachmentData, req.user._id)
    
    res.status(201).json({
      success: true,
      message: 'Attachment added successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
})

// @desc    Get records by patient
// @route   GET /api/records/patient/:patientId
// @access  Private
router.get('/patient/:patientId', authorize('doctor', 'admin', 'patient'), auditLog('view_patient_records'), async (req, res) => {
  try {
    const { patientId } = req.params
    const { limit = 10 } = req.query
    
    // Check access permissions
    if (req.user.role === 'patient') {
      const Patient = (await import('../models/Patient.js')).default
      const patient = await Patient.findOne({ user: req.user._id })
      
      if (!patient || patient._id.toString() !== patientId) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to access these records'
        })
      }
    }
    
    const MedicalRecord = (await import('../models/MedicalRecord.js')).default
    const records = await MedicalRecord.findByPatient(patientId, limit)
    
    res.status(200).json({
      success: true,
      count: records.length,
      data: records
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
})

// @desc    Search medical records
// @route   GET /api/records/search
// @access  Private/Doctor/Admin
router.get('/search', authorize('doctor', 'admin'), auditLog('search_records'), async (req, res) => {
  try {
    const { q, patient, visitType, status } = req.query
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      })
    }
    
    const filters = {}
    if (patient) filters.patient = patient
    if (visitType) filters.visitType = visitType
    if (status) filters.status = status
    
    // If user is a doctor, only search their records
    if (req.user.role === 'doctor') {
      filters.$or = [
        { doctor: req.user._id },
        { 'sharedWith.user': req.user._id }
      ]
    }
    
    const MedicalRecord = (await import('../models/MedicalRecord.js')).default
    const records = await MedicalRecord.searchRecords(q, filters)
    
    res.status(200).json({
      success: true,
      count: records.length,
      data: records
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
})

export default router
