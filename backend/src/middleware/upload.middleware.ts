// src/middleware/upload.middleware.ts
import multer, { StorageEngine } from 'multer'
import path from 'path'
import fs from 'fs'

const isServerless = !!process.env.VERCEL || process.env.NODE_ENV === 'production'

/* ──────────────────────────────────────────────────────────────────
   Storage strategy:
   - Local dev: write to ./uploads (created if missing)
   - Vercel:    use memory storage (no filesystem writes)
   ────────────────────────────────────────────────────────────────── */
let storage: StorageEngine

if (isServerless) {
  // Serverless: keep file in RAM. Push to Cloudinary/S3 in your controller.
  storage = multer.memoryStorage()
} else {
  // Local dev: persist to ./uploads
  const uploadDir = path.join(process.cwd(), 'uploads')

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
  }

  storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, uploadDir)
    },
    filename: (_req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
      cb(
        null,
        file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)
      )
    },
  })
}

const fileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(
      new Error(
        'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'
      )
    )
  }
}

export const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
})