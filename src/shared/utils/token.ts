import { jwtDecode } from 'jwt-decode'

interface JwtPayload {
  exp?: number
}

/**
 * true nếu token rỗng, không decode được, hoặc đã hết hạn.
 * Trừ thêm `skewSeconds` để tránh dùng token sắp hết hạn trong lúc request bay đi.
 */
export const isTokenExpired = (
  token: string | null | undefined,
  skewSeconds = 30,
): boolean => {
  if (!token) return true

  try {
    const { exp } = jwtDecode<JwtPayload>(token)
    if (!exp) return false
    return exp * 1000 - skewSeconds * 1000 <= Date.now()
  } catch {
    return true
  }
}
