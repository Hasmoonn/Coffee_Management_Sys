import rateLimit from 'express-rate-limit'
import { env } from '../config/env'

const isDev = process.env.NODE_ENV !== 'production'

/* Skip CORS preflight requests for ALL limiters */
const skipPreflight = (req: { method: string }) => req.method === 'OPTIONS'

export const limiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  message: {
    success: false,
    message: 'Too many requests. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipPreflight,
})

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDev ? 100 : 10,
  message: {
    success: false,
    message: 'Too many login attempts. Please wait 15 minutes and try again.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipPreflight,
})

export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30,
  message: {
    success: false,
    message: 'Too many API requests. Please slow down.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipPreflight,
})