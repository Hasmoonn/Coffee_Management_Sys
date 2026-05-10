// src/config/twilio.ts
import twilio from 'twilio'

let twilioClient: ReturnType<typeof twilio> | null = null

/**
 * Lazy-initialize Twilio client. Returns null if not configured.
 */
export function getTwilio(): ReturnType<typeof twilio> | null {
  if (twilioClient) return twilioClient

  const sid = process.env.TWILIO_ACCOUNT_SID
  const token = process.env.TWILIO_AUTH_TOKEN

  // Skip if missing or still using placeholder values
  if (!sid || !token || !sid.startsWith('AC')) {
    return null
  }

  twilioClient = twilio(sid, token)
  return twilioClient
}

export const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER || ''