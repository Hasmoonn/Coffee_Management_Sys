import { Request, Response, NextFunction } from 'express'
import { ApiResponse } from '../utils/apiResponse'
import { prisma } from '../config/database'
import { verifyAccessToken } from '../utils/generateToken'

declare global {
  namespace Express {
    interface Request {
      user?: any
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      res
        .status(401)
        .json(new ApiResponse(401, null, 'Unauthorized - No token provided'))
      return
    }

    const decoded = verifyAccessToken(token)
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    })

    if (!user || !user.isActive) {
      res
        .status(401)
        .json(
          new ApiResponse(
            401,
            null,
            'Unauthorized - User not found or inactive'
          )
        )
      return
    }

    req.user = user
    return next()
  } catch {
    res
      .status(401)
      .json(new ApiResponse(401, null, 'Unauthorized - Invalid token'))
    return
  }
}