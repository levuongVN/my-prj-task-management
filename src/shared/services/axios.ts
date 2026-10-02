import axios from 'axios'
import {
  clearAuthStorage,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  setStoredUser,
} from '../utils/authStorage'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

/**
 * Shared refresh promise — chống gọi refresh đồng thời.
 * Khi nhiều request 401 cùng lúc (hoặc bootstrap + request), chỉ gọi refresh
 * 1 lần, các nơi khác chờ cùng promise đó.
 */
let refreshPromise: Promise<string> | null = null

/** Đọc HTTP status từ lỗi axios mà không phụ thuộc `axios.isAxiosError`. */
function getErrorStatus(error: unknown): number | undefined {
  if (typeof error !== 'object' || error === null || !('response' in error)) {
    return undefined
  }
  const response = (error as { response?: { status?: unknown } }).response
  return typeof response?.status === 'number' ? response.status : undefined
}

/** Đọc body lỗi (nếu có). */
function getErrorData(error: unknown): unknown {
  if (typeof error !== 'object' || error === null || !('response' in error)) {
    return undefined
  }
  return (error as { response?: { data?: unknown } }).response?.data
}

/**
 * BE trả 400 cho 2 trường hợp khác nhau:
 *  - Bind fail / thiếu field → ProblemDetails ({ title, errors, ... }).
 *  - Token không tồn tại/hết hạn/revoked/device inactive → { message }.
 * Chỉ trường hợp thứ 2 (hoặc 401/403) mới coi là "session chết".
 */
function isRefreshTokenRejected(error: unknown): boolean {
  const status = getErrorStatus(error)
  if (status === 401 || status === 403) return true
  if (status !== 400) return false

  const data = getErrorData(error)
  if (typeof data !== 'object' || data === null) return false
  if ('errors' in data || 'title' in data) return false

  return typeof (data as { message?: unknown }).message === 'string'
}

/**
 * Gọi POST /auth/refresh-token bằng refreshToken đã lưu, lưu accessToken mới
 * rồi trả về. Single-flight: gọi song song dùng chung 1 request.
 *
 * - Refresh token bị BE từ chối dứt khoát (400 {message}/401/403) → clearAuthStorage().
 * - Lỗi mạng/5xx là tạm thời → KHÔNG xoá phiên.
 *
 * Dùng chung cho: bootstrap lúc app khởi động + interceptor khi request 401.
 */
export function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    const refreshToken = getRefreshToken()

    refreshPromise = axios
      .post(`${import.meta.env.VITE_API_URL}/auth/refresh-token`, {
        refreshToken,
      })
      .then((res) => {
        const { accessToken, refreshToken: newRefresh, user } = res.data

        setAccessToken(accessToken)

        // BE có thể trả refresh token dạng object { token }, dạng string,
        // hoặc không xoay token → chỉ ghi đè khi thực sự có token mới.
        const nextRefreshToken =
          typeof newRefresh === 'string' ? newRefresh : newRefresh?.token
        if (nextRefreshToken) {
          setRefreshToken(nextRefreshToken)
        }

        if (user) {
          setStoredUser(user)
        }

        return accessToken
      })
      .catch((error) => {
        // Chỉ xoá phiên khi refresh token bị BE từ chối dứt khoát.
        // 400 bind-fail (ProblemDetails) không phải lỗi token → giữ phiên.
        if (isRefreshTokenRejected(error)) {
          clearAuthStorage()
        }
        throw error
      })
      .finally(() => {
        refreshPromise = null
      })
  }

  return refreshPromise
}

/**
 * REQUEST INTERCEPTOR
 * Tự động gắn access token
 */
api.interceptors.request.use((config) => {
  const token = getAccessToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

/**
 * RESPONSE INTERCEPTOR
 * Request bị 401 → thử refresh 1 lần rồi retry request cũ.
 * Refresh fail (bị từ chối dứt khoát) mới đá về login.
 */
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true

      // Không có refreshToken thì không thể refresh → về login luôn,
      // tránh gửi body { refreshToken: null } gây 400 vô nghĩa.
      if (!getRefreshToken()) {
        clearAuthStorage()
        window.location.href = '/login'
        return Promise.reject(error)
      }

      try {
        const newAccessToken = await refreshAccessToken()

        // Gắn lại token cho request cũ rồi retry
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return api(originalRequest)
      } catch (refreshError) {
        // refreshAccessToken chỉ xoá refreshToken khi bị từ chối dứt khoát.
        // Còn token ⇒ lỗi tạm thời ⇒ không đá về login, để lần sau thử lại.
        if (!getRefreshToken()) {
          window.location.href = '/login'
        }

        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api
