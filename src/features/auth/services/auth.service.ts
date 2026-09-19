import api from '../../../shared/services/axios'
import type {
  LoadingPayload,
  LoginResponse,
  LogoutPayload,
  RegisterPayload,
  GoogleLoginPayload,
  GithubLoginPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  MessageResponse,
} from '../types/auth.type'

export const login = async (
  payload: LoadingPayload
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>(
    '/auth/login',
    payload
  )

  return response.data
}

export const logout = async (payload: LogoutPayload): Promise<void> => {
  await api.post('/auth/logout', payload)
}

export const register = async (
  payload: RegisterPayload
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>(
    '/auth/register',
    payload
  )

  return response.data
}

export const googleLogin = async (
  payload: GoogleLoginPayload
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>(
    '/auth/google',
    payload
  )

  return response.data
}

export const githubLogin = async (
  payload: GithubLoginPayload
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>(
    '/auth/github',
    payload
  )

  return response.data
}

export const forgotPassword = async (
  payload: ForgotPasswordPayload
): Promise<MessageResponse> => {
  const response = await api.post<MessageResponse>('/auth/forgot-password', payload)
  return response.data
}

export const resetPassword = async (
  payload: ResetPasswordPayload
): Promise<MessageResponse> => {
  const response = await api.post<MessageResponse>('/auth/reset-password', payload)
  return response.data
}
