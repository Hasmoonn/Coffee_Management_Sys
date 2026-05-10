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

// Manual CORS middleware for Vercel stability
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && (origin.endsWith('.vercel.app') || origin.includes('localhost'))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Standard CORS middleware
app.use(cors(corsConfig))

// Security
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