import { createElement } from "react";
import { create } from "zustand";
import { AlarmClock, Calendar, CheckCircle2, type LucideIcon } from "lucide-react";
import toast from "react-hot-toast";
import type { Notification, NotificationDto } from "../types";
import { mapNotification } from "../types";
import {
    getNotifications,
    getUnreadCount,
    markAllNotificationsRead,
    markNotificationRead,
} from "../services/notification.service";

const TOAST_ICON: Record<Notification["type"], LucideIcon> = {
    "task-deadline": AlarmClock,
    "task-overdue": CheckCircle2,
    meeting: Calendar,
};

interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
    isLoading: boolean;
    error: string | null;
    loadNotifications: () => Promise<void>;
    loadUnreadCount: () => Promise<void>;
    refresh: () => Promise<void>;
    prependNotification: (raw: NotificationDto) => void;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
    notifications: [],
    unreadCount: 0,
    isLoading: false,
    error: null,

    loadNotifications: async () => {
        set({ isLoading: true, error: null });
        try {
            const dtos = await getNotifications(50);
            const notifications = dtos
                .map(mapNotification)
                .filter((n): n is Notification => n !== null);
            set({ notifications, isLoading: false });
            await get().loadUnreadCount();
        } catch {
            set({ isLoading: false, error: "Failed to load notifications" });
        }
    },

    loadUnreadCount: async () => {
        try {
            const count = await getUnreadCount();
            set({ unreadCount: count });
        } catch {
            // silent - badge just keeps previous value
        }
    },

    refresh: async () => {
        await get().loadNotifications();
        await get().loadUnreadCount();
    },

    prependNotification: (raw) => {
        const notification = mapNotification(raw);
        if (!notification) return;

        set((state) => ({
            notifications: [notification, ...state.notifications],
            unreadCount: state.unreadCount + 1,
        }));

        const ToastIcon = TOAST_ICON[notification.type];

        toast(notification.message, {
            icon: createElement(ToastIcon, {
                size: 18,
                className:
                    notification.type === "task-overdue"
                        ? "text-red-400"
                        : "text-zinc-300",
            }),
            duration: 4000,
            style:
                notification.type === "task-overdue"
                    ? { background: "#1c1917", color: "#fca5a5", border: "1px solid rgba(239,68,68,0.4)" }
                    : undefined,
        });
    },

    markAsRead: async (id) => {
        const target = get().notifications.find((n) => n.id === id);
        if (!target || target.isRead) return;

        set((state) => ({
            notifications: state.notifications.map((n) =>
                n.id === id ? { ...n, isRead: true } : n
            ),
            unreadCount: Math.max(0, state.unreadCount - 1),
        }));

        try {
            await markNotificationRead(id);
        } catch {
            // revert optimistic update on failure
            set((state) => ({
                notifications: state.notifications.map((n) =>
                    n.id === id ? { ...n, isRead: false } : n
                ),
                unreadCount: state.unreadCount + 1,
            }));
        }
    },

    markAllAsRead: async () => {
        const previousCount = get().unreadCount;
        set((state) => ({
            notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
            unreadCount: 0,
        }));

        try {
            const count = await markAllNotificationsRead();
            set({ unreadCount: count });
        } catch {
            set((state) => ({
                notifications: state.notifications.map((n) => ({ ...n, isRead: false })),
                unreadCount: previousCount,
            }));
        }
    },
}));
