import api from '../../../shared/services/axios'
import type {
  LoadingPayload,
  LoginResponse,
  LogoutPayload,
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
