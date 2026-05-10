// src/routes/loyalty.routes.ts
import { Router } from 'express'
import {
  getMyPoints,
  getPointsHistory,
  redeemReward,
  getAvailableRewards,
  getStampCard,
} from '../controllers/loyalty.controller'
import { authMiddleware } from '../middleware/auth.middleware'

const router = Router()

// ── Public routes (no auth needed) ──
router.get('/rewards', getAvailableRewards)

// ── Protected routes ──
router.use(authMiddleware)
router.get('/points', getMyPoints)
router.get('/history', getPointsHistory)
router.get('/stamp-card', getStampCard)
router.post('/redeem', redeemReward)

export default router