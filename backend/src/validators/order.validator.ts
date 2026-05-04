import { body } from 'express-validator'

export const createOrderValidator = [
  body('orderType')
    .trim()
    .isIn(['DINE_IN', 'TAKE_AWAY', 'DELIVERY'])
    .withMessage('Invalid order type'),
  body('items')
    .isArray({ min: 1 })
    .withMessage('At least one item is required'),
  body('items.*.menuItemId')
    .trim()
    .notEmpty()
    .withMessage('Menu item ID is required'),
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  body('deliveryAddress')
    .if(() => {
      return true
    })
    .optional()
    .trim(),
  body('specialNote')
    .optional()
    .trim(),
]

export const updateOrderStatusValidator = [
  body('status')
    .trim()
    .isIn(['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED'])
    .withMessage('Invalid order status'),
]
