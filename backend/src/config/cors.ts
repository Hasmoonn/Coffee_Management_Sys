import { CorsOptions } from 'cors'
import { env } from './env'

export const corsConfig: CorsOptions = {
  origin: [env.CLIENT_URL, env.ADMIN_URL],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400,
}
