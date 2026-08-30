export type NotificationType = "task-deadline" | "task-overdue" | "meeting";

export const NOTIFICATION_TYPE_MAP: Record<number, NotificationType> = {
    1: "task-deadline",
    2: "task-overdue",
    3: "meeting",
};

export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    taskId: string | null;
    projectId: string | null;
    meetingId: string | null;
    isRead: boolean;
    createdAt: string;
}

export interface NotificationDto {
    id: string;
    type: number;
    title: string;
    message: string;
    taskId: string | null;
    projectId: string | null;
    meetingId: string | null;
    isRead: boolean;
    createdAt: string;
}

export function mapNotification(dto: NotificationDto): Notification | null {
    const type = NOTIFICATION_TYPE_MAP[dto.type];
    if (!type) return null;

    return {
        id: dto.id,
        type,
        title: dto.title,
        message: dto.message,
        taskId: dto.taskId ?? null,
        projectId: dto.projectId ?? null,
        meetingId: dto.meetingId ?? null,
        isRead: dto.isRead,
        createdAt: dto.createdAt,
    };
}
