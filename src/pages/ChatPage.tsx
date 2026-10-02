import { useEffect, useRef, useState } from "react";
import { History, X } from "lucide-react";
import { useChatStore } from "../features/chat/store/chatStore";
import { ChatView } from "../features/chat/components/ChatView";
import { ChatSessionList } from "../features/chat/components/ChatSessionList";

const MIN_SURFACE_HEIGHT = 320;

export default function ChatPage() {
    const [historyOpen, setHistoryOpen] = useState(false);
    const [surfaceHeight, setSurfaceHeight] = useState<number | null>(null);
    const surfaceRef = useRef<HTMLDivElement>(null);
    const sessions = useChatStore((s) => s.sessions);
    const activeSessionId = useChatStore((s) => s.activeSessionId);
    const loadSessions = useChatStore((s) => s.loadSessions);

    useEffect(() => {
        void loadSessions();
    }, [loadSessions]);

    // Khung chat phải vừa đúng phần viewport còn lại để input luôn hiển thị,
    // đo theo offset thực tế thay vì hardcode (Topbar + padding + header + banner).
    useEffect(() => {
        const el = surfaceRef.current;
        if (!el) return;

        let frame = 0;
        const measure = () => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => {
                const parent = el.parentElement;
                const paddingBottom = parent
                    ? parseFloat(getComputedStyle(parent).paddingBottom) || 0
                    : 0;
                const top = el.getBoundingClientRect().top;
                const next = Math.max(
                    window.innerHeight - top - paddingBottom,
                    MIN_SURFACE_HEIGHT
                );
                setSurfaceHeight((prev) =>
                    prev !== null && Math.abs(prev - next) < 1 ? prev : next
                );
            });
        };

        measure();
        window.addEventListener("resize", measure);
        const observer = new ResizeObserver(measure);
        observer.observe(document.body);

        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("resize", measure);
            observer.disconnect();
        };
    }, []);

    const activeTitle = sessions.find((s) => s.id === activeSessionId)?.title;

    return (
        <div>
            {/* Header */}
            <div className="mb-6 flex items-end justify-between gap-4">
                <div>
                    <p className="mb-1.5 text-[11px] font-medium uppercase tracking-widest text-zinc-600">
                        Assistant
                    </p>
                    <h1 className="text-[22px] font-medium text-white">AI Assistant</h1>
                    <p className="mt-1 text-sm text-zinc-600">
                        {activeTitle ?? "Ask about your tasks or draft one in natural language."}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setHistoryOpen(true)}
                    className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:bg-white/5 hover:text-white lg:hidden"
                >
                    <History size={16} />
                    History
                </button>
            </div>

            {/* Chat surface */}
            <div
                ref={surfaceRef}
                className="overflow-hidden rounded-[32px] border border-white/5 bg-zinc-950"
                style={{
                    height: surfaceHeight ?? `calc(100vh - 220px)`,
                    minHeight: MIN_SURFACE_HEIGHT,
                }}
            >
                <div className="grid h-full min-h-0 lg:grid-cols-[280px_1fr]">
                    {/* Sessions — desktop */}
                    <aside className="hidden min-h-0 border-r border-white/5 lg:block">
                        <ChatSessionList />
                    </aside>

                    {/* Thread */}
                    <div className="h-full min-h-0 min-w-0">
                        <ChatView variant="page" />
                    </div>
                </div>
            </div>

            {/* Sessions — mobile drawer */}
            {historyOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div
                        onClick={() => setHistoryOpen(false)}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />
                    <div className="absolute inset-y-0 left-0 flex w-[300px] max-w-[85vw] flex-col border-r border-white/10 bg-[#090909]">
                        <div className="flex items-center justify-between border-b border-white/8 px-4 py-3">
                            <span className="text-sm font-semibold text-white">
                                Conversations
                            </span>
                            <button
                                type="button"
                                onClick={() => setHistoryOpen(false)}
                                aria-label="Close conversations"
                                className="rounded-lg p-1.5 text-zinc-400 transition hover:bg-white/5 hover:text-white"
                            >
                                <X size={16} />
                            </button>
                        </div>
                        <div className="min-h-0 flex-1">
                            <ChatSessionList onSelectSession={() => setHistoryOpen(false)} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
