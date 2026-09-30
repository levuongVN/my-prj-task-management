import { describe, expect, it } from 'vitest'
import {
  buildMonthDays,
  buildWeekDays,
  formatDate,
  getTodayDateStr,
  toDateStr,
} from '../../src/shared/utils/dateHelper'

describe('toDateStr', () => {
  it(' Ghép year-month-day, month đếm từ 0 và pad 2 số', () => {
    expect(toDateStr(2026, 8, 5)).toBe('2026-09-05')
    expect(toDateStr(2026, 0, 1)).toBe('2026-01-01')
  })
})

describe('buildMonthDays', () => {
  it('Lưới 42 ô, tháng 9/2026 có 30 ngày hiện tại', () => {
    const days = buildMonthDays(2026, 8) // Sep 2026, day 1 là thứ 3 (firstDay=2)
    expect(days).toHaveLength(42)
    expect(days.filter((d) => d.isCurrentMonth)).toHaveLength(30)
    // 2 ô đầu thuộc tháng trước (31/8)
    expect(days[0]).toMatchObject({ day: 30, isCurrentMonth: false })
    expect(days[1]).toMatchObject({ day: 31, isCurrentMonth: false })
    expect(days[2]).toMatchObject({ day: 1, isCurrentMonth: true, date: '2026-09-01' })
  })

  it('Tháng 2 năm nhuận 2024 có 29 ngày', () => {
    const days = buildMonthDays(2024, 1)
    expect(days.filter((d) => d.isCurrentMonth)).toHaveLength(29)
  })

  it('Tháng 2 năm thường 2026 có 28 ngày', () => {
    const days = buildMonthDays(2026, 1)
    expect(days.filter((d) => d.isCurrentMonth)).toHaveLength(28)
  })

  it('Tháng 12 wrap sang tháng 1 năm sau', () => {
    const days = buildMonthDays(2026, 11)
    const last = days[days.length - 1]
    expect(last.isCurrentMonth).toBe(false)
    expect(last.date.startsWith('2027-01')).toBe(true)
  })

  it('Tháng bắt đầu thứ 2 (firstDay=1) chỉ có 1 ô tháng trước', () => {
    const days = buildMonthDays(2026, 5) // Jun 2026, 1/6 là thứ 2
    expect(days[0]).toMatchObject({ day: 31, isCurrentMonth: false, date: '2026-05-31' })
    expect(days[1].isCurrentMonth).toBe(true)
  })
})

describe('buildWeekDays', () => {
  it('Trả 7 ngày với label thứ trong tuần', () => {
    const days = buildWeekDays(2026, 8, 1) // 1..7 Sep 2026
    expect(days).toHaveLength(7)
    expect(days[0]).toMatchObject({ day: 1, date: '2026-09-01' })
    expect(days.map((d) => d.day)).toEqual([1, 2, 3, 4, 5, 6, 7])
    expect(new Set(days.map((d) => d.label)).size).toBeGreaterThan(1)
  })

  it('Wrap qua ranh giới tháng', () => {
    const days = buildWeekDays(2026, 8, 28) // 28 Sep → 4 Oct
    expect(days[0].date).toBe('2026-09-28')
    expect(days[6].date).toBe('2026-10-04')
  })
})

describe('formatDate / getTodayDateStr', () => {
  it('formatDate ISO → dd/mm/yyyy', () => {
    expect(formatDate('2026-09-05')).toBe('05/09/2026')
    expect(formatDate('2026-01-31')).toBe('31/01/2026')
  })

  it('getTodayDateStr khớp ngày hôm nay', () => {
    const t = new Date()
    const expected = toDateStr(t.getFullYear(), t.getMonth(), t.getDate())
    expect(getTodayDateStr()).toBe(expected)
  })
})
