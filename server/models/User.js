import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import validator from 'validator'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false // Don't include password in queries by default
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    validate: {
      validator: function(v) {
        return /^[+]?[\d\s\-\(\)]+$/.test(v)
      },
      message: 'Please provide a valid phone number'
    }
  },
  role: {
    type: String,
    enum: {
      values: ['admin', 'doctor', 'patient'],
      message: 'Role must be either admin, doctor, or patient'
    },
    required: [true, 'Role is required']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  profilePicture: {
    type: String,
    default: null
  },
  // Doctor-specific fields
  specialization: {
    type: String,
    required: function() {
      return this.role === 'doctor'
    }
  },
  licenseNumber: {
    type: String,
    required: function() {
      return this.role === 'doctor'
    },
    unique: true,
    sparse: true // Allows multiple null values
  },
  // Patient-specific fields
  dateOfBirth: {
    type: Date,
    required: function() {
      return this.role === 'patient'
    }
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: function() {
      return this.role === 'patient'
    }
  },
  bloodType: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    required: function() {
      return this.role === 'patient'
    }
  },
  emergencyContact: {
    name: {
      type: String,
      required: function() {
        return this.role === 'patient'
      }
    },
    phone: {
      type: String,
      required: function() {
        return this.role === 'patient'
      }
    },
    relationship: {
      type: String,
      required: function() {
        return this.role === 'patient'
      }
    }
  },
  // Audit fields
  lastLogin: {
    type: Date,
    default: null
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date,
    default: null
  },
  passwordResetToken: {
    type: String,
    default: null
  },
  passwordResetExpires: {
    type: Date,
    default: null
  },
  emailVerificationToken: {
    type: String,
    default: null
  },
  emailVerificationExpires: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Virtual for user's age (for patients)
userSchema.virtual('age').get(function() {
  if (this.dateOfBirth && this.role === 'patient') {
    return Math.floor((new Date() - this.dateOfBirth) / (365.25 * 24 * 60 * 60 * 1000))
  }
  return null
})

// Virtual for account lock status
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now())
})

// Indexes for better performance
userSchema.index({ email: 1 })
userSchema.index({ role: 1 })
userSchema.index({ licenseNumber: 1 }, { sparse: true })
userSchema.index({ createdAt: -1 })

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next()

  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password)
  } catch (error) {
    throw new Error('Password comparison failed')
  }
}

// Instance method to increment login attempts
userSchema.methods.incLoginAttempts = function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    })
  }
  
  const updates = { $inc: { loginAttempts: 1 } }
  
  // Lock account after 5 failed attempts for 2 hours
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 } // 2 hours
  }
  
  return this.updateOne(updates)
}

// Instance method to reset login attempts
userSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 }
  })
}

// Static method to find by email
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() })
}

// Static method to find active users by role
userSchema.statics.findActiveByRole = function(role) {
  return this.find({ role, isActive: true })
}

const User = mongoose.model('User', userSchema)

export default User
