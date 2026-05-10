import { Resend } from 'resend'

let resendClient: Resend | null = null

/**
 * Lazy-initialize Resend client. Returns null if not configured.
 */
export function getResend(): Resend | null {
  if (resendClient) return resendClient

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey || apiKey.startsWith('re_123')) {
    return null
  }

  resendClient = new Resend(apiKey)
  return resendClient
}

export const emailFrom = process.env.EMAIL_FROM || 'noreply@brewco.local'