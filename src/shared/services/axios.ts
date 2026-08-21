import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

/**
 * Shared refresh promise — chống gọi refresh đồng thời.
 * Khi nhiều request 401 cùng lúc, chỉ gọi refresh 1 lần,
 * các request khác chờ cùng promise đó.
 */
let refreshPromise: Promise<string> | null = null

/**
 * REQUEST INTERCEPTOR
 * Tự động gắn access token
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

/**
 * RESPONSE INTERCEPTOR
 * Auto refresh token khi access token hết hạn
 */
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config

    /**
     * Nếu access token expired
     */
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Nếu đã có refresh đang chạy → dùng chung promise đó
        if (!refreshPromise) {
          const refreshToken = localStorage.getItem('refreshToken')

          refreshPromise = axios
            .post(
              `${import.meta.env.VITE_API_URL}/auth/refresh-token`,
              { refreshToken }
            )
            .then((res) => {
              const { accessToken, refreshToken: newRefresh, user } = res.data

              localStorage.setItem('accessToken', accessToken)
              localStorage.setItem('refreshToken', newRefresh.token)
              if (user) {
                localStorage.setItem('user', JSON.stringify(user))
              }

              return accessToken
            })
            .finally(() => {
              refreshPromise = null
            })
        }

        const newAccessToken = await refreshPromise

        // Gắn lại token cho request cũ
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

        // Retry request cũ
        return api(originalRequest)
      } catch (refreshError) {
        // Refresh token cũng chết → logout
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')

        window.location.href = '/login'

        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api
