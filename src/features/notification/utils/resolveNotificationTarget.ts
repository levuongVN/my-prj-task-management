import type { Notification } from "../types";

export interface NotificationTarget {
    path: string;
    search: Record<string, string>;
}

/**
 * Resolve the route the user should land on when opening a notification.
 * Falls back to /tasks when the referenced entity id is missing.
 */
export function resolveNotificationTarget(notification: Notification): NotificationTarget {
    switch (notification.type) {
        case "task-deadline":
        case "task-overdue":
            return {
                path: "/tasks",
                search: notification.taskId ? { taskId: notification.taskId } : {},
            };
        case "meeting":
            if (notification.meetingId) {
                return {
                    path: "/calendar",
                    search: { meetingId: notification.meetingId },
                };
            }
            return {
                path: "/projects",
                search: notification.projectId ? { projectId: notification.projectId } : {},
            };
        default:
            return { path: "/tasks", search: {} };
    }
}
