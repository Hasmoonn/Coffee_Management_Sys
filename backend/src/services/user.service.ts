import { prisma } from '../config/database'

export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      loyaltyPoints: true,
      stampCount: true,
      dateOfBirth: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  if (!user) {
    throw new Error('User not found')
  }

  return user
}

export const updateUser = async (id: string, data: any) => {
  const user = await prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      loyaltyPoints: true,
      stampCount: true,
      dateOfBirth: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  return user
}

export const getAllUsers = async (query: any) => {
  const page = parseInt(query.page) || 1
  const limit = parseInt(query.limit) || 10
  const skip = (page - 1) * limit

  const users = await prisma.user.findMany({
    skip,
    take: limit,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      loyaltyPoints: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  const total = await prisma.user.count()

  return {
    data: users,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  }
}

export const deleteUser = async (id: string) => {
  await prisma.user.delete({
    where: { id },
  })
}
