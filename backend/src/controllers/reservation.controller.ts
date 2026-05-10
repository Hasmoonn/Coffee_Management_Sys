import { Request, Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler'
import { ApiResponse } from '../utils/apiResponse'
import * as reservationService from '../services/reservation.service'
import * as emailService from '../services/email.service'
import * as smsService from '../services/sms.service'

export const createReservation = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user.id
    const reservation = await reservationService.createReservation(
      userId,
      req.body
    )

    // Send confirmation email
    if (req.user.email) {
      await emailService.sendReservationConfirmationEmail(
        req.user.email,
        new Date(reservation.date).toLocaleDateString(),
        reservation.table.tableNumber
      )
    }

    // Send SMS if phone is available
    if (req.user.phone) {
      await smsService.sendReservationSMS(
        req.user.phone,
        new Date(reservation.date).toLocaleDateString()
      )
    }

    return res
      .status(201)
      .json(new ApiResponse(201, reservation, 'Reservation created successfully'))
  }
)

export const getMyReservations = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user.id
    const result = await reservationService.getUserReservations(
      userId,
      req.query
    )
    return res
      .status(200)
      .json(new ApiResponse(200, result, 'Reservations fetched'))
  }
)

export const getReservationById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params
    const reservation = await reservationService.getReservationById(id)
    return res
      .status(200)
      .json(new ApiResponse(200, reservation, 'Reservation fetched'))
  }
)

export const cancelReservation = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params
    const reservation = await reservationService.cancelReservation(id)
    return res
      .status(200)
      .json(new ApiResponse(200, reservation, 'Reservation cancelled'))
  }
)

export const getTableAvailability = asyncHandler(
  async (req: Request, res: Response) => {
    const tables = await reservationService.getTableAvailability(req.query)
    return res
      .status(200)
      .json(new ApiResponse(200, tables, 'Available tables fetched'))
  }
)

export const getAllReservations = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await reservationService.getAllReservations(req.query)
    return res
      .status(200)
      .json(new ApiResponse(200, result, 'All reservations fetched'))
  }
)

export const updateReservationStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params
    const { status } = req.body
    const reservation = await reservationService.updateReservationStatus(
      id,
      status
    )
    return res
      .status(200)
      .json(new ApiResponse(200, reservation, 'Reservation status updated'))
  }
)
