import Stripe from 'stripe'

let stripeClient: Stripe | null = null

export function getStripe(): Stripe | null {
  if (stripeClient) return stripeClient

  const key = process.env.STRIPE_SECRET_KEY
  if (!key || key === 'sk_test_123456789') {
    return null
  }

  stripeClient = new Stripe(key, {
    apiVersion: '2023-10-16',
  })
  return stripeClient
}