import { Router } from 'express'
import {
  createReservation,
  getMyReservations,
  getReservationById,
  cancelReservation,
  getTableAvailability,
  getAllReservations,
  updateReservationStatus,
} from '../controllers/reservation.controller'
import { authMiddleware } from '../middleware/auth.middleware'
import { adminMiddleware } from '../middleware/admin.middleware'
import { validateRequest } from '../middleware/validate.middleware'
import {
  createReservationValidator,
  updateReservationStatusValidator,
} from '../validators/reservation.validator'

const router = Router()

// Public routes
router.get('/availability', getTableAvailability)

// Customer routes
router.post(
  '/',
  authMiddleware,
  createReservationValidator,
  validateRequest,
  createReservation
)
router.get('/my-reservations', authMiddleware, getMyReservations)
router.get('/:id', authMiddleware, getReservationById)
router.patch('/:id/cancel', authMiddleware, cancelReservation)

// Admin routes
router.get('/', authMiddleware, adminMiddleware, getAllReservations)
router.patch(
  '/:id/status',
  authMiddleware,
  adminMiddleware,
  updateReservationStatusValidator,
  validateRequest,
  updateReservationStatus
)

export default router
