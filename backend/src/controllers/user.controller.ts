import { Request, Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler'
import { ApiResponse } from '../utils/apiResponse'
import * as userService from '../services/user.service'

export const getUserProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user.id
    
    const user = await userService.getUserById(userId)
    return res
      .status(200)
      .json(new ApiResponse(200, user, 'User profile fetched'))
  }
)

export const updateUserProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user.id
    const { name, phone, dateOfBirth } = req.body
    const user = await userService.updateUser(userId, {
      name,
      phone,
      dateOfBirth,
    })
    return res
      .status(200)
      .json(new ApiResponse(200, user, 'Profile updated successfully'))
  }
)

export const getAllUsers = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await userService.getAllUsers(req.query)
    return res
      .status(200)
      .json(new ApiResponse(200, result, 'Users fetched'))
  }
)

export const deleteUserAccount = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user.id
    await userService.deleteUser(userId)
    return res
      .status(200)
      .json(new ApiResponse(200, null, 'Account deleted successfully'))
  }
)
