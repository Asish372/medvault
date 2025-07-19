import express from 'express'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import { protect, authorize, auditLog } from '../middleware/auth.js'
import fs from 'fs'

const router = express.Router()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// All routes are protected and require authentication
router.use(protect)

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads')
    
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true })
    }
    
    cb(null, uploadPath)
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const extension = path.extname(file.originalname)
    const baseName = path.basename(file.originalname, extension)
    cb(null, `${baseName}-${uniqueSuffix}${extension}`)
  }
})

// File filter function
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ]
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Invalid file type. Only images, PDFs, and documents are allowed.'), false)
  }
}

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 5 // Maximum 5 files per request
  },
  fileFilter: fileFilter
})

// @desc    Upload single file
// @route   POST /api/upload/single
// @access  Private/Doctor/Admin
router.post('/single', authorize('doctor', 'admin'), auditLog('upload_file'), upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      })
    }
    
    const fileInfo = {
      fileName: req.file.originalname,
      filePath: req.file.path,
      fileType: getFileType(req.file.mimetype),
      fileSize: req.file.size,
      mimetype: req.file.mimetype,
      uploadedBy: req.user._id,
      uploadedAt: new Date()
    }
    
    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      data: fileInfo
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'File upload failed',
      error: error.message
    })
  }
})

// @desc    Upload multiple files
// @route   POST /api/upload/multiple
// @access  Private/Doctor/Admin
router.post('/multiple', authorize('doctor', 'admin'), auditLog('upload_files'), upload.array('files', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      })
    }
    
    const filesInfo = req.files.map(file => ({
      fileName: file.originalname,
      filePath: file.path,
      fileType: getFileType(file.mimetype),
      fileSize: file.size,
      mimetype: file.mimetype,
      uploadedBy: req.user._id,
      uploadedAt: new Date()
    }))
    
    res.status(200).json({
      success: true,
      message: `${req.files.length} files uploaded successfully`,
      data: filesInfo
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'File upload failed',
      error: error.message
    })
  }
})

// @desc    Upload profile picture
// @route   POST /api/upload/profile
// @access  Private
router.post('/profile', auditLog('upload_profile_picture'), upload.single('profilePicture'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No profile picture uploaded'
      })
    }
    
    // Check if file is an image
    if (!req.file.mimetype.startsWith('image/')) {
      return res.status(400).json({
        success: false,
        message: 'Profile picture must be an image'
      })
    }
    
    // Update user's profile picture
    const User = (await import('../models/User.js')).default
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profilePicture: req.file.path },
      { new: true }
    ).select('-password')
    
    res.status(200).json({
      success: true,
      message: 'Profile picture uploaded successfully',
      data: {
        profilePicture: req.file.path,
        user: user
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Profile picture upload failed',
      error: error.message
    })
  }
})

// @desc    Get uploaded file
// @route   GET /api/upload/file/:filename
// @access  Private
router.get('/file/:filename', auditLog('download_file'), async (req, res) => {
  try {
    const filename = req.params.filename
    const filePath = path.join(__dirname, '../uploads', filename)
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      })
    }
    
    // Set appropriate headers
    const stat = fs.statSync(filePath)
    const fileExtension = path.extname(filename).toLowerCase()
    
    res.setHeader('Content-Length', stat.size)
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
    
    // Set content type based on file extension
    const contentType = getContentType(fileExtension)
    res.setHeader('Content-Type', contentType)
    
    // Stream the file
    const fileStream = fs.createReadStream(filePath)
    fileStream.pipe(res)
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'File download failed',
      error: error.message
    })
  }
})

// @desc    Delete uploaded file
// @route   DELETE /api/upload/file/:filename
// @access  Private/Doctor/Admin
router.delete('/file/:filename', authorize('doctor', 'admin'), auditLog('delete_file'), async (req, res) => {
  try {
    const filename = req.params.filename
    const filePath = path.join(__dirname, '../uploads', filename)
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      })
    }
    
    // Delete the file
    fs.unlinkSync(filePath)
    
    res.status(200).json({
      success: true,
      message: 'File deleted successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'File deletion failed',
      error: error.message
    })
  }
})

// @desc    Get file info
// @route   GET /api/upload/info/:filename
// @access  Private
router.get('/info/:filename', auditLog('get_file_info'), async (req, res) => {
  try {
    const filename = req.params.filename
    const filePath = path.join(__dirname, '../uploads', filename)
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      })
    }
    
    const stat = fs.statSync(filePath)
    const fileExtension = path.extname(filename)
    
    const fileInfo = {
      filename: filename,
      size: stat.size,
      extension: fileExtension,
      type: getFileType(getContentType(fileExtension)),
      created: stat.birthtime,
      modified: stat.mtime
    }
    
    res.status(200).json({
      success: true,
      data: fileInfo
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get file info',
      error: error.message
    })
  }
})

// Helper function to determine file type based on mimetype
function getFileType(mimetype) {
  if (mimetype.startsWith('image/')) {
    return 'image'
  } else if (mimetype === 'application/pdf') {
    return 'pdf'
  } else if (mimetype.includes('document') || mimetype.includes('word')) {
    return 'document'
  } else if (mimetype === 'text/plain') {
    return 'text'
  } else {
    return 'other'
  }
}

// Helper function to get content type based on file extension
function getContentType(extension) {
  const contentTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.txt': 'text/plain'
  }
  
  return contentTypes[extension] || 'application/octet-stream'
}

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum size is 10MB.'
      })
    } else if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Maximum 5 files allowed.'
      })
    } else if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected file field.'
      })
    }
  }
  
  res.status(400).json({
    success: false,
    message: error.message || 'File upload error'
  })
})

export default router
