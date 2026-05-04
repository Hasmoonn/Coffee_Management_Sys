import { body } from 'express-validator'

export const createReservationValidator = [
  body('tableId')
    .trim()
    .notEmpty()
    .withMessage('Table ID is required'),
  body('date')
    .isISO8601()
    .withMessage('Valid date is required'),
  body('time')
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Valid time is required (HH:MM)'),
  body('guests')
    .isInt({ min: 1, max: 100 })
    .withMessage('Guests must be between 1 and 100'),
  body('occasion')
    .optional()
    .trim(),
  body('specialRequests')
    .optional()
    .trim(),
]

export const updateReservationStatusValidator = [
  body('status')
    .trim()
    .isIn(['CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW'])
    .withMessage('Invalid reservation status'),
]
