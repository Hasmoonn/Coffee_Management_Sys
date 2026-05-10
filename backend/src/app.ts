import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import path from 'path'

import { corsConfig } from './config/cors'
import { errorMiddleware } from './middleware/error.middleware'
import { loggerMiddleware } from './middleware/logger.middleware'
import { limiter } from './middleware/rateLimit.middleware'

import router from './routes'

const app = express()

// CORS configuration
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Reflect origin if it matches vercel or localhost
    if (!origin || origin.endsWith('.vercel.app') || origin.includes('localhost')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Explicitly handle all OPTIONS requests

// Security headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false,
  })
)

// Logging
app.use(morgan('dev'))
app.use(loggerMiddleware)

// Rate limiting
app.use(limiter)

// Body parser
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Static uploads (development only)
if (process.env.NODE_ENV !== 'production') {
  app.use(
    '/uploads',
    express.static(path.join(process.cwd(), 'uploads'))
  )
}

// API Routes
app.use('/api', router)

// Health check
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API is running...',
    environment: process.env.NODE_ENV,
  })
})

// 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  })
})

// Error middleware
app.use(errorMiddleware)

export default app