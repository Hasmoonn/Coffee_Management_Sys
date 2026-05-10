import { prisma } from '../config/database'

export const createReview = async (
  userId: string,
  data: { rating: number; comment: string }
) => {
  const review = await prisma.review.create({
    data: {
      userId,
      rating: data.rating,
      comment: data.comment,
    },
    include: {
      user: { select: { name: true } },
    },
  })

  return review
}

export const getAllReviews = async (query: any = {}) => {
  const page = parseInt(query.page) || 1
  const limit = parseInt(query.limit) || 10
  const skip = (page - 1) * limit

  const reviews = await prisma.review.findMany({
    where: { isVisible: true },
    skip,
    take: limit,
    include: {
      user: { select: { name: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  const total = await prisma.review.count({ where: { isVisible: true } })

  return {
    data: reviews,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  }
}

export const getReviewById = async (id: string) => {
  const review = await prisma.review.findUnique({
    where: { id },
    include: {
      user: { select: { name: true } },
    },
  })

  if (!review) {
    throw new Error('Review not found')
  }

  return review
}

export const updateReview = async (
  id: string,
  userId: string,
  data: { rating?: number; comment?: string }
) => {
  const review = await prisma.review.findUnique({
    where: { id },
  })

  if (!review) {
    throw new Error('Review not found')
  }

  if (review.userId !== userId) {
    throw new Error('Unauthorized - You can only update your own reviews')
  }

  const updatedReview = await prisma.review.update({
    where: { id },
    data,
    include: {
      user: { select: { name: true } },
    },
  })

  return updatedReview
}

export const deleteReview = async (id: string, userId: string) => {
  const review = await prisma.review.findUnique({
    where: { id },
  })

  if (!review) {
    throw new Error('Review not found')
  }

  if (review.userId !== userId) {
    throw new Error('Unauthorized - You can only delete your own reviews')
  }

  await prisma.review.delete({
    where: { id },
  })
}

export const getAverageRating = async () => {
  const result = await prisma.review.aggregate({
    _avg: {
      rating: true,
    },
    _count: true,
  })

  return {
    averageRating: result._avg.rating || 0,
    totalReviews: result._count,
  }
}
