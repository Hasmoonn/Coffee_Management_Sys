import { Router } from 'express'
import {
  register,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  verifyEmail,
} from '../controllers/auth.controller'
import { validateRequest } from '../middleware/validate.middleware'
import { registerValidator, loginValidator } from '../validators/auth.validator'
import { authLimiter } from '../middleware/rateLimit.middleware'

const router = Router()

router.post('/register', authLimiter, registerValidator, validateRequest, register)
router.post('/login', authLimiter, loginValidator, validateRequest, login)
router.post('/logout', logout)
router.post('/refresh-token', refreshToken)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)
router.get('/verify-email/:token', verifyEmail)

export default router
