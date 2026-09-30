import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../../src/features/notification/services/notification.service', () => ({
  getNotifications: vi.fn(),
  getUnreadCount: vi.fn(),
  markNotificationRead: vi.fn(),
  markAllNotificationsRead: vi.fn(),
}))

vi.mock('react-hot-toast', () => ({ default: vi.fn() }))

const { useNotificationStore } = await import(
  '../../src/features/notification/store/notificationStore'
)
const {
  getNotifications,
  getUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
} = await import('../../src/features/notification/services/notification.service')

const dto = (over: Record<string, unknown> = {}) =>
  ({
    id: 'n1',
    type: 1,
    title: 'Deadline',
    message: 'Task A sắp hết hạn',
    taskId: 't1',
    projectId: null,
    meetingId: null,
    isRead: false,
    createdAt: '2026-09-30',
    ...over,
  }) as never

const reset = (over: Record<string, unknown> = {}) =>
  useNotificationStore.setState({
    notifications: [],
    unreadCount: 0,
    isLoading: false,
    error: null,
    ...over,
  } as never)

beforeEach(() => {
  reset()
  vi.mocked(getNotifications).mockReset()
  vi.mocked(getUnreadCount).mockReset()
  vi.mocked(markNotificationRead).mockReset()
  vi.mocked(markAllNotificationsRead).mockReset()
})

describe('loadNotifications', () => {
  it('Load + map DTO, lọc type không hợp lệ, refresh unread', async () => {
    vi.mocked(getNotifications).mockResolvedValue([
      dto(),
      dto({ id: 'n2', type: 99 }),
      dto({ id: 'n3', type: 3, isRead: true }),
    ] as never)
    vi.mocked(getUnreadCount).mockResolvedValue(1)

    await useNotificationStore.getState().loadNotifications()

    const { notifications, isLoading, error, unreadCount } =
      useNotificationStore.getState()
    expect(notifications.map((n) => n.id)).toEqual(['n1', 'n3'])
    expect(notifications[1].type).toBe('meeting')
    expect(isLoading).toBe(false)
    expect(error).toBeNull()
    expect(unreadCount).toBe(1)
  })

  it('API lỗi → set error, isLoading false', async () => {
    vi.mocked(getNotifications).mockRejectedValue(new Error('boom'))

    await useNotificationStore.getState().loadNotifications()

    expect(useNotificationStore.getState().error).toBe(
      'Failed to load notifications',
    )
    expect(useNotificationStore.getState().isLoading).toBe(false)
  })
})

describe('prependNotification', () => {
  it('Notification mới hợp lệ → đưa lên đầu + tăng unread + hiện toast', () => {
    reset({ notifications: [dto({ id: 'old' }) as never], unreadCount: 2 })

    useNotificationStore.getState().prependNotification(dto({ id: 'new' }))

    const { notifications, unreadCount } = useNotificationStore.getState()
    expect(notifications[0].id).toBe('new')
    expect(unreadCount).toBe(3)
  })

  it('DTO type không hợp lệ (mapNotification null) → bỏ qua, không tăng unread', () => {
    reset({ unreadCount: 5 })

    useNotificationStore.getState().prependNotification(dto({ type: 99 }))

    expect(useNotificationStore.getState().notifications).toHaveLength(0)
    expect(useNotificationStore.getState().unreadCount).toBe(5)
  })
})

describe('markAsRead', () => {
  it('Đánh dấu chưa đọc → optimistic isRead + giảm unread + gọi API', async () => {
    reset({ notifications: [dto({ id: 'x' }) as never], unreadCount: 4 })
    vi.mocked(markNotificationRead).mockResolvedValue(undefined as never)

    await useNotificationStore.getState().markAsRead('x')

    const { notifications, unreadCount } = useNotificationStore.getState()
    expect(notifications[0].isRead).toBe(true)
    expect(unreadCount).toBe(3)
    expect(markNotificationRead).toHaveBeenCalledWith('x')
  })

  it('API lỗi → revert trạng thái optimistic', async () => {
    reset({ notifications: [dto({ id: 'x' }) as never], unreadCount: 4 })
    vi.mocked(markNotificationRead).mockRejectedValue(new Error('net fail'))

    await useNotificationStore.getState().markAsRead('x')

    const { notifications, unreadCount } = useNotificationStore.getState()
    expect(notifications[0].isRead).toBe(false)
    expect(unreadCount).toBe(4)
  })

  it('Đã đọc rồi hoặc id lạ → không gọi API', async () => {
    reset({ notifications: [dto({ id: 'x', isRead: true }) as never] })

    await useNotificationStore.getState().markAsRead('x')
    await useNotificationStore.getState().markAsRead('ghost')

    expect(markNotificationRead).not.toHaveBeenCalled()
  })
})

describe('markAllAsRead', () => {
  it('Thành công → tất cả isRead, unread bằng số server trả', async () => {
    reset({
      notifications: [dto({ id: 'a' }) as never, dto({ id: 'b', isRead: true }) as never],
      unreadCount: 1,
    })
    vi.mocked(markAllNotificationsRead).mockResolvedValue(2)

    await useNotificationStore.getState().markAllAsRead()

    const { notifications, unreadCount } = useNotificationStore.getState()
    expect(notifications.every((n) => n.isRead)).toBe(true)
    expect(unreadCount).toBe(2)
  })

  it('Lỗi → revert về unread trước đó và bỏ cờ isRead', async () => {
    reset({
      notifications: [dto({ id: 'a' }) as never],
      unreadCount: 7,
    })
    vi.mocked(markAllNotificationsRead).mockRejectedValue(new Error('boom'))

    await useNotificationStore.getState().markAllAsRead()

    const { notifications, unreadCount } = useNotificationStore.getState()
    expect(notifications[0].isRead).toBe(false)
    expect(unreadCount).toBe(7)
  })
})
