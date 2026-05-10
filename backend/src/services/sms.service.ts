import { twilioClient, twilioPhoneNumber } from '../config/twilio'

export const sendOrderSMS = async (phone: string, orderNumber: string) => {
  try {
    if (!twilioPhoneNumber) {
      console.warn('Twilio phone number not configured')
      return
    }

    await twilioClient.messages.create({
      body: `Your order ${orderNumber} has been confirmed! We'll notify you when it's ready.`,
      from: twilioPhoneNumber,
      to: phone,
    })
  } catch (error) {
    console.error('Failed to send SMS:', error)
  }
}

export const sendReservationSMS = async (phone: string, date: string) => {
  try {
    if (!twilioPhoneNumber) {
      console.warn('Twilio phone number not configured')
      return
    }

    await twilioClient.messages.create({
      body: `Your reservation at Brew & Co is confirmed for ${date}. We look forward to serving you!`,
      from: twilioPhoneNumber,
      to: phone,
    })
  } catch (error) {
    console.error('Failed to send SMS:', error)
  }
}

export const sendReminderSMS = async (phone: string, message: string) => {
  try {
    if (!twilioPhoneNumber) {
      console.warn('Twilio phone number not configured')
      return
    }

    await twilioClient.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: phone,
    })
  } catch (error) {
    console.error('Failed to send SMS:', error)
  }
}
