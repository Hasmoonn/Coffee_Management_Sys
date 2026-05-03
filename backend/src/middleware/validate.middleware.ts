import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import { ApiResponse } from '../utils/apiResponse'

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res
      .status(400)
      .json(new ApiResponse(400, errors.array(), 'Validation failed'))
    return
  }
  return next()
}