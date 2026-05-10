import { Router } from 'express'
import {
  getAllReviews,
  createReview,
  getReviewById,
  updateReview,
  deleteReview,
  getAverageRating,
} from '../controllers/review.controller'
import { authMiddleware } from '../middleware/auth.middleware'
import { validateRequest } from '../middleware/validate.middleware'
import { createReviewValidator } from '../validators/review.validator'

const router = Router()

// Public routes
router.get('/', getAllReviews)
router.get('/rating/average', getAverageRating)
router.get('/:id', getReviewById)

// Authenticated routes
router.post('/', authMiddleware, createReviewValidator, validateRequest, createReview)
router.put('/:id', authMiddleware, createReviewValidator, validateRequest, updateReview)
router.delete('/:id', authMiddleware, deleteReview)

export default router
