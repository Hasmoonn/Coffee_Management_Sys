import { Request, Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler'
import { ApiResponse } from '../utils/apiResponse'
import * as authService from '../services/auth.service'
import * as emailService from '../services/email.service'

export const register = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, email, phone, password } = req.body
    const result = await authService.registerUser({
      name,
      email,
      phone,
      password
    })

    await emailService.sendWelcomeEmail(email, name)

    return res
      .status(201)
      .json(new ApiResponse(201, result, 'Registration successful'))
  }
)

export const login = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, password } = req.body
    const result = await authService.loginUser({ email, password })
    return res
      .status(200)
      .json(new ApiResponse(200, result, 'Login successful'))
  }
)

export const logout = asyncHandler(
  async (_req: Request, res: Response) => {
    return res
      .status(200)
      .json(new ApiResponse(200, null, 'Logout successful'))
  }
)

export const refreshToken = asyncHandler(
  async (req: Request, res: Response) => {
    const { token } = req.body
    if (!token) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, 'Refresh token is required'))
    }
    const result = await authService.refreshToken(token)
    return res
      .status(200)
      .json(new ApiResponse(200, result, 'Token refreshed'))
  }
)

export const forgotPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body
    await authService.forgotPassword(email)
    return res
      .status(200)
      .json(new ApiResponse(200, null, 'Reset email sent'))
  }
)

export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { token, password } = req.body
    await authService.resetPassword(token, password)
    return res
      .status(200)
      .json(new ApiResponse(200, null, 'Password reset successful'))
  }
)

export const verifyEmail = asyncHandler(
  async (req: Request, res: Response) => {
    const { token } = req.params
    await authService.verifyEmail(token)
    return res
      .status(200)
      .json(new ApiResponse(200, null, 'Email verified'))
  }
)