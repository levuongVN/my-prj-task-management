import api from "../../../shared/services/axios";
import type { NotificationDto } from "../types";

export async function getNotifications(take = 50): Promise<NotificationDto[]> {
    const response = await api.get<NotificationDto[]>("/notifications", {
        params: { take },
    });
    return response.data;
}

export async function getUnreadCount(): Promise<number> {
    const response = await api.get<{ count: number }>("/notifications/unread-count");
    return response.data.count;
}

export async function markNotificationRead(id: string): Promise<void> {
    await api.post(`/notifications/${id}/read`);
}

export async function markAllNotificationsRead(): Promise<number> {
    const response = await api.post<{ count: number }>("/notifications/read-all");
    return response.data.count;
}
