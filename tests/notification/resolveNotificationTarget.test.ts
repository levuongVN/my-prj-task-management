import { describe, expect, it } from 'vitest'
import { resolveNotificationTarget } from '../../src/features/notification/utils/resolveNotificationTarget'

const n = (over: Record<string, unknown> = {}) =>
  ({
    id: 'n1',
    type: 'task-deadline',
    title: 't',
    message: 'm',
    taskId: null,
    projectId: null,
    meetingId: null,
    isRead: false,
    createdAt: '',
    ...over,
  }) as never

describe('resolveNotificationTarget', () => {
  it('task-deadline có taskId → /tasks kèm query taskId', () => {
    expect(resolveNotificationTarget(n({ taskId: 't9' }))).toEqual({
      path: '/tasks',
      search: { taskId: 't9' },
    })
  })

  it('task-overdue thiếu taskId → /tasks không query', () => {
    expect(resolveNotificationTarget(n({ type: 'task-overdue' }))).toEqual({
      path: '/tasks',
      search: {},
    })
  })

  it('meeting có meetingId → /calendar', () => {
    expect(resolveNotificationTarget(n({ type: 'meeting', meetingId: 'm9' }))).toEqual({
      path: '/calendar',
      search: { meetingId: 'm9' },
    })
  })

  it('meeting không meetingId nhưng có projectId → /projects', () => {
    expect(
      resolveNotificationTarget(n({ type: 'meeting', projectId: 'p9' })),
    ).toEqual({
      path: '/projects',
      search: { projectId: 'p9' },
    })
  })

  it('meeting thiếu cả hai → /projects không query', () => {
    expect(resolveNotificationTarget(n({ type: 'meeting' }))).toEqual({
      path: '/projects',
      search: {},
    })
  })

  it('Type lạ → fallback /tasks', () => {
    expect(resolveNotificationTarget(n({ type: 'unknown' as never }))).toEqual({
      path: '/tasks',
      search: {},
    })
  })
})
