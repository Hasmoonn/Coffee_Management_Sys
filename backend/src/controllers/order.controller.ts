import { Request, Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler'
import { ApiResponse } from '../utils/apiResponse'
import * as orderService from '../services/order.service'
import * as emailService from '../services/email.service'
import * as smsService from '../services/sms.service'

export const createOrder = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user.id
    const order = await orderService.createOrder(userId, req.body)

    // Send confirmation email
    if (req.user.email) {
      await emailService.sendOrderConfirmationEmail(
        req.user.email,
        order.orderNumber,
        order.finalAmount
      )
    }

    // Send SMS if phone is available
    if (req.user.phone) {
      await smsService.sendOrderSMS(req.user.phone, order.orderNumber)
    }

    return res
      .status(201)
      .json(new ApiResponse(201, order, 'Order placed successfully'))
  }
)

export const getMyOrders = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user.id
    const result = await orderService.getUserOrders(userId, req.query)
    return res
      .status(200)
      .json(new ApiResponse(200, result, 'Orders fetched'))
  }
)

export const getOrderById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params
    const order = await orderService.getOrderById(id)
    return res
      .status(200)
      .json(new ApiResponse(200, order, 'Order fetched'))
  }
)

export const updateOrderStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params
    const { status } = req.body
    const order = await orderService.updateOrderStatus(id, status)
    return res
      .status(200)
      .json(new ApiResponse(200, order, 'Order status updated'))
  }
)

export const cancelOrder = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params
    const order = await orderService.cancelOrder(id)
    return res
      .status(200)
      .json(new ApiResponse(200, order, 'Order cancelled'))
  }
)

export const getAllOrders = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await orderService.getAllOrders(req.query)
    return res
      .status(200)
      .json(new ApiResponse(200, result, 'All orders fetched'))
  }
)
