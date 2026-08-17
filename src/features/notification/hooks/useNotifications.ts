import { useCallback, useMemo, useState } from "react";
import type { Notification } from "../types";
import { MOCK_NOTIFICATIONS } from "../data";

export function useNotifications() {
    const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

    const unreadCount = useMemo(
        () => notifications.filter((n) => !n.read).length,
        [notifications]
    );

    const markAsRead = useCallback((id: string) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
    }, []);

    const markAllAsRead = useCallback(() => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    }, []);

    return { notifications, unreadCount, markAsRead, markAllAsRead };
}
