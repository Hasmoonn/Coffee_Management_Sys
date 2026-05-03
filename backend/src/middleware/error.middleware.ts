import { Request, Response, NextFunction } from 'express'
import { ApiResponse } from '../utils/apiResponse'

export const errorMiddleware = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(`❌ Error: ${err.message}`)

  return res
    .status(500)
    .json(new ApiResponse(500, null, err.message || 'Server Error'))
}