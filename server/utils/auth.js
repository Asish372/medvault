import jwt from 'jsonwebtoken'
import crypto from 'crypto'

// Generate JWT token
export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  })
}

// Generate refresh token
export const generateRefreshToken = () => {
  return crypto.randomBytes(40).toString('hex')
}

// Generate random token for password reset, email verification, etc.
export const generateRandomToken = () => {
  return crypto.randomBytes(20).toString('hex')
}

// Hash token for storage
export const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex')
}

// Send token response
export const sendTokenResponse = (user, statusCode, res, message = 'Success') => {
  // Create token
  const token = generateToken(user._id)

  const options = {
    expires: new Date(
      Date.now() + (process.env.JWT_COOKIE_EXPIRE || 7) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  }

  // Remove password from user object
  const userResponse = {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    isActive: user.isActive,
    isEmailVerified: user.isEmailVerified,
    profilePicture: user.profilePicture,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  }

  // Add role-specific fields
  if (user.role === 'doctor') {
    userResponse.specialization = user.specialization
    userResponse.licenseNumber = user.licenseNumber
  } else if (user.role === 'patient') {
    userResponse.dateOfBirth = user.dateOfBirth
    userResponse.gender = user.gender
    userResponse.bloodType = user.bloodType
    userResponse.age = user.age
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      message,
      token,
      user: userResponse
    })
}

// Validate password strength
export const validatePassword = (password) => {
  const errors = []

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }

  if (!/(?=.*[a-z])/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }

  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }

  if (!/(?=.*\d)/.test(password)) {
    errors.push('Password must contain at least one number')
  }

  if (!/(?=.*[@$!%*?&])/.test(password)) {
    errors.push('Password must contain at least one special character (@$!%*?&)')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// Generate secure session ID
export const generateSessionId = () => {
  return crypto.randomBytes(32).toString('hex')
}

// Create password reset URL
export const createPasswordResetURL = (token, baseURL) => {
  return `${baseURL}/reset-password?token=${token}`
}

// Create email verification URL
export const createEmailVerificationURL = (token, baseURL) => {
  return `${baseURL}/verify-email?token=${token}`
}

// Extract user agent info
export const parseUserAgent = (userAgent) => {
  const browser = userAgent.match(/(Chrome|Firefox|Safari|Edge|Opera)\/[\d.]+/i)
  const os = userAgent.match(/(Windows|Mac|Linux|Android|iOS)/i)
  
  return {
    browser: browser ? browser[0] : 'Unknown',
    os: os ? os[0] : 'Unknown',
    full: userAgent
  }
}

// Generate API key for third-party integrations
export const generateAPIKey = () => {
  const prefix = 'mv_' // MedVault prefix
  const key = crypto.randomBytes(32).toString('hex')
  return `${prefix}${key}`
}

// Validate API key format
export const validateAPIKey = (apiKey) => {
  return /^mv_[a-f0-9]{64}$/.test(apiKey)
}

// Create audit log entry
export const createAuditEntry = (action, userId, details = '', ipAddress = '', userAgent = '') => {
  return {
    action,
    userId,
    details,
    ipAddress,
    userAgent: parseUserAgent(userAgent),
    timestamp: new Date()
  }
}

// Rate limiting helpers
export const getRateLimitKey = (ip, userId = null) => {
  return userId ? `${ip}:${userId}` : ip
}

export const isRateLimited = (attempts, windowMs, maxAttempts) => {
  const now = Date.now()
  const recentAttempts = attempts.filter(time => now - time < windowMs)
  return recentAttempts.length >= maxAttempts
}

// Security headers
export const getSecurityHeaders = () => {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
  }
}

// Sanitize user input
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
}

// Generate OTP for 2FA
export const generateOTP = (length = 6) => {
  const digits = '0123456789'
  let otp = ''
  
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)]
  }
  
  return otp
}

// Verify OTP
export const verifyOTP = (inputOTP, storedOTP, expiryTime) => {
  if (!inputOTP || !storedOTP || !expiryTime) {
    return false
  }
  
  if (Date.now() > expiryTime) {
    return false // OTP expired
  }
  
  return inputOTP === storedOTP
}
