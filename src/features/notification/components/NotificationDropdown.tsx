import { ArrowRight, CheckCheck, Inbox } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useNotificationStore } from "../store/notificationStore";
import { resolveNotificationTarget } from "../utils/resolveNotificationTarget";
import { NotificationItem } from "./NotificationItem";

interface NotificationDropdownProps {
    onClose?: () => void;
}

export function NotificationDropdown({ onClose }: NotificationDropdownProps) {
    const navigate = useNavigate();
    const notifications = useNotificationStore((s) => s.notifications);
    const unreadCount = useNotificationStore((s) => s.unreadCount);
    const isLoading = useNotificationStore((s) => s.isLoading);
    const markAsRead = useNotificationStore((s) => s.markAsRead);
    const markAllAsRead = useNotificationStore((s) => s.markAllAsRead);

    const handleOpenNotification = (notification: Parameters<typeof resolveNotificationTarget>[0]) => {
        const target = resolveNotificationTarget(notification);
        const search = new URLSearchParams(target.search);
        onClose?.();
        navigate({
            pathname: target.path,
            search: search.toString() ? `?${search.toString()}` : "",
        });
    };

    return (
        <div className="absolute right-0 top-full mt-2 w-[380px] rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl shadow-black/40">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/8 px-4 py-3">
                <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-zinc-100">Notifications</h3>
                    {unreadCount > 0 && (
                        <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-blue-500 px-1.5 text-[10px] font-bold text-white">
                            {unreadCount}
                        </span>
                    )}
                </div>

                {unreadCount > 0 && (
                    <button
                        onClick={markAllAsRead}
                        className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium text-zinc-400 transition hover:bg-white/5 hover:text-zinc-200"
                    >
                        <CheckCheck size={13} />
                        Mark all read
                    </button>
                )}
            </div>

            {/* List */}
            <div className="max-h-[360px] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-white/10">
                {isLoading ? (
                    <div className="flex justify-center py-10">
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="flex flex-col items-center gap-3 py-10 text-zinc-500">
                        <Inbox size={32} strokeWidth={1.2} />
                        <p className="text-sm">No notifications yet</p>
                    </div>
                ) : (
                    <div className="space-y-0.5">
                        {notifications.map((n) => (
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

            {/* Footer */}
            <div className="border-t border-white/8 p-2">
                <button
                    onClick={() => {
                        onClose?.();
                        navigate("/notifications");
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-white/5 hover:text-white"
                >
                    All Notifications
                    <ArrowRight size={15} />
                </button>
            </div>
        </div>
    );
}
