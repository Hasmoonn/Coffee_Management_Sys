import { Request, Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler'
import { ApiResponse } from '../utils/apiResponse'
import * as userService from '../services/user.service'

export const getAllUsers = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await userService.getAllUsers(req.query)
    return res
      .status(200)
      .json(new ApiResponse(200, result, 'Users fetched'))
  }
)

export const getUserById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params
    const user = await userService.getUserById(id)
    return res
      .status(200)
      .json(new ApiResponse(200, user, 'User fetched'))
  }
)

export const deleteUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params
    await userService.deleteUser(id)
    return res
      .status(200)
      .json(new ApiResponse(200, null, 'User deleted'))
  }
)
