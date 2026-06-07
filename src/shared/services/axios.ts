import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

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
    if (error.response?.status === 401 &&!originalRequest._retry) {
      originalRequest._retry = true
      try {
        const refreshToken = localStorage.getItem('refreshToken')
        /** Gọi refresh token*/
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh-token`,
          {
            refreshToken,
          }
        )

        const newAccessToken = response.data.accessToken

        /**
         * Lưu access token mới
         */
        localStorage.setItem(
          'accessToken',
          newAccessToken
        )

        /**
         * Gắn lại token cho request cũ
         */
        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`

        /**
         * Retry request cũ
         */
        return api(originalRequest)
      } catch (refreshError) {
        /**
         * Refresh token cũng chết
         * => logout
         */
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')

        window.location.href = '/login'

        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api