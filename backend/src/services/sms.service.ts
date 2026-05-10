// src/services/sms.service.ts
import { getTwilio, twilioPhoneNumber } from '../config/twilio'

export const sendOrderSMS = async (phone: string, orderNumber: string) => {
  const client = getTwilio()
  if (!client || !twilioPhoneNumber) {
    console.log(`[sms] Skipped order SMS to ${phone} (Twilio not configured)`)
    return
  }

  try {
    await client.messages.create({
      body: `Your order ${orderNumber} has been confirmed! We'll notify you when it's ready.`,
      from: twilioPhoneNumber,
      to: phone,
    })
  } catch (error) {
    console.error('Failed to send SMS:', error)
  }
}

export const sendReservationSMS = async (phone: string, date: string) => {
  const client = getTwilio()
  if (!client || !twilioPhoneNumber) {
    console.log(`[sms] Skipped reservation SMS to ${phone} (Twilio not configured)`)
    return
  }

  try {
    await client.messages.create({
      body: `Your reservation at Brew & Co is confirmed for ${date}. We look forward to serving you!`,
      from: twilioPhoneNumber,
      to: phone,
    })
  } catch (error) {
    console.error('Failed to send SMS:', error)
  }
}

export const sendReminderSMS = async (phone: string, message: string) => {
  const client = getTwilio()
  if (!client || !twilioPhoneNumber) {
    console.log(`[sms] Skipped reminder SMS to ${phone} (Twilio not configured)`)
    return
  }

  try {
    await client.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: phone,
    })
  } catch (error) {
    console.error('Failed to send SMS:', error)
  }
}