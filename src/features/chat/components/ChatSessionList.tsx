import { Loader2, MessageSquare, Plus, Trash2 } from "lucide-react";
import { useChatStore } from "../store/chatStore";
import { formatSessionTime } from "../utils/chatTime";

interface ChatSessionListProps {
    onSelectSession?: () => void;
}

export function ChatSessionList({ onSelectSession }: ChatSessionListProps) {
    const sessions = useChatStore((s) => s.sessions);
    const sessionsLoading = useChatStore((s) => s.sessionsLoading);
    const activeSessionId = useChatStore((s) => s.activeSessionId);
    const selectSession = useChatStore((s) => s.selectSession);
    const removeSession = useChatStore((s) => s.removeSession);
    const startNewChat = useChatStore((s) => s.startNewChat);

    return (
        <div className="flex h-full flex-col">
            <button
                type="button"
                onClick={() => {
                    startNewChat();
                    onSelectSession?.();
                }}
                className="mx-2 mt-2 flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm font-medium text-zinc-200 transition hover:bg-white/10"
            >
                <Plus size={15} />
                New chat
            </button>

            <div className="mt-3 flex-1 overflow-y-auto px-2 pb-2 scrollbar-thin scrollbar-thumb-white/10">
                {sessionsLoading ? (
                    <div className="flex justify-center py-8 text-zinc-500">
                        <Loader2 size={18} className="animate-spin" />
                    </div>
                ) : sessions.length === 0 ? (
                    <div className="flex flex-col items-center gap-2 py-10 text-zinc-600">
                        <MessageSquare size={24} strokeWidth={1.4} />
                        <p className="text-xs">No conversations yet</p>
                    </div>
                ) : (
                    <ul className="space-y-0.5">
                        {sessions.map((session) => {
                            const isActive = session.id === activeSessionId;
                            return (
                                <li key={session.id}>
                                    <div
                                        className={`group flex items-center gap-2 rounded-xl px-2.5 py-2 transition ${
                                            isActive
                                                ? "bg-white/10"
                                                : "hover:bg-white/5"
                                        }`}
                                    >
                                        <button
                                            type="button"
                                            onClick={() => {
                                                void selectSession(session.id);
                                                onSelectSession?.();
                                            }}
                                            className="min-w-0 flex-1 text-left"
                                        >
                                            <p className="truncate text-sm text-zinc-200">
                                                {session.title || "Untitled chat"}
                                            </p>
                                            <p className="mt-0.5 text-[10px] text-zinc-600">
                                                {formatSessionTime(session.updatedAt)}
                                            </p>
                                        </button>

                                        <button
                                            type="button"
                                            aria-label="Delete conversation"
                                            onClick={() => void removeSession(session.id)}
                                            className="flex-shrink-0 rounded-lg p-1.5 text-zinc-600 opacity-0 transition hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100"
                                        >
                                            <Trash2 size={13} />
                                        </button>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
}
