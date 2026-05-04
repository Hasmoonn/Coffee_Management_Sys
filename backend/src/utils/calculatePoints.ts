export const calculatePoints = (amount: number): number => {
  return Math.floor(amount * 10)
}

export const rewards = [
  {
    id: 'free-coffee',
    name: 'Free Coffee',
    pointsRequired: 100,
    description: 'Redeem 100 points for any free coffee',
  },
  {
    id: 'discount-20',
    name: '20% Discount',
    pointsRequired: 200,
    description: 'Get 20% off your next order',
  },
  {
    id: 'discount-50',
    name: '50% Discount',
    pointsRequired: 350,
    description: 'Get 50% off your next order',
  },
  {
    id: 'free-meal',
    name: 'Free Meal Combo',
    pointsRequired: 500,
    description: 'Enjoy a complete free meal combo',
  },
]

export const STAMP_GOAL = 9

export const getRewardByPoints = (points: number) => {
  return rewards.filter((reward) => reward.pointsRequired <= points)
}
