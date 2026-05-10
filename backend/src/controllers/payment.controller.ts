import { Request, Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler'
import { ApiResponse } from '../utils/apiResponse'
import * as paymentService from '../services/payment.service'

export const createPayment = asyncHandler(
  async (req: Request, res: Response) => {
    const { orderId, method } = req.body
    const payment = await paymentService.createPayment(orderId, method)
    return res
      .status(201)
      .json(new ApiResponse(201, payment, 'Payment created'))
  }
)

export const getPaymentByOrderId = asyncHandler(
  async (req: Request, res: Response) => {
    const { orderId } = req.params
    const payment = await paymentService.getPaymentByOrderId(orderId)
    return res
      .status(200)
      .json(new ApiResponse(200, payment, 'Payment fetched'))
  }
)

export const updatePaymentStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { orderId } = req.params
    const { status } = req.body
    const payment = await paymentService.updatePaymentStatus(orderId, status)
    return res
      .status(200)
      .json(new ApiResponse(200, payment, 'Payment status updated'))
  }
)

export const processStripePayment = asyncHandler(
  async (req: Request, res: Response) => {
    const { orderId, stripeToken } = req.body
    const payment = await paymentService.processStripePayment(
      orderId,
      stripeToken
    )
    return res
      .status(200)
      .json(new ApiResponse(200, payment, 'Payment processed'))
  }
)
