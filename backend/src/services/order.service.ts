import { prisma } from '../config/database'
import { generateOrderId } from '../utils/generateOrderId'
import { calculatePoints } from '../utils/calculatePoints'
import { OrderCreateInput } from '../types/order.types'

export const createOrder = async (userId: string, data: OrderCreateInput) => {
  const orderNumber = generateOrderId()

  let totalAmount = 0
  const orderItems = []

  // Fetch all menu items in a single query (instead of N+1)
  const menuItemIds = data.items.map((item) => item.menuItemId)
  const menuItems = await prisma.menuItem.findMany({
    where: {
      id: {
        in: menuItemIds,
      },
    },
    select: {
      id: true,
      price: true,
      isAvailable: true,
    },
  })

  const menuItemMap = new Map(menuItems.map((item) => [item.id, item]))

  // Validate and calculate total
  for (const item of data.items) {
    const menuItem = menuItemMap.get(item.menuItemId)

    if (!menuItem) {
      throw new Error(`Menu item ${item.menuItemId} not found`)
    }

    if (!menuItem.isAvailable) {
      throw new Error(`Menu item ${item.menuItemId} is not available`)
    }

    const itemTotal = menuItem.price * item.quantity
    totalAmount += itemTotal

    orderItems.push({
      menuItemId: item.menuItemId,
      quantity: item.quantity,
      unitPrice: menuItem.price,
      totalPrice: itemTotal,
      customization: item.customization,
    })
  }

  const discount = data.orderType === 'DINE_IN' ? 0 : 0
  const finalAmount = totalAmount - discount

  const order = await prisma.order.create({
    data: {
      orderNumber,
      userId,
      orderType: data.orderType,
      totalAmount,
      discount,
      finalAmount,
      specialNote: data.specialNote,
      deliveryAddress: data.deliveryAddress,
      items: {
        createMany: {
          data: orderItems,
        },
      },
    },
    include: {
      items: {
        include: { menuItem: true },
      },
      user: { select: { email: true, name: true } },
    },
  })

  // Award loyalty points
  const points = calculatePoints(finalAmount)
  if (points > 0) {
    await prisma.pointsHistory.create({
      data: {
        userId,
        points,
        type: 'ORDER',
        description: `Points earned from order ${orderNumber}`,
      },
    })

    await prisma.user.update({
      where: { id: userId },
      data: {
        loyaltyPoints: {
          increment: points,
        },
      },
    })
  }

  return order
}

export const getUserOrders = async (userId: string, query: any = {}) => {
  const page = parseInt(query.page) || 1
  const limit = parseInt(query.limit) || 10
  const skip = (page - 1) * limit

  // Batch queries for better performance
  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where: { userId },
      skip,
      take: limit,
      select: {
        id: true,
        orderNumber: true,
        orderType: true,
        status: true,
        totalAmount: true,
        finalAmount: true,
        createdAt: true,
        items: {
          select: {
            quantity: true,
            unitPrice: true,
            totalPrice: true,
            menuItem: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
                isAvailable: true,
              },
            },
          },
        },
        payment: {
          select: {
            status: true,
            method: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.order.count({ where: { userId } }),
  ])

  return {
    data: orders,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  }
}

export const getOrderById = async (id: string) => {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: { menuItem: true },
      },
      payment: true,
      user: { select: { email: true, name: true } },
    },
  })

  if (!order) {
    throw new Error('Order not found')
  }

  return order
}

export const updateOrderStatus = async (id: string, status: string) => {
  const order = await prisma.order.update({
    where: { id },
    data: { status: status as any },
    include: {
      items: {
        include: { menuItem: true },
      },
      payment: true,
    },
  })

  return order
}

export const cancelOrder = async (id: string) => {
  const order = await prisma.order.findUnique({
    where: { id },
  })

  if (!order) {
    throw new Error('Order not found')
  }

  if (order.status === 'DELIVERED' || order.status === 'CANCELLED') {
    throw new Error(`Cannot cancel order with status ${order.status}`)
  }

  const updatedOrder = await prisma.order.update({
    where: { id },
    data: { status: 'CANCELLED' },
    include: {
      items: {
        include: { menuItem: true },
      },
    },
  })

  return updatedOrder
}

export const getAllOrders = async (query: any = {}) => {
  const page = parseInt(query.page) || 1
  const limit = parseInt(query.limit) || 10
  const skip = (page - 1) * limit
  const status = query.status

  const where = status ? { status } : {}

  const orders = await prisma.order.findMany({
    where,
    skip,
    take: limit,
    include: {
      items: {
        include: { menuItem: true },
      },
      user: { select: { name: true, email: true } },
      payment: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  const total = await prisma.order.count({ where })

  return {
    data: orders,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  }
}
