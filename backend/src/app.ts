import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import path from 'path'

import { errorMiddleware } from './middleware/error.middleware'
import { loggerMiddleware } from './middleware/logger.middleware'
import { limiter } from './middleware/rateLimit.middleware'

import router from './routes'

const app = express()

/* ── Trust Vercel proxy (needed for rate-limit to read real IPs) ── */
app.set('trust proxy', 1)

/* ── CORS — MUST be first, before anything else ── */
const corsOptions: cors.CorsOptions = {
  origin: (_origin, cb) => cb(null, true),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'X-Api-Version',
  ],
  optionsSuccessStatus: 200,
}

app.use(cors(corsOptions))
app.options('*', cors(corsOptions))   // <-- pass same options here too

/* ── Security ── */
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false,
  })
)

/* ── Logging ── */
app.use(morgan('dev'))
app.use(loggerMiddleware)

/* ── Body parsers (BEFORE rate limit so 429 isn’t served prematurely) ── */
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

/* ── Rate limit — skip OPTIONS preflight ── */
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') return next()
  return limiter(req, res, next)
})

/* ── Static uploads (dev only) ── */
if (process.env.NODE_ENV !== 'production') {
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))
}

/* ── Routes ── */
app.use('/api', router)

app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'API is running...',
    environment: process.env.NODE_ENV,
  })
})

/* ── 404 ── */
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' })
})

/* ── Error handler ── */
app.use(errorMiddleware)

export default app