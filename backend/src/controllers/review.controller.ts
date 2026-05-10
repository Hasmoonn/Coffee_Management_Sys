import { Request, Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler'
import { ApiResponse } from '../utils/apiResponse'
import * as reviewService from '../services/review.service'

export const getAllReviews = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await reviewService.getAllReviews(req.query)
    return res
      .status(200)
      .json(new ApiResponse(200, result, 'Reviews fetched'))
  }
)

export const createReview = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user.id
    const { rating, comment } = req.body
    const review = await reviewService.createReview(userId, {
      rating,
      comment,
    })
    return res
      .status(201)
      .json(new ApiResponse(201, review, 'Review created successfully'))
  }
)

export const getReviewById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params
    const review = await reviewService.getReviewById(id)
    return res
      .status(200)
      .json(new ApiResponse(200, review, 'Review fetched'))
  }
)

export const updateReview = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user.id
    const { id } = req.params
    const { rating, comment } = req.body
    const review = await reviewService.updateReview(id, userId, {
      rating,
      comment,
    })
    return res
      .status(200)
      .json(new ApiResponse(200, review, 'Review updated successfully'))
  }
)

export const deleteReview = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user.id
    const { id } = req.params
    await reviewService.deleteReview(id, userId)
    return res
      .status(200)
      .json(new ApiResponse(200, null, 'Review deleted successfully'))
  }
)

export const getAverageRating = asyncHandler(
  async (_req: Request, res: Response) => {
    const rating = await reviewService.getAverageRating()
    return res
      .status(200)
      .json(new ApiResponse(200, rating, 'Average rating fetched'))
  }
)
