import { resend, emailFrom } from '../config/email'

export const sendWelcomeEmail = async (email: string, name: string) => {
  try {
    await resend.emails.send({
      from: emailFrom,
      to: email,
      subject: 'Welcome to Brew & Co!',
      html: `
        <h1>Welcome to Brew & Co, ${name}!</h1>
        <p>We're excited to have you join our coffee community.</p>
        <p>Start exploring our menu and earning loyalty points on every order.</p>
      `,
    })
  } catch (error) {
    console.error('Failed to send welcome email:', error)
  }
}

export const sendOrderConfirmationEmail = async (
  email: string,
  orderNumber: string,
  totalAmount: number
) => {
  try {
    await resend.emails.send({
      from: emailFrom,
      to: email,
      subject: `Order Confirmation - ${orderNumber}`,
      html: `
        <h1>Order Confirmed!</h1>
        <p>Order Number: ${orderNumber}</p>
        <p>Total Amount: $${totalAmount.toFixed(2)}</p>
        <p>Thank you for your order. We'll notify you when it's ready!</p>
      `,
    })
  } catch (error) {
    console.error('Failed to send order confirmation email:', error)
  }
}

export const sendReservationConfirmationEmail = async (
  email: string,
  reservationDate: string,
  tableNumber: number
) => {
  try {
    await resend.emails.send({
      from: emailFrom,
      to: email,
      subject: 'Reservation Confirmed',
      html: `
        <h1>Reservation Confirmed!</h1>
        <p>Date: ${reservationDate}</p>
        <p>Table: ${tableNumber}</p>
        <p>We look forward to seeing you!</p>
      `,
    })
  } catch (error) {
    console.error('Failed to send reservation confirmation email:', error)
  }
}
