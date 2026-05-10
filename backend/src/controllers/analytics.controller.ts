import { Request, Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler'
import { ApiResponse } from '../utils/apiResponse'
import * as analyticsService from '../services/analytics.service'

export const getDailyRevenue = asyncHandler(
  async (req: Request, res: Response) => {
    const revenue = await analyticsService.getDailyRevenue(req.query)
    return res
      .status(200)
      .json(new ApiResponse(200, revenue, 'Daily revenue fetched'))
  }
)

export const getWeeklyRevenue = asyncHandler(
  async (_req: Request, res: Response) => {
    const revenue = await analyticsService.getWeeklyRevenue()
    return res
      .status(200)
      .json(new ApiResponse(200, revenue, 'Weekly revenue fetched'))
  }
)

export const getMonthlyRevenue = asyncHandler(
  async (req: Request, res: Response) => {
    const revenue = await analyticsService.getMonthlyRevenue(req.query)
    return res
      .status(200)
      .json(new ApiResponse(200, revenue, 'Monthly revenue fetched'))
  }
)

export const getBestSellingItems = asyncHandler(
  async (_req: Request, res: Response) => {
    const items = await analyticsService.getBestSellingItems()
    return res
      .status(200)
      .json(new ApiResponse(200, items, 'Best selling items fetched'))
  }
)

export const getPeakHours = asyncHandler(
  async (_req: Request, res: Response) => {
    const hours = await analyticsService.getPeakHours()
    return res
      .status(200)
      .json(new ApiResponse(200, hours, 'Peak hours fetched'))
  }
)

export const getCustomerGrowth = asyncHandler(
  async (_req: Request, res: Response) => {
    const growth = await analyticsService.getCustomerGrowth()
    return res
      .status(200)
      .json(new ApiResponse(200, growth, 'Customer growth fetched'))
  }
)

export const getOrderStats = asyncHandler(
  async (_req: Request, res: Response) => {
    const stats = await analyticsService.getOrderStats()
    return res
      .status(200)
      .json(new ApiResponse(200, stats, 'Order stats fetched'))
  }
)

export const getOverview = asyncHandler(
  async (_req: Request, res: Response) => {
    const overview = await analyticsService.getOverview()
    return res
      .status(200)
      .json(new ApiResponse(200, overview, 'Overview stats fetched'))
  }
)
