import { Router } from 'express'
import {
  getAllMenuItems,
  getMenuByCategory,
  getMenuItem,
  getFeaturedItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleAvailability,
} from '../controllers/menu.controller'
import { authMiddleware } from '../middleware/auth.middleware'
import { adminMiddleware } from '../middleware/admin.middleware'
import { uploadMiddleware } from '../middleware/upload.middleware'
import { validateRequest } from '../middleware/validate.middleware'
import {
  createMenuItemValidator,
  updateMenuItemValidator,
} from '../validators/menu.validator'

const router = Router()

// Public routes
router.get('/', getAllMenuItems)
router.get('/featured', getFeaturedItems)
router.get('/category/:slug', getMenuByCategory)
router.get('/:id', getMenuItem)

// Admin only routes
router.post(
  '/',
  authMiddleware,
  adminMiddleware,
  uploadMiddleware.single('image'),
  createMenuItemValidator,
  validateRequest,
  createMenuItem
)

router.put(
  '/:id',
  authMiddleware,
  adminMiddleware,
  uploadMiddleware.single('image'),
  updateMenuItemValidator,
  validateRequest,
  updateMenuItem
)

router.delete('/:id', authMiddleware, adminMiddleware, deleteMenuItem)

router.patch(
  '/:id/availability',
  authMiddleware,
  adminMiddleware,
  toggleAvailability
)

export default router
