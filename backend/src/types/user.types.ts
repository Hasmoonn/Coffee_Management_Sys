export interface UserRegisterInput {
  name: string
  email: string
  phone?: string
  password: string
}

export interface UserLoginInput {
  email: string
  password: string
}

export interface UserAuthResponse {
  id: string
  name: string
  email: string
  role: string
  accessToken: string
  refreshToken: string
}
