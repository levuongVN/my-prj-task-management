import { describe, expect, it } from 'vitest'
import { deriveCalendarEvents } from '../../src/shared/utils/deriveCalendarEvents'
import { TaskStatus } from '../../src/constants/taskOption'

const project = (over: Partial<Record<string, unknown>>) =>
  ({
    id: 'p1',
    name: 'Website',
    status: 0,
    due: '2099-01-01',
    progress: 0,
    taskIds: [],
    ...over,
  }) as never

const task = (over: Partial<Record<string, unknown>>) =>
  ({
    id: 't1',
    title: 'Task A',
    status: TaskStatus.Pending,
    deadline: '2099-06-01',
    userId: 'u1',
    position: 0,
    createdAt: '',
    updatedAt: '',
    ...over,
  }) as never

const meeting = (over: Partial<Record<string, unknown>>) =>
  ({
    id: 'm1',
    title: 'Daily',
    startAt: '2026-09-30T14:35:00Z',
    userId: 'u1',
    ...over,
  }) as never

describe('deriveCalendarEvents', () => {
  it('Project archived (status=2) bị bỏ qua', () => {
    const events = deriveCalendarEvents([project({ status: 2 })], [], [])
    expect(events).toHaveLength(0)
  })

  it('Project quá hạn chưa xong → type overdue', () => {
    const events = deriveCalendarEvents(
      [project({ due: '2020-01-01', status: 0 })],
      [],
      [],
    )
    expect(events[0].type).toBe('overdue')
  })

  it('Project hoàn thành (status=1) dù trễ hạn vẫn là milestone', () => {
    const events = deriveCalendarEvents(
      [project({ due: '2020-01-01', status: 1 })],
      [],
      [],
    )
    expect(events[0].type).toBe('milestone')
  })

  it('Project trong tương lai → milestone', () => {
    const events = deriveCalendarEvents([project({})], [], [])
    expect(events[0].type).toBe('milestone')
  })

  it('Task completed hoặc thiếu deadline bị bỏ qua', () => {
    const events = deriveCalendarEvents([], [
      task({ status: TaskStatus.Completed }),
      task({ id: 't2', deadline: null }),
    ], [])
    expect(events).toHaveLength(0)
  })

  it('Task có deadline và chưa xong → type task', () => {
    const events = deriveCalendarEvents([], [task({})], [])
    expect(events).toHaveLength(1)
    expect(events[0]).toMatchObject({
      type: 'task',
      sourceType: 'task',
      sourceId: 't1',
      date: '2099-06-01',
    })
  })

  it('Meeting tách date và time từ startAt', () => {
    const events = deriveCalendarEvents([], [], [meeting({})])
    expect(events[0]).toMatchObject({
      type: 'meeting',
      date: '2026-09-30',
      time: '14:35',
    })
  })

  it('Meeting startAt thiếu T → date nguyên chuỗi, không crash', () => {
    const events = deriveCalendarEvents([], [], [meeting({ startAt: '2026-09-30' })])
    expect(events[0].date).toBe('2026-09-30')
    expect(events[0].time).toBe('')
  })

  it('Id prefix phân biệt nguồn', () => {
    const events = deriveCalendarEvents(
      [project({})],
      [task({})],
      [meeting({})],
    )
    expect(events.map((e) => e.id)).toEqual(['project-p1', 'task-t1', 'meeting-m1'])
  })
})
