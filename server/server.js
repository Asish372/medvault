import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// Import routes
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import patientRoutes from './routes/patientRoutes.js'
import recordRoutes from './routes/recordRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'

// Import middleware
import { errorHandler } from './middleware/errorHandler.js'
import { notFound } from './middleware/notFound.js'

// ES6 module __dirname equivalent
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
})
app.use(limiter)

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions))

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'MedVault API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  })
})

// routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/patients', patientRoutes)
app.use('/api/records', recordRoutes)
app.use('/api/upload', uploadRoutes)

// root test route
app.get("/", (req, res) => {
  res.json({ success: true, message: "✅ MedVault Backend Running Successfully!" });
});
// Error handling middleware
app.use(notFound)
app.use(errorHandler)

// Database connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error(`❌ Database connection error: ${error.message}`)
    process.exit(1)
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully...')
  mongoose.connection.close(() => {
    console.log('📦 Database connection closed.')
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  console.log('👋 SIGINT received. Shutting down gracefully...')
  mongoose.connection.close(() => {
    console.log('📦 Database connection closed.')
    process.exit(0)
  })
})

// Start server
const startServer = async () => {
  try {
    await connectDB()
    
    app.listen(PORT, () => {
      console.log(`🚀 MedVault Server running on port ${PORT}`)
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
      console.log(`📋 Health check: http://localhost:${PORT}/health`)
    })
  } catch (error) {
    console.error(`❌ Failed to start server: ${error.message}`)
    process.exit(1)
  }
}

startServer()

export default app
