import express from 'express'
import {
  register,
  login,
  getMe,
  updateDetails,
  updatePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
  logout,
  refreshToken
} from '../controllers/authController.js'
import { protect, sensitiveOperationLimit, auditLog } from '../middleware/auth.js'
import rateLimit from 'express-rate-limit'

const router = express.Router()

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs for auth routes
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
})

const passwordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 password reset attempts per hour
  message: {
    success: false,
    message: 'Too many password reset attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
})

// Public routes
router.post('/register', authLimiter, auditLog('user_register'), register)
router.post('/login', authLimiter, auditLog('user_login'), login)
router.post('/forgotpassword', passwordLimiter, auditLog('password_reset_request'), forgotPassword)
router.put('/resetpassword/:resettoken', passwordLimiter, auditLog('password_reset'), resetPassword)
router.get('/verifyemail/:token', auditLog('email_verification'), verifyEmail)

// Protected routes
router.get('/me', protect, getMe)
router.put('/updatedetails', protect, auditLog('update_profile'), updateDetails)
router.put('/updatepassword', protect, sensitiveOperationLimit, auditLog('password_change'), updatePassword)
router.post('/logout', protect, auditLog('user_logout'), logout)
router.post('/refresh', protect, refreshToken)

export default router
