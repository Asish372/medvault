import mongoose from 'mongoose'

const medicalRecordSchema = new mongoose.Schema({
  // Patient and Doctor References
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Visit Information
  visitDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  visitType: {
    type: String,
    enum: ['consultation', 'follow-up', 'emergency', 'routine-checkup', 'procedure', 'lab-review', 'telemedicine'],
    required: true
  },
  // Chief Complaint and Assessment
  chiefComplaint: {
    type: String,
    required: true,
    maxlength: 500
  },
  presentIllness: {
    type: String,
    maxlength: 2000
  },
  // Physical Examination
  physicalExam: {
    general: String,
    vitals: {
      bloodPressure: {
        systolic: Number,
        diastolic: Number
      },
      heartRate: Number,
      temperature: {
        value: Number,
        unit: {
          type: String,
          enum: ['celsius', 'fahrenheit'],
          default: 'celsius'
        }
      },
      respiratoryRate: Number,
      oxygenSaturation: Number,
      weight: {
        value: Number,
        unit: {
          type: String,
          enum: ['kg', 'lbs'],
          default: 'kg'
        }
      },
      height: {
        value: Number,
        unit: {
          type: String,
          enum: ['cm', 'inches'],
          default: 'cm'
        }
      }
    },
    systems: {
      cardiovascular: String,
      respiratory: String,
      gastrointestinal: String,
      neurological: String,
      musculoskeletal: String,
      dermatological: String,
      other: String
    }
  },
  // Diagnosis and Assessment
  diagnosis: [{
    primary: {
      type: Boolean,
      default: false
    },
    condition: {
      type: String,
      required: true
    },
    icdCode: String,
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe', 'critical']
    },
    status: {
      type: String,
      enum: ['new', 'existing', 'resolved', 'chronic'],
      default: 'new'
    }
  }],
  // Treatment Plan
  treatment: {
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
      duration: String,
      instructions: String,
      isNew: {
        type: Boolean,
        default: true
      }
    }],
    procedures: [{
      name: {
        type: String,
        required: true
      },
      date: Date,
      status: {
        type: String,
        enum: ['planned', 'completed', 'cancelled'],
        default: 'planned'
      },
      notes: String
    }],
    recommendations: [String],
    followUpInstructions: String,
    followUpDate: Date
  },
  // Lab Orders and Results
  labOrders: [{
    testName: {
      type: String,
      required: true
    },
    orderedDate: {
      type: Date,
      default: Date.now
    },
    urgency: {
      type: String,
      enum: ['routine', 'urgent', 'stat'],
      default: 'routine'
    },
    status: {
      type: String,
      enum: ['ordered', 'collected', 'processing', 'completed', 'cancelled'],
      default: 'ordered'
    },
    results: {
      value: String,
      unit: String,
      referenceRange: String,
      abnormalFlag: {
        type: String,
        enum: ['normal', 'high', 'low', 'critical']
      },
      completedDate: Date,
      notes: String
    }
  }],
  // Imaging Studies
  imaging: [{
    studyType: {
      type: String,
      required: true
    },
    orderedDate: {
      type: Date,
      default: Date.now
    },
    scheduledDate: Date,
    completedDate: Date,
    status: {
      type: String,
      enum: ['ordered', 'scheduled', 'completed', 'cancelled'],
      default: 'ordered'
    },
    findings: String,
    impression: String,
    radiologist: String
  }],
  // Attachments and Documents
  attachments: [{
    fileName: {
      type: String,
      required: true
    },
    filePath: {
      type: String,
      required: true
    },
    fileType: {
      type: String,
      enum: ['image', 'pdf', 'document', 'lab-result', 'imaging'],
      required: true
    },
    fileSize: Number,
    uploadedDate: {
      type: Date,
      default: Date.now
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    description: String
  }],
  // Notes and Comments
  clinicalNotes: {
    type: String,
    maxlength: 5000
  },
  privateNotes: {
    type: String,
    maxlength: 2000
  },
  // Status and Workflow
  status: {
    type: String,
    enum: ['draft', 'pending-review', 'completed', 'amended'],
    default: 'draft'
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  // Billing and Insurance
  billing: {
    insuranceClaim: {
      claimNumber: String,
      status: {
        type: String,
        enum: ['pending', 'submitted', 'approved', 'denied', 'paid']
      },
      amount: Number
    },
    charges: [{
      description: String,
      code: String,
      amount: Number
    }],
    totalAmount: Number,
    patientResponsibility: Number
  },
  // Audit Trail
  auditLog: [{
    action: {
      type: String,
      enum: ['created', 'updated', 'viewed', 'shared', 'deleted'],
      required: true
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    details: String,
    ipAddress: String
  }],
  // Sharing and Permissions
  sharedWith: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    sharedDate: {
      type: Date,
      default: Date.now
    },
    permissions: {
      type: [String],
      enum: ['read', 'write', 'share'],
      default: ['read']
    },
    expiryDate: Date
  }],
  // Version Control
  version: {
    type: Number,
    default: 1
  },
  previousVersions: [{
    version: Number,
    modifiedDate: Date,
    modifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    changes: String
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Virtual for primary diagnosis
medicalRecordSchema.virtual('primaryDiagnosis').get(function() {
  return this.diagnosis.find(d => d.primary) || this.diagnosis[0]
})

// Virtual for record age
medicalRecordSchema.virtual('recordAge').get(function() {
  const now = new Date()
  const visitDate = new Date(this.visitDate)
  const diffTime = Math.abs(now - visitDate)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
})

// Virtual for has attachments
medicalRecordSchema.virtual('hasAttachments').get(function() {
  return this.attachments && this.attachments.length > 0
})

// Indexes for better performance
medicalRecordSchema.index({ patient: 1, visitDate: -1 })
medicalRecordSchema.index({ doctor: 1, visitDate: -1 })
medicalRecordSchema.index({ status: 1 })
medicalRecordSchema.index({ visitType: 1 })
medicalRecordSchema.index({ 'diagnosis.condition': 'text', 'chiefComplaint': 'text' })
medicalRecordSchema.index({ createdAt: -1 })

// Pre-save middleware to ensure only one primary diagnosis
medicalRecordSchema.pre('save', function(next) {
  if (this.isModified('diagnosis')) {
    const primaryDiagnoses = this.diagnosis.filter(d => d.primary)
    if (primaryDiagnoses.length > 1) {
      // Keep only the first primary diagnosis
      this.diagnosis.forEach((d, index) => {
        if (d.primary && index > 0) {
          d.primary = false
        }
      })
    }
  }
  next()
})

// Pre-save middleware to add audit log entry
medicalRecordSchema.pre('save', function(next) {
  if (this.isNew) {
    this.auditLog.push({
      action: 'created',
      performedBy: this.doctor,
      timestamp: new Date(),
      details: 'Medical record created'
    })
  } else if (this.isModified()) {
    this.auditLog.push({
      action: 'updated',
      performedBy: this.doctor,
      timestamp: new Date(),
      details: 'Medical record updated'
    })
  }
  next()
})

// Static method to find records by patient
medicalRecordSchema.statics.findByPatient = function(patientId, limit = 10) {
  return this.find({ patient: patientId })
    .sort({ visitDate: -1 })
    .limit(limit)
    .populate('doctor', 'name specialization')
}

// Static method to find records by doctor
medicalRecordSchema.statics.findByDoctor = function(doctorId, limit = 20) {
  return this.find({ doctor: doctorId })
    .sort({ visitDate: -1 })
    .limit(limit)
    .populate('patient')
}

// Static method to search records
medicalRecordSchema.statics.searchRecords = function(query, filters = {}) {
  const searchQuery = {
    $text: { $search: query },
    ...filters
  }
  
  return this.find(searchQuery)
    .sort({ score: { $meta: 'textScore' }, visitDate: -1 })
    .populate('patient doctor', 'name email')
}

// Instance method to add audit log entry
medicalRecordSchema.methods.addAuditLog = function(action, performedBy, details = '', ipAddress = '') {
  this.auditLog.push({
    action,
    performedBy,
    timestamp: new Date(),
    details,
    ipAddress
  })
  return this.save()
}

// Instance method to share record
medicalRecordSchema.methods.shareWith = function(userId, permissions = ['read'], expiryDate = null) {
  // Remove existing sharing with this user
  this.sharedWith = this.sharedWith.filter(
    share => share.user.toString() !== userId.toString()
  )
  
  // Add new sharing
  this.sharedWith.push({
    user: userId,
    permissions,
    expiryDate,
    sharedDate: new Date()
  })
  
  return this.save()
}

// Instance method to add attachment
medicalRecordSchema.methods.addAttachment = function(attachmentData, uploadedBy) {
  this.attachments.push({
    ...attachmentData,
    uploadedBy,
    uploadedDate: new Date()
  })
  return this.save()
}

const MedicalRecord = mongoose.model('MedicalRecord', medicalRecordSchema)

export default MedicalRecord
