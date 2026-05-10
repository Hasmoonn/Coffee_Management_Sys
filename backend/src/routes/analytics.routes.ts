import { Router } from 'express'
import {
  getDailyRevenue,
  getWeeklyRevenue,
  getMonthlyRevenue,
  getBestSellingItems,
  getPeakHours,
  getCustomerGrowth,
  getOrderStats,
  getOverview,
} from '../controllers/analytics.controller'
import { authMiddleware } from '../middleware/auth.middleware'
import { adminMiddleware } from '../middleware/admin.middleware'

const router = Router()

router.get('/public-test', (req, res) => res.json({ message: 'Public test works' }))

router.use(authMiddleware, adminMiddleware)

router.get('/test', (req, res) => res.json({ message: 'Analytics router is working' }))
router.get('/overview', getOverview)
router.get('/daily-revenue', getDailyRevenue)
router.get('/weekly-revenue', getWeeklyRevenue)
router.get('/monthly-revenue', getMonthlyRevenue)
router.get('/best-sellers', getBestSellingItems)
router.get('/peak-hours', getPeakHours)
router.get('/customer-growth', getCustomerGrowth)
router.get('/orders', getOrderStats)

export default router
