import { CorsOptions } from 'cors'
import { env } from './env'

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  env.CLIENT_URL,
  env.ADMIN_URL,
].filter(Boolean)

export const corsConfig: CorsOptions = {
  origin: (origin, callback) => {
    // Allow Postman/mobile apps/no-origin requests
    if (!origin) 
      return callback(null, true)

    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },

  credentials: true,

  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],

  allowedHeaders: ['Content-Type', 'Authorization'],

  maxAge: 86400,
}