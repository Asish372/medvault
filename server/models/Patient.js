import mongoose from 'mongoose'

const patientSchema = new mongoose.Schema({
  // Reference to User model
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  // Medical Information
  medicalHistory: [{
    condition: {
      type: String,
      required: true
    },
    diagnosedDate: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ['active', 'resolved', 'chronic', 'monitoring'],
      default: 'active'
    },
    notes: String
  }],
  allergies: [{
    allergen: {
      type: String,
      required: true
    },
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe', 'life-threatening'],
      required: true
    },
    reaction: String,
    notes: String
  }],
  medications: [{
    name: {
      type: String,
      required: true
    },
    dosage: {
      type: String,
      required: true
    },
    frequency: {
      type: String,
      required: true
    },
    prescribedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    prescribedDate: {
      type: Date,
      required: true,
      default: Date.now
    },
    endDate: Date,
    isActive: {
      type: Boolean,
      default: true
    },
    notes: String
  }],
  // Vital Signs (latest readings)
  vitals: {
    bloodPressure: {
      systolic: Number,
      diastolic: Number,
      recordedDate: Date,
      recordedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    },
    heartRate: {
      value: Number,
      recordedDate: Date,
      recordedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    },
    temperature: {
      value: Number,
      unit: {
        type: String,
        enum: ['celsius', 'fahrenheit'],
        default: 'celsius'
      },
      recordedDate: Date,
      recordedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    },
    weight: {
      value: Number,
      unit: {
        type: String,
        enum: ['kg', 'lbs'],
        default: 'kg'
      },
      recordedDate: Date,
      recordedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    },
    height: {
      value: Number,
      unit: {
        type: String,
        enum: ['cm', 'inches'],
        default: 'cm'
      },
      recordedDate: Date,
      recordedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    }
  },
  // Assigned Healthcare Providers
  assignedDoctors: [{
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    assignedDate: {
      type: Date,
      default: Date.now
    },
    isPrimary: {
      type: Boolean,
      default: false
    },
    specialization: String
  }],
  // Insurance Information
  insurance: {
    provider: String,
    policyNumber: String,
    groupNumber: String,
    expiryDate: Date,
    isActive: {
      type: Boolean,
      default: true
    }
  },
  // Status and Flags
  status: {
    type: String,
    enum: ['active', 'inactive', 'deceased', 'transferred'],
    default: 'active'
  },
  riskLevel: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'low'
  },
  // Privacy and Consent
  consentGiven: {
    dataSharing: {
      type: Boolean,
      default: false
    },
    researchParticipation: {
      type: Boolean,
      default: false
    },
    emergencyContact: {
      type: Boolean,
      default: true
    },
    consentDate: {
      type: Date,
      default: Date.now
    }
  },
  // Audit Trail
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Virtual for BMI calculation
patientSchema.virtual('bmi').get(function() {
  if (this.vitals.weight?.value && this.vitals.height?.value) {
    const weightInKg = this.vitals.weight.unit === 'lbs' 
      ? this.vitals.weight.value * 0.453592 
      : this.vitals.weight.value
    
    const heightInM = this.vitals.height.unit === 'inches' 
      ? this.vitals.height.value * 0.0254 
      : this.vitals.height.value / 100
    
    return Math.round((weightInKg / (heightInM * heightInM)) * 10) / 10
  }
  return null
})

// Virtual for active medications count
patientSchema.virtual('activeMedicationsCount').get(function() {
  return this.medications.filter(med => med.isActive).length
})

// Virtual for primary doctor
patientSchema.virtual('primaryDoctor').get(function() {
  const primary = this.assignedDoctors.find(doc => doc.isPrimary)
  return primary ? primary.doctor : null
})

// Indexes for better performance
patientSchema.index({ user: 1 })
patientSchema.index({ status: 1 })
patientSchema.index({ riskLevel: 1 })
patientSchema.index({ 'assignedDoctors.doctor': 1 })
patientSchema.index({ createdAt: -1 })

// Pre-save middleware to ensure only one primary doctor
patientSchema.pre('save', function(next) {
  if (this.isModified('assignedDoctors')) {
    const primaryDoctors = this.assignedDoctors.filter(doc => doc.isPrimary)
    if (primaryDoctors.length > 1) {
      // Keep only the first primary doctor
      this.assignedDoctors.forEach((doc, index) => {
        if (doc.isPrimary && index > 0) {
          doc.isPrimary = false
        }
      })
    }
  }
  next()
})

// Static method to find patients by doctor
patientSchema.statics.findByDoctor = function(doctorId) {
  return this.find({
    'assignedDoctors.doctor': doctorId,
    status: 'active'
  }).populate('user', 'name email phone')
}

// Static method to find high-risk patients
patientSchema.statics.findHighRisk = function() {
  return this.find({
    riskLevel: { $in: ['high', 'critical'] },
    status: 'active'
  }).populate('user', 'name email phone')
}

// Instance method to assign doctor
patientSchema.methods.assignDoctor = function(doctorId, isPrimary = false, specialization = '') {
  // Check if doctor is already assigned
  const existingAssignment = this.assignedDoctors.find(
    doc => doc.doctor.toString() === doctorId.toString()
  )
  
  if (existingAssignment) {
    existingAssignment.isPrimary = isPrimary
    existingAssignment.specialization = specialization
  } else {
    // If setting as primary, remove primary status from others
    if (isPrimary) {
      this.assignedDoctors.forEach(doc => {
        doc.isPrimary = false
      })
    }
    
    this.assignedDoctors.push({
      doctor: doctorId,
      isPrimary,
      specialization,
      assignedDate: new Date()
    })
  }
  
  return this.save()
}

// Instance method to remove doctor
patientSchema.methods.removeDoctor = function(doctorId) {
  this.assignedDoctors = this.assignedDoctors.filter(
    doc => doc.doctor.toString() !== doctorId.toString()
  )
  return this.save()
}

// Instance method to add medication
patientSchema.methods.addMedication = function(medicationData, prescribedBy) {
  this.medications.push({
    ...medicationData,
    prescribedBy,
    prescribedDate: new Date()
  })
  return this.save()
}

// Instance method to update vital signs
patientSchema.methods.updateVitals = function(vitalType, value, recordedBy, unit = null) {
  if (!this.vitals[vitalType]) {
    this.vitals[vitalType] = {}
  }
  
  if (vitalType === 'bloodPressure') {
    this.vitals[vitalType].systolic = value.systolic
    this.vitals[vitalType].diastolic = value.diastolic
  } else {
    this.vitals[vitalType].value = value
    if (unit) {
      this.vitals[vitalType].unit = unit
    }
  }
  
  this.vitals[vitalType].recordedDate = new Date()
  this.vitals[vitalType].recordedBy = recordedBy
  
  return this.save()
}

const Patient = mongoose.model('Patient', patientSchema)

export default Patient
