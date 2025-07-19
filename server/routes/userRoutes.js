import express from 'express'
import { protect, authorize, auditLog } from '../middleware/auth.js'

const router = express.Router()

// All routes are protected and require authentication
router.use(protect)

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
router.get('/', authorize('admin'), auditLog('view_users'), async (req, res) => {
  try {
    const { role, status, page = 1, limit = 10 } = req.query
    
    const filter = {}
    if (role) filter.role = role
    if (status) filter.isActive = status === 'active'
    
    const User = (await import('../models/User.js')).default
    
    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
    
    const total = await User.countDocuments(filter)
    
    res.status(200).json({
      success: true,
      count: users.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      },
      data: users
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
})

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
router.get('/:id', authorize('admin'), auditLog('view_user'), async (req, res) => {
  try {
    const User = (await import('../models/User.js')).default
    const user = await User.findById(req.params.id).select('-password')
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }
    
    res.status(200).json({
      success: true,
      data: user
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
})

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
router.put('/:id', authorize('admin'), auditLog('update_user'), async (req, res) => {
  try {
    const User = (await import('../models/User.js')).default
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).select('-password')
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }
    
    res.status(200).json({
      success: true,
      data: user,
      message: 'User updated successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
})

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
router.delete('/:id', authorize('admin'), auditLog('delete_user'), async (req, res) => {
  try {
    const User = (await import('../models/User.js')).default
    
    const user = await User.findById(req.params.id)
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }
    
    // Soft delete by deactivating user
    user.isActive = false
    await user.save()
    
    res.status(200).json({
      success: true,
      message: 'User deactivated successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
})

// @desc    Get doctors
// @route   GET /api/users/doctors
// @access  Private
router.get('/role/doctors', async (req, res) => {
  try {
    const User = (await import('../models/User.js')).default
    
    const doctors = await User.findActiveByRole('doctor')
      .select('name email specialization licenseNumber')
    
    res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
})

// @desc    Get patients
// @route   GET /api/users/patients
// @access  Private/Doctor/Admin
router.get('/role/patients', authorize('doctor', 'admin'), async (req, res) => {
  try {
    const User = (await import('../models/User.js')).default
    
    const patients = await User.findActiveByRole('patient')
      .select('name email phone dateOfBirth gender bloodType')
    
    res.status(200).json({
      success: true,
      count: patients.length,
      data: patients
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
})

export default router
