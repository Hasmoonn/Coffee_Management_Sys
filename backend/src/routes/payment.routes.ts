import { Router } from 'express'
import {
  createPayment,
  getPaymentByOrderId,
  updatePaymentStatus,
  processStripePayment,
} from '../controllers/payment.controller'
import { authMiddleware } from '../middleware/auth.middleware'

const router = Router()

router.use(authMiddleware)

router.post('/', createPayment)
router.get('/:orderId', getPaymentByOrderId)
router.patch('/:orderId/status', updatePaymentStatus)
router.post('/stripe/process', processStripePayment)

export default router
