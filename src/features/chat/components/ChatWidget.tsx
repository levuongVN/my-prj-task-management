import { useState } from "react";
import { useLocation } from "react-router-dom";
import { ArrowLeft, MessageSquare, MessageSquarePlus, Plus, X } from "lucide-react";
import { useChatStore } from "../store/chatStore";
import { ChatView } from "./ChatView";
import { ChatSessionList } from "./ChatSessionList";

export function ChatWidget() {
    const location = useLocation();
    const [open, setOpen] = useState(false);
    const [showList, setShowList] = useState(false);

    const startNewChat = useChatStore((s) => s.startNewChat);
    const loadSessions = useChatStore((s) => s.loadSessions);

    // Trang /chat đã có giao diện đầy đủ → không cần bong bóng nổi
    if (location.pathname === "/chat") return null;

    const handleToggle = () => {
        if (!open) {
            void loadSessions(true);
        }
        setOpen((prev) => !prev);
    };

    return (
        <>
            {open && (
                <div className="fixed bottom-24 right-4 left-4 z-40 flex h-[min(560px,calc(100vh-8rem))] flex-col overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 shadow-2xl shadow-black/60 sm:left-auto sm:right-6 sm:w-[390px]">
                    {/* Header */}
                    <div className="flex items-center gap-2 border-b border-white/8 px-3 py-2.5">
                        {showList ? (
                            <>
                                <button
                                    type="button"
                                    onClick={() => setShowList(false)}
                                    aria-label="Back to chat"
                                    className="rounded-lg p-1.5 text-zinc-400 transition hover:bg-white/5 hover:text-white"
                                >
                                    <ArrowLeft size={16} />
                                </button>
                                <span className="flex-1 text-sm font-semibold text-white">
                                    Conversations
                                </span>
                            </>
                        ) : (
                            <>
                                <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-accent text-accent-fg">
                                    <MessageSquare size={14} />
                                </span>
                                <span className="flex-1 text-sm font-semibold text-white">
                                    AI Assistant
                                </span>
                                <button
                                    type="button"
                                    onClick={() => {
                                        startNewChat();
                                        setShowList(false);
                                    }}
                                    aria-label="New chat"
                                    className="rounded-lg p-1.5 text-zinc-400 transition hover:bg-white/5 hover:text-white"
                                >
                                    <Plus size={16} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowList(true)}
                                    aria-label="Show conversations"
                                    className="rounded-lg p-1.5 text-zinc-400 transition hover:bg-white/5 hover:text-white"
                                >
                                    <MessageSquarePlus size={16} />
                                </button>
                            </>
                        )}

                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            aria-label="Close chat"
                            className="rounded-lg p-1.5 text-zinc-400 transition hover:bg-white/5 hover:text-white"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="min-h-0 flex-1">
                        {showList ? (
                            <ChatSessionList onSelectSession={() => setShowList(false)} />
                        ) : (
                            <ChatView variant="widget" />
                        )}
                    </div>
                </div>
            )}

            <button
                type="button"
                onClick={handleToggle}
                aria-label={open ? "Close AI assistant" : "Open AI assistant"}
                className="fixed bottom-6 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-accent-fg shadow-xl shadow-black/40 transition hover:opacity-90 sm:right-6"
            >
                {open ? <X size={20} /> : <MessageSquare size={20} />}
            </button>
        </>
    );
}
