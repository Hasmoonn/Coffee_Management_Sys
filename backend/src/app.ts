import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { corsConfig } from './config/cors'
import { errorMiddleware } from './middleware/error.middleware'
import { loggerMiddleware } from './middleware/logger.middleware'
import { limiter } from './middleware/rateLimit.middleware'
import router from './routes/index'

const app = express()

// Security middleware
app.use(helmet())
app.use(cors(corsConfig))

// Logging middleware
app.use(morgan('combined'))
app.use(loggerMiddleware)

// Rate limiting
app.use(limiter)

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// API routes
app.use('/api', router)

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    statusCode: 404,
    message: 'Route not found',
    success: false,
  })
})

// Error middleware (must be last)
app.use(errorMiddleware)

export default app
