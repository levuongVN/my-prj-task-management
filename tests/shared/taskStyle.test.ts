import { describe, expect, it } from 'vitest'
import { getNextDeadline } from '../../src/constants/taskOption'
import { getPriorityStyle, getStatusStyle } from '../../src/shared/utils/taskStyle'

describe('getNextDeadline', () => {
  it('Không có deadline → null', () => {
    expect(getNextDeadline(null, 1)).toBeNull()
    expect(getNextDeadline(undefined, 2)).toBeNull()
  })

  it('Daily +1 ngày', () => {
    expect(getNextDeadline('2026-09-30T00:00:00.000Z', 1)).toBe(
      '2026-10-01T00:00:00.000Z',
    )
  })

  it('Weekly +7 ngày', () => {
    expect(getNextDeadline('2026-10-05T00:00:00.000Z', 2)).toBe(
      '2026-10-12T00:00:00.000Z',
    )
  })

  it('Monthly 31/01 clamp về 28/02', () => {
    expect(getNextDeadline('2026-01-31T00:00:00.000Z', 3)).toBe(
      '2026-02-28T00:00:00.000Z',
    )
  })

  it('Monthly ngày thường giữ nguyên ngày', () => {
    expect(getNextDeadline('2026-01-15T00:00:00.000Z', 3)).toBe(
      '2026-02-15T00:00:00.000Z',
    )
  })

  it('Recurrence không hợp lệ → null', () => {
    expect(getNextDeadline('2026-01-15T00:00:00.000Z', 99)).toBeNull()
  })
})

describe('getPriorityStyle', () => {
  it('Map đúng màu theo mức ưu tiên', () => {
    expect(getPriorityStyle('High')).toContain('text-red-400')
    expect(getPriorityStyle('Medium')).toContain('text-yellow-300')
    expect(getPriorityStyle('Low')).toContain('text-emerald-400')
  })

  it('Giá trị lạ → style mặc định zinc', () => {
    expect(getPriorityStyle(' Urgent ')).toContain('text-zinc-400')
  })
})

describe('getStatusStyle', () => {
  it('Map đúng màu theo trạng thái', () => {
    expect(getStatusStyle('Pending')).toContain('text-orange-300')
    expect(getStatusStyle('In Progress')).toContain('text-blue-400')
    expect(getStatusStyle('In Review')).toContain('text-purple-400')
    expect(getStatusStyle('Completed')).toContain('text-emerald-400')
  })

  it('Nhãn legacy vẫn hoạt động', () => {
    expect(getStatusStyle('Todo')).toContain('text-gray-300')
    expect(getStatusStyle('Overdue')).toContain('text-red-400')
  })

  it('Giá trị lạ → style mặc định', () => {
    expect(getStatusStyle('Unknown')).toContain('text-zinc-400')
  })
})
