import User from '../models/User.js'
import Patient from '../models/Patient.js'
import { 
  sendTokenResponse, 
  validatePassword, 
  generateRandomToken, 
  hashToken,
  createPasswordResetURL,
  createEmailVerificationURL,
  sanitizeInput
} from '../utils/auth.js'
import crypto from 'crypto'

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone, role, ...additionalData } = req.body

    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeInput(name),
      email: sanitizeInput(email).toLowerCase(),
      phone: sanitizeInput(phone),
      role: sanitizeInput(role)
    }

    // Validate password strength
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Password does not meet requirements',
        errors: passwordValidation.errors
      })
    }

    // Check if user already exists
    const existingUser = await User.findByEmail(sanitizedData.email)
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      })
    }

    // Prepare user data based on role
    let userData = { ...sanitizedData, password }

    if (role === 'doctor') {
      const { specialization, licenseNumber } = additionalData
      if (!specialization || !licenseNumber) {
        return res.status(400).json({
          success: false,
          message: 'Specialization and license number are required for doctors'
        })
      }
      userData.specialization = sanitizeInput(specialization)
      userData.licenseNumber = sanitizeInput(licenseNumber)
    } else if (role === 'patient') {
      const { dateOfBirth, gender, bloodType, emergencyContact } = additionalData
      if (!dateOfBirth || !gender || !bloodType || !emergencyContact) {
        return res.status(400).json({
          success: false,
          message: 'Date of birth, gender, blood type, and emergency contact are required for patients'
        })
      }
      userData.dateOfBirth = new Date(dateOfBirth)
      userData.gender = sanitizeInput(gender)
      userData.bloodType = sanitizeInput(bloodType)
      userData.emergencyContact = {
        name: sanitizeInput(emergencyContact.name),
        phone: sanitizeInput(emergencyContact.phone),
        relationship: sanitizeInput(emergencyContact.relationship)
      }
    }

    // Create user
    const user = await User.create(userData)

    // Create patient record if user is a patient
    if (role === 'patient') {
      await Patient.create({
        user: user._id,
        status: 'active',
        riskLevel: 'low'
      })
    }

    // Generate email verification token
    const emailToken = generateRandomToken()
    const hashedEmailToken = hashToken(emailToken)
    
    user.emailVerificationToken = hashedEmailToken
    user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    await user.save()

    // TODO: Send verification email
    // await sendVerificationEmail(user.email, emailToken)

    sendTokenResponse(user, 201, res, 'User registered successfully. Please check your email for verification.')
  } catch (error) {
    next(error)
  }
}

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    // Validate email and password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email and password'
      })
    }

    // Check for user (include password for comparison)
    const user = await User.findByEmail(email).select('+password')

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      })
    }

    // Check if account is locked
    if (user.isLocked) {
      return res.status(423).json({
        success: false,
        message: 'Account is temporarily locked due to multiple failed login attempts. Please try again later.'
      })
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      })
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password)

    if (!isMatch) {
      // Increment login attempts
      await user.incLoginAttempts()
      
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      })
    }

    // Reset login attempts on successful login
    if (user.loginAttempts > 0) {
      await user.resetLoginAttempts()
    }

    // Update last login
    user.lastLogin = new Date()
    await user.save()

    sendTokenResponse(user, 200, res, 'Login successful')
  } catch (error) {
    next(error)
  }
}

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)

    res.status(200).json({
      success: true,
      data: user
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update user details
// @route   PUT /api/auth/updatedetails
// @access  Private
export const updateDetails = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      phone: req.body.phone
    }

    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach(key => 
      fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    )

    // Sanitize inputs
    Object.keys(fieldsToUpdate).forEach(key => {
      if (typeof fieldsToUpdate[key] === 'string') {
        fieldsToUpdate[key] = sanitizeInput(fieldsToUpdate[key])
      }
    })

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    })

    res.status(200).json({
      success: true,
      data: user,
      message: 'Details updated successfully'
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
export const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password'
      })
    }

    // Get user with password
    const user = await User.findById(req.user.id).select('+password')

    // Check current password
    const isMatch = await user.comparePassword(currentPassword)

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      })
    }

    // Validate new password
    const passwordValidation = validatePassword(newPassword)
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'New password does not meet requirements',
        errors: passwordValidation.errors
      })
    }

    // Update password
    user.password = newPassword
    await user.save()

    sendTokenResponse(user, 200, res, 'Password updated successfully')
  } catch (error) {
    next(error)
  }
}

// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
// @access  Public
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email address'
      })
    }

    const user = await User.findByEmail(email)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No user found with that email address'
      })
    }

    // Generate reset token
    const resetToken = generateRandomToken()
    const hashedToken = hashToken(resetToken)

    // Set reset password token and expiry
    user.passwordResetToken = hashedToken
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000 // 10 minutes

    await user.save()

    // Create reset URL
    const resetUrl = createPasswordResetURL(resetToken, process.env.FRONTEND_URL)

    // TODO: Send password reset email
    // await sendPasswordResetEmail(user.email, resetUrl)

    res.status(200).json({
      success: true,
      message: 'Password reset email sent',
      resetUrl: process.env.NODE_ENV === 'development' ? resetUrl : undefined
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Reset password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
export const resetPassword = async (req, res, next) => {
  try {
    const { newPassword } = req.body
    const resetToken = req.params.resettoken

    if (!newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a new password'
      })
    }

    // Validate new password
    const passwordValidation = validatePassword(newPassword)
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Password does not meet requirements',
        errors: passwordValidation.errors
      })
    }

    // Get hashed token
    const hashedToken = hashToken(resetToken)

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    })

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      })
    }

    // Set new password
    user.password = newPassword
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save()

    sendTokenResponse(user, 200, res, 'Password reset successful')
  } catch (error) {
    next(error)
  }
}

// @desc    Verify email
// @route   GET /api/auth/verifyemail/:token
// @access  Public
export const verifyEmail = async (req, res, next) => {
  try {
    const verificationToken = req.params.token

    // Get hashed token
    const hashedToken = hashToken(verificationToken)

    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() }
    })

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token'
      })
    }

    // Update user
    user.isEmailVerified = true
    user.emailVerificationToken = undefined
    user.emailVerificationExpires = undefined
    await user.save()

    res.status(200).json({
      success: true,
      message: 'Email verified successfully'
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res, next) => {
  try {
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
    })

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Refresh token
// @route   POST /api/auth/refresh
// @access  Private
export const refreshToken = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User not found or inactive'
      })
    }

    sendTokenResponse(user, 200, res, 'Token refreshed successfully')
  } catch (error) {
    next(error)
  }
}
