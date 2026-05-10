import { CorsOptions } from 'cors'
import { env } from './env'

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
  'https://coffee-management-frontend.vercel.app',
  env.CLIENT_URL,
  env.ADMIN_URL,
].filter(Boolean)

export const corsConfig: CorsOptions = {
  origin: (origin, callback) => {
    // Allow if no origin (Postman, mobile) or if in allowed list
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true)
    } else {
      callback(null, false)
    }
  },

  credentials: true,

  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],

  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],

  maxAge: 86400,
}