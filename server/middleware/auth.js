import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// Protect routes - verify JWT token
export const protect = async (req, res, next) => {
  try {
    let token

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    }

    // Make sure token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      })
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // Get user from token
      const user = await User.findById(decoded.id).select('-password')

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'No user found with this token'
        })
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'User account is deactivated'
        })
      }

      // Check if account is locked
      if (user.isLocked) {
        return res.status(401).json({
          success: false,
          message: 'Account is temporarily locked due to multiple failed login attempts'
        })
      }

      req.user = user
      next()
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      })
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error in authentication'
    })
  }
}

// Grant access to specific roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`
      })
    }

    next()
  }
}

// Optional authentication - doesn't fail if no token
export const optionalAuth = async (req, res, next) => {
  try {
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.id).select('-password')
        
        if (user && user.isActive && !user.isLocked) {
          req.user = user
        }
      } catch (error) {
        // Token is invalid, but we continue without user
        req.user = null
      }
    }

    next()
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error in optional authentication'
    })
  }
}

// Check if user can access patient data
export const canAccessPatient = async (req, res, next) => {
  try {
    const { patientId } = req.params
    const user = req.user

    // Admin can access all patients
    if (user.role === 'admin') {
      return next()
    }

    // Patient can only access their own data
    if (user.role === 'patient') {
      const Patient = (await import('../models/Patient.js')).default
      const patient = await Patient.findOne({ user: user._id })
      
      if (!patient || patient._id.toString() !== patientId) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to access this patient data'
        })
      }
      
      req.patient = patient
      return next()
    }

    // Doctor can access assigned patients
    if (user.role === 'doctor') {
      const Patient = (await import('../models/Patient.js')).default
      const patient = await Patient.findById(patientId)
      
      if (!patient) {
        return res.status(404).json({
          success: false,
          message: 'Patient not found'
        })
      }

      const isAssigned = patient.assignedDoctors.some(
        doc => doc.doctor.toString() === user._id.toString()
      )

      if (!isAssigned) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to access this patient data'
        })
      }

      req.patient = patient
      return next()
    }

    return res.status(403).json({
      success: false,
      message: 'Not authorized to access patient data'
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error in patient access check'
    })
  }
}

// Check if user can access medical record
export const canAccessRecord = async (req, res, next) => {
  try {
    const { recordId } = req.params
    const user = req.user

    const MedicalRecord = (await import('../models/MedicalRecord.js')).default
    const record = await MedicalRecord.findById(recordId).populate('patient')

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Medical record not found'
      })
    }

    // Admin can access all records
    if (user.role === 'admin') {
      req.record = record
      return next()
    }

    // Patient can only access their own records
    if (user.role === 'patient') {
      if (record.patient.user.toString() !== user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to access this medical record'
        })
      }
      
      req.record = record
      return next()
    }

    // Doctor can access records they created or for patients they're assigned to
    if (user.role === 'doctor') {
      const isCreator = record.doctor.toString() === user._id.toString()
      const isAssignedToPatient = record.patient.assignedDoctors.some(
        doc => doc.doctor.toString() === user._id.toString()
      )
      const isSharedWith = record.sharedWith.some(
        share => share.user.toString() === user._id.toString() &&
                (!share.expiryDate || share.expiryDate > new Date())
      )

      if (!isCreator && !isAssignedToPatient && !isSharedWith) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to access this medical record'
        })
      }

      req.record = record
      return next()
    }

    return res.status(403).json({
      success: false,
      message: 'Not authorized to access medical records'
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error in record access check'
    })
  }
}

// Rate limiting for sensitive operations
export const sensitiveOperationLimit = (req, res, next) => {
  // This would typically use Redis for distributed rate limiting
  // For now, we'll use a simple in-memory approach
  const key = `${req.ip}-${req.user?._id || 'anonymous'}`
  const now = Date.now()
  const windowMs = 15 * 60 * 1000 // 15 minutes
  const maxAttempts = 5

  if (!global.sensitiveOperations) {
    global.sensitiveOperations = new Map()
  }

  const attempts = global.sensitiveOperations.get(key) || []
  const recentAttempts = attempts.filter(time => now - time < windowMs)

  if (recentAttempts.length >= maxAttempts) {
    return res.status(429).json({
      success: false,
      message: 'Too many sensitive operations. Please try again later.'
    })
  }

  recentAttempts.push(now)
  global.sensitiveOperations.set(key, recentAttempts)

  next()
}

// Audit logging middleware
export const auditLog = (action) => {
  return async (req, res, next) => {
    try {
      // Store audit information in request for later use
      req.auditInfo = {
        action,
        userId: req.user?._id,
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent'),
        timestamp: new Date()
      }

      // Continue to next middleware
      next()
    } catch (error) {
      console.error('Audit logging error:', error)
      next() // Don't fail the request due to audit logging issues
    }
  }
}
