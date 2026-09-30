import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

/**
 * Mock axios TRƯỚC khi import module interceptor để bắt tay interceptor.
 * `apiInstance` là function mock: interceptor retry sẽ gọi lại chính nó.
 */
const apiInstance = vi.fn()

vi.mock('axios', () => {
  apiInstance.interceptors = {
    request: { use: vi.fn() },
    response: { use: vi.fn() },
  }
  return {
    default: {
      create: vi.fn(() => apiInstance),
      post: vi.fn(),
    },
  }
})

type ReqInterceptor = (config: Record<string, any>) => Record<string, any>
type ResErrInterceptor = (error: any) => Promise<any>

let requestInterceptor: ReqInterceptor
let responseOk: (res: unknown) => unknown
let responseErr: ResErrInterceptor

beforeAll(async () => {
  await import('../../src/shared/services/axios')

  requestInterceptor = vi.mocked(apiInstance.interceptors.request.use).mock
    .calls[0][0] as ReqInterceptor
  responseOk = vi.mocked(apiInstance.interceptors.response.use).mock.calls[0][0]
  responseErr = vi.mocked(apiInstance.interceptors.response.use).mock
    .calls[0][1] as ResErrInterceptor
})

const { default: axios } = await import('axios')

const makeError = (config: Record<string, any>, status: number) => ({
  config,
  response: { status },
})

beforeEach(() => {
  localStorage.clear()
  vi.mocked(apiInstance).mockReset()
  apiInstance.mockImplementation((config) =>
    Promise.resolve({ ...config, retried: true }),
  )
  vi.mocked(axios.post).mockReset()
})

describe('request interceptor — gắn Bearer token', () => {
  it('Có accessToken trong localStorage → header Authorization', () => {
    localStorage.setItem('accessToken', 'tok-1')
    const config = { headers: {} as Record<string, string> }

    const out = requestInterceptor(config)

    expect(out.headers.Authorization).toBe('Bearer tok-1')
  })

  it('Chưa đăng nhập → không gắn header', () => {
    const config = { headers: {} as Record<string, string> }

    const out = requestInterceptor(config)

    expect(out.headers.Authorization).toBeUndefined()
  })
})

describe('response interceptor — luồng 401 auto refresh', () => {
  it('Lỗi thường (không 401) → reject passthrough', async () => {
    const err = makeError({}, 500)

    await expect(responseErr(err)).rejects.toBe(err)
  })

  it('401 với _retry=true → không refresh lại, reject', async () => {
    const err = makeError({ _retry: true, headers: {} }, 401)

    await expect(responseErr(err)).rejects.toBe(err)
    expect(axios.post).not.toHaveBeenCalled()
  })

  it('401 lần đầu → gọi refresh, lưu token mới, retry request cũ', async () => {
    localStorage.setItem('refreshToken', 'rt-old')
    vi.mocked(axios.post).mockResolvedValue({
      data: {
        accessToken: 'at-new',
        refreshToken: { token: 'rt-new' },
        user: { id: 'u1' },
      },
    })

    const err = makeError(
      { headers: {}, url: '/api/tasks', _retry: false },
      401,
    )

    const res = await responseErr(err)

    expect(axios.post).toHaveBeenCalledWith(
      'http://api.test/auth/refresh-token',
      { refreshToken: 'rt-old' },
    )
    expect(localStorage.getItem('accessToken')).toBe('at-new')
    expect(localStorage.getItem('refreshToken')).toBe('rt-new')
    expect(localStorage.getItem('user')).toBe(JSON.stringify({ id: 'u1' }))
    expect(apiInstance).toHaveBeenCalledTimes(1)
    expect(apiInstance.mock.calls[0][0].headers.Authorization).toBe(
      'Bearer at-new',
    )
    expect(res).toMatchObject({ retried: true })
  })

  it('Nhiều request 401 đồng thời → chỉ refresh ĐÚNG 1 lần (single-flight)', async () => {
    let resolveRefresh!: (v: unknown) => void
    vi.mocked(axios.post).mockReturnValue(
      new Promise((resolve) => {
        resolveRefresh = resolve
      }),
    )

    const e1 = makeError({ headers: {}, _retry: false }, 401)
    const e2 = makeError({ headers: {}, _retry: false }, 401)

    const p1 = responseErr(e1)
    const p2 = responseErr(e2)

    resolveRefresh({
      data: {
        accessToken: 'at-new',
        refreshToken: { token: 'rt-new' },
        user: null,
      },
    })

    await Promise.all([p1, p2])

    expect(axios.post).toHaveBeenCalledTimes(1)
    expect(apiInstance).toHaveBeenCalledTimes(2)
  })

  it('Refresh thất bại → xoá 3 key auth và redirect /login', async () => {
    localStorage.setItem('accessToken', 'at')
    localStorage.setItem('refreshToken', 'rt')
    localStorage.setItem('user', '{}')
    vi.mocked(axios.post).mockRejectedValue(new Error('refresh dead'))

    // jsdom không implement navigation — thay location để quan sát redirect
    Object.defineProperty(window, 'location', {
      value: { href: 'http://localhost:5173/' },
      writable: true,
      configurable: true,
    })

    const err = makeError({ headers: {}, _retry: false }, 401)

    await expect(responseErr(err)).rejects.toBeTruthy()
    expect(localStorage.getItem('accessToken')).toBeNull()
    expect(localStorage.getItem('refreshToken')).toBeNull()
    expect(localStorage.getItem('user')).toBeNull()
    expect(window.location.href).toContain('/login')
  })

  it('Response thành công → passthrough nguyên response', () => {
    const res = { status: 200, data: {} }
    expect(responseOk(res)).toBe(res)
  })
})
