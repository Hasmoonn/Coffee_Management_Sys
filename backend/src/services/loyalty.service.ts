import { prisma } from '../config/database'
import { rewards, STAMP_GOAL } from '../utils/calculatePoints'

export const getUserPoints = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      loyaltyPoints: true,
      stampCount: true,
    },
  })

  if (!user) {
    throw new Error('User not found')
  }

  return {
    points: user.loyaltyPoints,
    stamps: user.stampCount,
    stampGoal: STAMP_GOAL,
    canRedeemStamps: user.stampCount >= STAMP_GOAL,
  }
}

export const getPointsHistory = async (userId: string, query: any = {}) => {
  const page = parseInt(query.page) || 1
  const limit = parseInt(query.limit) || 10
  const skip = (page - 1) * limit

  const history = await prisma.pointsHistory.findMany({
    where: { userId },
    skip,
    take: limit,
    orderBy: { createdAt: 'desc' },
  })

  const total = await prisma.pointsHistory.count({ where: { userId } })

  return {
    data: history,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  }
}

export const getAvailableRewards = async () => {
  return rewards
}

export const getStampCard = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      stampCount: true,
    },
  })

  if (!user) {
    throw new Error('User not found')
  }

  return {
    stamps: user.stampCount,
    goal: STAMP_GOAL,
    progress: Math.round((user.stampCount / STAMP_GOAL) * 100),
    nextRewardStamps: STAMP_GOAL - user.stampCount,
  }
}

export const redeemReward = async (userId: string, rewardId: string) => {
  const reward = rewards.find((r) => r.id === rewardId)

  if (!reward) {
    throw new Error('Reward not found')
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      loyaltyPoints: true,
      stampCount: true,
    },
  })

  if (!user) {
    throw new Error('User not found')
  }

  if (user.loyaltyPoints < reward.pointsRequired) {
    throw new Error('Insufficient points for this reward')
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      loyaltyPoints: {
        decrement: reward.pointsRequired,
      },
    },
  })

  await prisma.pointsHistory.create({
    data: {
      userId,
      points: -reward.pointsRequired,
      type: 'REDEMPTION',
      description: `Redeemed reward: ${reward.name}`,
    },
  })

  return {
    success: true,
    reward,
    remainingPoints: user.loyaltyPoints - reward.pointsRequired,
  }
}
