import { Router } from 'express'
import authRoutes from './auth.routes'
import userRoutes from './user.routes'
import menuRoutes from './menu.routes'
import orderRoutes from './order.routes'
import reservationRoutes from './reservation.routes'
import loyaltyRoutes from './loyalty.routes'
import reviewRoutes from './review.routes'
import paymentRoutes from './payment.routes'
import analyticsRoutes from './analytics.routes'
import adminRoutes from './admin.routes'

const router = Router()

// Health check
router.get('/', (_req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() })
})

// API routes
router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/menu', menuRoutes)
router.use('/orders', orderRoutes)
router.use('/reservations', reservationRoutes)
router.use('/loyalty', loyaltyRoutes)
router.use('/reviews', reviewRoutes)
router.use('/payments', paymentRoutes)
router.use('/analytics', analyticsRoutes)
router.use('/admin', adminRoutes)

export default router