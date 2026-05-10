import { prisma } from '../config/database'
import { hashPassword, comparePassword } from '../utils/hashPassword'
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/generateToken'
import { UserRegisterInput, UserLoginInput } from '../types/user.types'

export const registerUser = async (data: UserRegisterInput) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  })

  if (existingUser) {
    throw new Error('Email already registered')
  }

  const hashedPassword = await hashPassword(data.password)

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: hashedPassword,
      isVerified: true,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  })

  const accessToken = generateAccessToken(user.id)
  const refreshToken = generateRefreshToken(user.id)

  return {
    user,
    accessToken,
    refreshToken,
  }
}

export const loginUser = async (data: UserLoginInput) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  })

  if (!user) {
    throw new Error('Invalid credentials')
  }

  const isPasswordValid = await comparePassword(data.password, user.password)
  if (!isPasswordValid) {
    throw new Error('Invalid credentials')
  }

  if (!user.isActive) {
    throw new Error('User account is inactive')
  }

  const accessToken = generateAccessToken(user.id)
  const refreshToken = generateRefreshToken(user.id)

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    accessToken,
    refreshToken,
  }
}

export const refreshToken = async (token: string) => {
  const decoded = verifyRefreshToken(token)
  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
  })

  if (!user || !user.isActive) {
    throw new Error('User not found or inactive')
  }

  const accessToken = generateAccessToken(user.id)
  const newRefreshToken = generateRefreshToken(user.id)

  return {
    accessToken,
    refreshToken: newRefreshToken,
  }
}

export const forgotPassword = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    // Don't reveal if user exists or not for security
    return
  }

  // TODO: Generate reset token and send via email
  return
}

export const resetPassword = async (
  _token: string,
  _password: string
) => {
  // TODO: Verify reset token and update password
  return
}

export const verifyEmail = async (_token: string) => {
  // TODO: Verify email token and update user
  return
}