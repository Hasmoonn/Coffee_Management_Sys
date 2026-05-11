import { cloudinary } from '../config/cloudinary'
import { env } from '../config/env'

export const uploadToCloudinary = async (file: Express.Multer.File): Promise<string> => {
  // If Cloudinary is not fully configured, fall back to local if possible, 
  // though in production (Vercel) local won't work.
  if (!env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY || !env.CLOUDINARY_API_SECRET) {
    console.warn('Cloudinary environment variables are missing. Image will be stored locally if configured.')
    return file.filename ? `/uploads/${file.filename}` : ''
  }

  try {
    if (file.buffer) {
      // Case 1: Memory storage (common on serverless like Vercel)
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { 
            folder: 'brew-co/menu',
            resource_type: 'auto' 
          },
          (error, result) => {
            if (error) {
              console.error('Cloudinary Stream Upload Error:', error)
              return reject(error)
            }
            resolve(result?.secure_url || '')
          }
        )
        uploadStream.end(file.buffer)
      })
    } else if (file.path) {
      // Case 2: Disk storage (common in local development)
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'brew-co/menu',
        resource_type: 'auto'
      })
      return result.secure_url
    }
    
    return ''
  } catch (error) {
    console.error('Cloudinary Upload Exception:', error)
    throw new Error('Failed to upload image to Cloudinary')
  }
}
