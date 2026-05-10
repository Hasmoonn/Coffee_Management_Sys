import { Router } from 'express'
import {
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  deleteUserAccount,
} from '../controllers/user.controller'
import { authMiddleware } from '../middleware/auth.middleware'
import { adminMiddleware } from '../middleware/admin.middleware'

const router = Router()

router.use(authMiddleware)

router.get('/profile', getUserProfile)
router.put('/profile', updateUserProfile)
router.delete('/account', deleteUserAccount)

router.get('/', adminMiddleware, getAllUsers)

export default router
