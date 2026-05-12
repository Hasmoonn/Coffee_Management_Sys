import { Request, Response, NextFunction } from 'express'

/**
 * Cache middleware for setting appropriate cache headers
 * Improves performance by leveraging browser and CDN caching
 */
export const cacheMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Set cache headers based on route
  const originalJson = res.json.bind(res)

  res.json = function (data: any) {
    // Cache static content (menu, categories) for longer
    if (
      req.path.includes('/menu') ||
      req.path.includes('/category') ||
      req.path.includes('/featured')
    ) {
      // Cache for 5 minutes for authenticated, 10 minutes for public
      res.set('Cache-Control', 'public, max-age=300')
    }
    // Don't cache auth/sensitive endpoints
    else if (
      req.path.includes('/auth') ||
      req.path.includes('/orders') ||
      req.path.includes('/user')
    ) {
      res.set('Cache-Control', 'no-cache, no-store, must-revalidate')
      res.set('Pragma', 'no-cache')
      res.set('Expires', '0')
    }
    // Default cache
    else {
      res.set('Cache-Control', 'public, max-age=60')
    }

    return originalJson(data)
  }

  next()
}

/**
 * Middleware to add Last-Modified header for better caching
 */
export const lastModifiedMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const originalJson = res.json.bind(res)

  res.json = function (data: any) {
    // Add Last-Modified header with current date
    if (!res.get('Last-Modified')) {
      res.set('Last-Modified', new Date().toUTCString())
    }

    return originalJson(data)
  }

  next()
}
