/**
 * Khoá auth được namespace "taskflow_" để KHÔNG đụng app khác chạy chung
 * origin (localStorage dùng chung theo host:port). Key chung kiểu
 * "accessToken" có thể bị app khác (hoặc tab/service worker cũ) xoá/ghi đè
 * khiến user bị đá về login.
 */
export const AUTH_STORAGE_KEYS = {
  accessToken: 'taskflow_accessToken',
  refreshToken: 'taskflow_refreshToken',
  user: 'taskflow_user',
} as const

export function getAccessToken(): string | null {
  return localStorage.getItem(AUTH_STORAGE_KEYS.accessToken)
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(AUTH_STORAGE_KEYS.refreshToken)
}

export function setAccessToken(token: string): void {
  localStorage.setItem(AUTH_STORAGE_KEYS.accessToken, token)
}

export function setRefreshToken(token: string): void {
  localStorage.setItem(AUTH_STORAGE_KEYS.refreshToken, token)
}

export function setStoredUser(user: unknown): void {
  localStorage.setItem(AUTH_STORAGE_KEYS.user, JSON.stringify(user))
}

export function clearAuthStorage(): void {
  localStorage.removeItem(AUTH_STORAGE_KEYS.accessToken)
  localStorage.removeItem(AUTH_STORAGE_KEYS.refreshToken)
  localStorage.removeItem(AUTH_STORAGE_KEYS.user)
}
