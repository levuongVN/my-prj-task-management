import { describe, expect, it } from 'vitest'
import { loginSchema } from '../../src/features/auth/schemas/login.schema'
import { registerSchema } from '../../src/features/auth/schemas/register.schema'

describe('loginSchema', () => {
  it('Đã hợp lệ', () => {
    const res = loginSchema.safeParse({
      email: 'a@b.com',
      password: '123456',
    })
    expect(res.success).toBe(true)
  })

  it('Email sai định dạng bị chặn', () => {
    const res = loginSchema.safeParse({
      email: 'khong-phai-email',
      password: '123456',
    })
    expect(res.success).toBe(false)
    if (!res.success) {
      expect(res.error.issues[0].message).toBe('Invalid email address')
    }
  })

  it('Password dưới 6 ký tự bị chặn', () => {
    const res = loginSchema.safeParse({
      email: 'a@b.com',
      password: '12345',
    })
    expect(res.success).toBe(false)
    if (!res.success) {
      expect(res.error.issues[0].message).toBe(
        'Password must be at least 6 characters',
      )
    }
  })
})

describe('registerSchema', () => {
  const base = {
    fullName: 'Nguyen Van A',
    email: 'a@b.com',
    password: '123456',
    confirmPassword: '123456',
  }

  it('Hợp lệ', () => {
    expect(registerSchema.safeParse(base).success).toBe(true)
  })

  it('fullName chỉ toàn khoảng trắng bị chặn (trim trước khi check)', () => {
    const res = registerSchema.safeParse({ ...base, fullName: '   ' })
    expect(res.success).toBe(false)
    if (!res.success) {
      expect(res.error.issues[0].message).toBe('Full name is required')
    }
  })

  it('fullName quá 100 ký tự bị chặn', () => {
    const res = registerSchema.safeParse({ ...base, fullName: 'x'.repeat(101) })
    expect(res.success).toBe(false)
    if (!res.success) {
      expect(res.error.issues[0].message).toBe('Full name is too long')
    }
  })

  it('confirmPassword lệch → lỗi ở đúng field confirmPassword', () => {
    const res = registerSchema.safeParse({
      ...base,
      confirmPassword: 'khac-roir',
    })
    expect(res.success).toBe(false)
    if (!res.success) {
      expect(res.error.issues[0].path).toEqual(['confirmPassword'])
      expect(res.error.issues[0].message).toBe('Passwords do not match')
    }
  })
})
