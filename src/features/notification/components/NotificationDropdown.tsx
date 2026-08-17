import { CheckCheck, Inbox } from "lucide-react";
import { useNotifications } from "../hooks/useNotifications";
import { NotificationItem } from "./NotificationItem";

export function NotificationDropdown() {
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

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
                {notifications.length === 0 ? (
                    <div className="flex flex-col items-center gap-3 py-10 text-zinc-500">
                        <Inbox size={32} strokeWidth={1.2} />
                        <p className="text-sm">No notifications yet</p>
                    </div>
                ) : (
                    <div className="space-y-0.5">
                        {notifications.map((n) => (
                            <NotificationItem key={n.id} notification={n} onRead={markAsRead} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
