// Error handling middleware for MedVault API

export const errorHandler = (err, req, res, next) => {
  let error = { ...err }
  error.message = err.message

  // Log error
  console.error(`Error: ${err.message}`.red)

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found'
    error = {
      message,
      statusCode: 404
    }
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    let message = 'Duplicate field value entered'
    
    // Extract field name from error
    const field = Object.keys(err.keyValue)[0]
    if (field === 'email') {
      message = 'Email address is already registered'
    } else if (field === 'licenseNumber') {
      message = 'License number is already registered'
    }
    
    error = {
      message,
      statusCode: 400
    }
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ')
    error = {
      message,
      statusCode: 400
    }
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token'
    error = {
      message,
      statusCode: 401
    }
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired'
    error = {
      message,
      statusCode: 401
    }
  }

  // File upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    const message = 'File size too large'
    error = {
      message,
      statusCode: 400
    }
  }

  if (err.code === 'LIMIT_FILE_COUNT') {
    const message = 'Too many files uploaded'
    error = {
      message,
      statusCode: 400
    }
  }

  // Database connection errors
  if (err.name === 'MongoNetworkError') {
    const message = 'Database connection error'
    error = {
      message,
      statusCode: 500
    }
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
}

export const notFound = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`)
  res.status(404)
  next(error)
}
