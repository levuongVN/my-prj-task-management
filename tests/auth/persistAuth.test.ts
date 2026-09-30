import { beforeEach, describe, expect, it } from 'vitest'
import { persistAuthResponse } from '../../src/features/auth/utils/persistAuth'
import { getDeviceFingerprint } from '../../src/features/auth/utils/fingerprint'

describe('persistAuthResponse', () => {
  beforeEach(() => localStorage.clear())

  it('Lưu 3 key theo đúng contract axios interceptor đọc', () => {
    persistAuthResponse({
      accessToken: 'at-123',
      refreshToken: { token: 'rt-456', expiresAt: '2026-10-01' },
      user: { id: 'u1', email: 'a@b.com' },
    } as never)

    expect(localStorage.getItem('accessToken')).toBe('at-123')
    expect(localStorage.getItem('refreshToken')).toBe('rt-456')
    expect(localStorage.getItem('user')).toBe(
      JSON.stringify({ id: 'u1', email: 'a@b.com' }),
    )
  })
})

describe('getDeviceFingerprint', () => {
  beforeEach(() => localStorage.clear())

  it('Lần đầu sinh UUID mới và lưu localStorage', () => {
    const fp = getDeviceFingerprint()
    expect(fp).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    )
    expect(localStorage.getItem('taskflow_device_fingerprint')).toBe(fp)
  })

  it('Lần sau tái sử dụng đúng fingerprint đã lưu', () => {
    localStorage.setItem('taskflow_device_fingerprint', 'fixed-fp')
    expect(getDeviceFingerprint()).toBe('fixed-fp')
  })

  it('Xoá localStorage → sinh fingerprint khác', () => {
    const first = getDeviceFingerprint()
    localStorage.clear()
    expect(getDeviceFingerprint()).not.toBe(first)
  })
})
