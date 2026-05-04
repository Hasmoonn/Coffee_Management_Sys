import jwt, { SignOptions } from 'jsonwebtoken'
import { env } from '../config/env'

export const generateAccessToken = (userId: string): string => {
  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'],
  }
  return jwt.sign({ id: userId }, env.JWT_SECRET as string, options)
}

export const generateRefreshToken = (userId: string): string => {
  const options: SignOptions = {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as SignOptions['expiresIn'],
  }
  return jwt.sign(
    { id: userId },
    env.JWT_REFRESH_SECRET as string,
    options
  )
}

export const verifyAccessToken = (token: string) => {
  try {
    return jwt.verify(token, env.JWT_SECRET as string) as { id: string }
  } catch {
    throw new Error('Invalid access token')
  }
}

export const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(
      token,
      env.JWT_REFRESH_SECRET as string
    ) as { id: string }
  } catch {
    throw new Error('Invalid refresh token')
  }
}