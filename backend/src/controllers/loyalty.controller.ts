import { Request, Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler'
import { ApiResponse } from '../utils/apiResponse'
import * as loyaltyService from '../services/loyalty.service'

export const getMyPoints = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user.id
    const points = await loyaltyService.getUserPoints(userId)
    return res
      .status(200)
      .json(new ApiResponse(200, points, 'Points fetched'))
  }
)

export const getPointsHistory = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user.id
    const result = await loyaltyService.getPointsHistory(userId, req.query)
    return res
      .status(200)
      .json(new ApiResponse(200, result, 'Points history fetched'))
  }
)

export const getAvailableRewards = asyncHandler(
  async (_req: Request, res: Response) => {
    const rewards = await loyaltyService.getAvailableRewards()
    return res
      .status(200)
      .json(new ApiResponse(200, rewards, 'Rewards fetched'))
  }
)

export const getStampCard = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user.id
    const stampCard = await loyaltyService.getStampCard(userId)
    return res
      .status(200)
      .json(new ApiResponse(200, stampCard, 'Stamp card fetched'))
  }
)

export const redeemReward = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user.id
    const { rewardId } = req.body
    const result = await loyaltyService.redeemReward(userId, rewardId)
    return res
      .status(200)
      .json(new ApiResponse(200, result, 'Reward redeemed successfully'))
  }
)