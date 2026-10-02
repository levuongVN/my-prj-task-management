import { describe, expect, it } from 'vitest'
import { isTokenExpired } from '../../src/shared/utils/token'

const encodePart = (obj: Record<string, unknown>) =>
  btoa(JSON.stringify(obj))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')

const makeToken = (payload: Record<string, unknown>) =>
  `${encodePart({ alg: 'HS256', typ: 'JWT' })}.${encodePart(payload)}.signature`

const secondsFromNow = (offset: number) =>
  Math.floor(Date.now() / 1000) + offset

describe('isTokenExpired', () => {
  it('token còn hạn → false', () => {
    expect(isTokenExpired(makeToken({ exp: secondsFromNow(3600) }))).toBe(false)
  })

  it('token đã hết hạn → true', () => {
    expect(isTokenExpired(makeToken({ exp: secondsFromNow(-3600) }))).toBe(true)
  })

  it('token sắp hết hạn trong ngưỡng skew (30s) → true', () => {
    expect(isTokenExpired(makeToken({ exp: secondsFromNow(10) }))).toBe(true)
  })

  it('rỗng / null / undefined → true', () => {
    expect(isTokenExpired('')).toBe(true)
    expect(isTokenExpired(null)).toBe(true)
    expect(isTokenExpired(undefined)).toBe(true)
  })

  it('chuỗi không decode được → true', () => {
    expect(isTokenExpired('not-a-jwt')).toBe(true)
  })

  it('token không có exp → coi như còn hạn (false)', () => {
    expect(isTokenExpired(makeToken({ sub: 'u1' }))).toBe(false)
  })
})
