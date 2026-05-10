import { prisma } from '../config/database'

export const createPayment = async (orderId: string, method: string) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  })

  if (!order) {
    throw new Error('Order not found')
  }

  const payment = await prisma.payment.create({
    data: {
      orderId,
      method: method as any,
      amount: order.finalAmount,
      status: 'PENDING',
    },
  })

  return payment
}

export const getPaymentByOrderId = async (orderId: string) => {
  const payment = await prisma.payment.findUnique({
    where: { orderId },
    include: {
      order: true,
    },
  })

  if (!payment) {
    throw new Error('Payment not found')
  }

  return payment
}

export const updatePaymentStatus = async (
  orderId: string,
  status: string
) => {
  const payment = await prisma.payment.update({
    where: { orderId },
    data: { status: status as any },
    include: {
      order: true,
    },
  })

  return payment
}

export const processStripePayment = async (
  orderId: string,
  _stripeToken: string
) => {
  // In a real application, process with Stripe API
  const payment = await updatePaymentStatus(orderId, 'COMPLETED')
  return payment
}

export const getPaymentStats = async (query: any = {}) => {
  const startDate = query.startDate
    ? new Date(query.startDate)
    : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  const endDate = query.endDate ? new Date(query.endDate) : new Date()

  const stats = await prisma.payment.aggregate({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    _sum: {
      amount: true,
    },
    _count: true,
  })

  return {
    totalAmount: stats._sum.amount || 0,
    totalPayments: stats._count,
    period: {
      start: startDate,
      end: endDate,
    },
  }
}
