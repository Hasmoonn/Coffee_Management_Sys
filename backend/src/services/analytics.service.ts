import { prisma } from '../config/database'

export const getDailyRevenue = async (query: any = {}) => {
  const date = query.date ? new Date(query.date) : new Date()
  const startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const endDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() + 1
  )

  const revenue = await prisma.order.aggregate({
    where: {
      createdAt: {
        gte: startDate,
        lt: endDate,
      },
      status: { not: 'CANCELLED' },
    },
    _sum: {
      finalAmount: true,
    },
    _count: true,
  })

  return {
    date: startDate,
    revenue: revenue._sum.finalAmount || 0,
    orders: revenue._count,
  }
}

export const getWeeklyRevenue = async () => {
  const data = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)

    const startDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    )
    const endDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + 1
    )

    const revenue = await prisma.order.aggregate({
      where: {
        createdAt: {
          gte: startDate,
          lt: endDate,
        },
        status: { not: 'CANCELLED' },
      },
      _sum: {
        finalAmount: true,
      },
    })

    data.push({
      date: startDate,
      revenue: revenue._sum.finalAmount || 0,
    })
  }

  return data
}

export const getMonthlyRevenue = async (query: any = {}) => {
  const year = query.year || new Date().getFullYear()
  const month = query.month || new Date().getMonth() + 1

  const startDate = new Date(year, month - 1, 1)
  const endDate = new Date(year, month, 1)

  const revenue = await prisma.order.aggregate({
    where: {
      createdAt: {
        gte: startDate,
        lt: endDate,
      },
      status: { not: 'CANCELLED' },
    },
    _sum: {
      finalAmount: true,
    },
    _count: true,
  })

  return {
    month,
    year,
    revenue: revenue._sum.finalAmount || 0,
    orders: revenue._count,
  }
}

export const getBestSellingItems = async () => {
  const items = await prisma.orderItem.groupBy({
    by: ['menuItemId'],
    _sum: {
      quantity: true,
    },
    orderBy: {
      _sum: {
        quantity: 'desc',
      },
    },
    take: 10,
  })

  const bestSellers = []
  for (const item of items) {
    const menuItem = await prisma.menuItem.findUnique({
      where: { id: item.menuItemId },
    })
    if (menuItem) {
      bestSellers.push({
        ...menuItem,
        totalSold: item._sum.quantity,
      })
    }
  }

  return bestSellers
}

export const getPeakHours = async () => {
  const orders = await prisma.order.findMany({
    select: {
      createdAt: true,
    },
  })

  const hours: Record<number, number> = {}
  for (let i = 0; i < 24; i++) {
    hours[i] = 0
  }

  orders.forEach((order) => {
    const hour = new Date(order.createdAt).getHours()
    hours[hour]++
  })

  return hours
}

export const getCustomerGrowth = async () => {
  const data = []
  for (let i = 11; i >= 0; i--) {
    const date = new Date()
    date.setMonth(date.getMonth() - i)
    const startDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      1
    )
    const endDate = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      1
    )

    const count = await prisma.user.count({
      where: {
        createdAt: {
          gte: startDate,
          lt: endDate,
        },
      },
    })

    data.push({
      month: startDate,
      newCustomers: count,
    })
  }

  return data
}

export const getOrderStats = async () => {
  const stats = await prisma.order.groupBy({
    by: ['status'],
    _count: true,
  })

  return stats
}

export const getOverview = async () => {
  const totalRevenue = await prisma.order.aggregate({
    where: { status: { not: 'CANCELLED' } },
    _sum: { finalAmount: true },
  })

  const totalOrders = await prisma.order.count()
  const totalUsers = await prisma.user.count()
  const pendingReservations = await prisma.reservation.count({
    where: { status: 'CONFIRMED' },
  })

  return {
    totalRevenue: totalRevenue._sum.finalAmount || 0,
    totalOrders,
    totalUsers,
    pendingReservations,
  }
}
