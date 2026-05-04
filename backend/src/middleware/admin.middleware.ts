import { Request, Response, NextFunction } from 'express'
import { ApiResponse } from '../utils/apiResponse'

export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res
      .status(401)
      .json(new ApiResponse(401, null, 'Unauthorized'))
    return
  }

  if (req.user.role !== 'ADMIN') {
    res
      .status(403)
      .json(new ApiResponse(403, null, 'Forbidden - Admin access required'))
    return
  }

  return next()
}