import { Router } from 'express'
import {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getAllOrders,
} from '../controllers/order.controller'
import { authMiddleware } from '../middleware/auth.middleware'
import { adminMiddleware } from '../middleware/admin.middleware'
import { validateRequest } from '../middleware/validate.middleware'
import {
  createOrderValidator,
  updateOrderStatusValidator,
} from '../validators/order.validator'

const router = Router()

router.use(authMiddleware)

// Customer routes
router.post('/', createOrderValidator, validateRequest, createOrder)
router.get('/my-orders', getMyOrders)
router.get('/:id', getOrderById)
router.patch('/:id/cancel', cancelOrder)

// Admin routes
router.get('/', adminMiddleware, getAllOrders)
router.patch(
  '/:id/status',
  adminMiddleware,
  updateOrderStatusValidator,
  validateRequest,
  updateOrderStatus
)

export default router
