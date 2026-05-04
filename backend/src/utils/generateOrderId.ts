import { nanoid } from 'nanoid'

export const generateOrderId = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase()
  const randomId = nanoid(6).toUpperCase()
  return `ORD-${timestamp}-${randomId}`
}
