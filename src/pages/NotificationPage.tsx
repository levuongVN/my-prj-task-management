import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, CheckCheck, Inbox } from "lucide-react";
import { useNotificationStore } from "../features/notification/store/notificationStore";
import { resolveNotificationTarget } from "../features/notification/utils/resolveNotificationTarget";
import { NotificationItem } from "../features/notification/components/NotificationItem";

type Filter = "all" | "unread";

export default function NotificationPage() {
    const navigate = useNavigate();
    const notifications = useNotificationStore((s) => s.notifications);
    const unreadCount = useNotificationStore((s) => s.unreadCount);
    const isLoading = useNotificationStore((s) => s.isLoading);
    const error = useNotificationStore((s) => s.error);
    const markAsRead = useNotificationStore((s) => s.markAsRead);
    const markAllAsRead = useNotificationStore((s) => s.markAllAsRead);

    const handleOpenNotification = (notification: Parameters<typeof resolveNotificationTarget>[0]) => {
        const target = resolveNotificationTarget(notification);
        const search = new URLSearchParams(target.search);
        navigate({
            pathname: target.path,
            search: search.toString() ? `?${search.toString()}` : "",
        });
    };

    const [filter, setFilter] = useState<Filter>("all");

    const visibleNotifications =
        filter === "all" ? notifications : notifications.filter((n) => !n.isRead);

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <p className="mb-1.5 text-[11px] font-medium uppercase tracking-widest text-zinc-600">Inbox</p>
                <h1 className="text-[22px] font-medium text-white">Notifications</h1>
                <p className="mt-1 text-sm text-zinc-600">Stay on top of deadlines, tasks, and meetings.</p>
            </div>

            {/* Card */}
            <div className="rounded-[32px] border border-white/5 bg-zinc-950">
                {/* Toolbar */}
                <div className="flex flex-col gap-4 border-b border-white/8 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-1 rounded-xl bg-white/5 p-1">
                        {(["all", "unread"] as Filter[]).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                                    filter === f
                                        ? "bg-white text-black"
                                        : "text-zinc-400 hover:text-zinc-200"
                                }`}
                            >
                                {f === "all" ? "All" : "Unread"}
                                {f === "unread" && unreadCount > 0 && (
                                    <span className="ml-2 text-xs text-zinc-500">{unreadCount}</span>
                                )}
                            </button>
                        ))}
                    </div>

                    {unreadCount > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="flex items-center gap-2 self-start rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:bg-white/5 hover:text-white sm:self-auto"
                        >
                            <CheckCheck size={16} />
                            Mark all as read
                        </button>
                    )}
                </div>

                {/* List */}
                <div className="p-3 sm:p-4">
                    {isLoading ? (
                        <div className="flex justify-center py-16">
                            <span className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center gap-3 py-16 text-zinc-500">
                            <Bell size={32} strokeWidth={1.2} />
                            <p className="text-sm">{error}</p>
                        </div>
                    ) : visibleNotifications.length === 0 ? (
                        <div className="flex flex-col items-center gap-3 py-16 text-zinc-500">
                            <Inbox size={32} strokeWidth={1.2} />
                            <p className="text-sm">
                                {filter === "unread" ? "You're all caught up" : "No notifications yet"}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {visibleNotifications.map((n) => (
                                <NotificationItem
                                    key={n.id}
                                    notification={n}
                                    onRead={markAsRead}
                                    onOpen={handleOpenNotification}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
