import twilio from 'twilio'
import { env } from './env'

export const twilioClient = twilio(
  env.TWILIO_ACCOUNT_SID,
  env.TWILIO_AUTH_TOKEN
)

export const twilioPhoneNumber = env.TWILIO_PHONE_NUMBER
