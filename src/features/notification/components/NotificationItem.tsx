import { memo } from "react";
import { CheckCircle2, FolderKanban, MessageSquare, Server } from "lucide-react";
import type { Notification } from "../types";

const TYPE_ICON: Record<Notification["type"], typeof CheckCircle2> = {
    task: CheckCircle2,
    project: FolderKanban,
    meeting: MessageSquare,
    system: Server,
};

const TYPE_COLOR: Record<Notification["type"], string> = {
    task: "text-blue-400",
    project: "text-emerald-400",
    meeting: "text-amber-400",
    system: "text-zinc-400",
};

function timeAgo(dateStr: string): string {
    const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}

interface Props {
    notification: Notification;
    onRead: (id: string) => void;
}

function NotificationItemInner({ notification, onRead }: Props) {
    const Icon = TYPE_ICON[notification.type];

    return (
        <button
            onClick={() => !notification.read && onRead(notification.id)}
            className={`flex w-full gap-3 rounded-xl px-3 py-3 text-left transition-colors ${
                notification.read ? "bg-transparent" : "bg-blue-500/[0.06]"
            } hover:bg-white/5`}
        >
            <div className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-white/5 ${TYPE_COLOR[notification.type]}`}>
                <Icon size={16} />
            </div>

            <div className="min-w-0 flex-1">
                <p className={`text-sm leading-snug ${notification.read ? "text-zinc-400" : "text-zinc-100 font-medium"}`}>
                    {notification.title}
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-zinc-500 line-clamp-2">
                    {notification.message}
                </p>
                <p className="mt-1 text-[10px] text-zinc-600">{timeAgo(notification.createdAt)}</p>
            </div>

            {!notification.read && (
                <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />
            )}
        </button>
    );
}

const NotificationItem = memo(NotificationItemInner);
export { NotificationItem };
