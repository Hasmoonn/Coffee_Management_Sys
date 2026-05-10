import { prisma } from '../config/database'
import { ReservationCreateInput } from '../types/reservation.types'

export const createReservation = async (
  userId: string,
  data: ReservationCreateInput
) => {
  // Check table availability
  const table = await prisma.table.findUnique({
    where: { id: data.tableId },
  })

  if (!table || !table.isAvailable) {
    throw new Error('Table is not available')
  }

  const reservation = await prisma.reservation.create({
    data: {
      userId,
      tableId: data.tableId,
      date: new Date(data.date),
      time: data.time,
      guests: data.guests,
      occasion: data.occasion,
      specialRequests: data.specialRequests,
    },
    include: {
      table: true,
      user: { select: { name: true, email: true } },
    },
  })

  return reservation
}

export const getUserReservations = async (userId: string, query: any = {}) => {
  const page = parseInt(query.page) || 1
  const limit = parseInt(query.limit) || 10
  const skip = (page - 1) * limit

  const reservations = await prisma.reservation.findMany({
    where: { userId },
    skip,
    take: limit,
    include: {
      table: true,
      user: { select: { name: true, email: true } },
    },
    orderBy: { date: 'desc' },
  })

  const total = await prisma.reservation.count({ where: { userId } })

  return {
    data: reservations,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  }
}

export const getReservationById = async (id: string) => {
  const reservation = await prisma.reservation.findUnique({
    where: { id },
    include: {
      table: true,
      user: { select: { name: true, email: true } },
    },
  })

  if (!reservation) {
    throw new Error('Reservation not found')
  }

  return reservation
}

export const cancelReservation = async (id: string) => {
  const reservation = await prisma.reservation.findUnique({
    where: { id },
  })

  if (!reservation) {
    throw new Error('Reservation not found')
  }

  const updatedReservation = await prisma.reservation.update({
    where: { id },
    data: { status: 'CANCELLED' },
    include: {
      table: true,
    },
  })

  return updatedReservation
}

export const getTableAvailability = async (query: any) => {
  const date = query.date
  const time = query.time
  const guests = parseInt(query.guests) || 1

  if (!date || !time) {
    throw new Error('Date and time are required')
  }

  const tables = await prisma.table.findMany({
    where: {
      capacity: { gte: guests },
      isAvailable: true,
    },
    include: {
      reservations: {
        where: {
          date: {
            gte: new Date(date),
            lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000),
          },
        },
      },
    },
  })

  return tables
}

export const getAllReservations = async (query: any = {}) => {
  const page = parseInt(query.page) || 1
  const limit = parseInt(query.limit) || 10
  const skip = (page - 1) * limit
  const status = query.status

  const where = status ? { status } : {}

  const reservations = await prisma.reservation.findMany({
    where,
    skip,
    take: limit,
    include: {
      table: true,
      user: { select: { name: true, email: true } },
    },
    orderBy: { date: 'desc' },
  })

  const total = await prisma.reservation.count({ where })

  return {
    data: reservations,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  }
}

export const updateReservationStatus = async (
  id: string,
  status: string
) => {
  const reservation = await prisma.reservation.update({
    where: { id },
    data: { status: status as any },
    include: {
      table: true,
    },
  })

  return reservation
}
