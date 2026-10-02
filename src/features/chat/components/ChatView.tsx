import { useEffect, useRef } from "react";
import { AlertTriangle, Bot, Sparkles } from "lucide-react";
import { useChatStore } from "../store/chatStore";
import { ChatMessageBubble } from "./ChatMessageBubble";
import { ChatComposer } from "./ChatComposer";
import { TaskDraftCard } from "./TaskDraftCard";

interface ChatViewProps {
    variant?: "page" | "widget";
}

const SUGGESTIONS = [
    "Which tasks are due soon?",
    "Summarize my workload this week",
    "Create a task: prepare the client demo slides by Friday",
];

export function ChatView({ variant = "page" }: ChatViewProps) {
    const messages = useChatStore((s) => s.messages);
    const messagesLoading = useChatStore((s) => s.messagesLoading);
    const isStreaming = useChatStore((s) => s.isStreaming);
    const streamError = useChatStore((s) => s.streamError);
    const draft = useChatStore((s) => s.draft);
    const draftId = useChatStore((s) => s.draftId);
    const draftLoading = useChatStore((s) => s.draftLoading);
    const sendMessage = useChatStore((s) => s.sendMessage);
    const retryMessage = useChatStore((s) => s.retryMessage);
    const stopStreaming = useChatStore((s) => s.stopStreaming);
    const createTaskDraft = useChatStore((s) => s.createTaskDraft);
    const clearDraft = useChatStore((s) => s.clearDraft);

    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ block: "end" });
    }, [messages, isStreaming, draft]);

    const showEmptyState = messages.length === 0 && !messagesLoading && !draft;

    return (
        <div className="flex h-full min-h-0 flex-col">
            <div
                className={`flex-1 overflow-y-auto px-4 scrollbar-thin scrollbar-thumb-white/10 ${
                    variant === "widget" ? "py-4" : "py-6"
                }`}
            >
                {messagesLoading ? (
                    <div className="flex h-full items-center justify-center">
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                    </div>
                ) : showEmptyState ? (
                    <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                        <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-zinc-300">
                            <Bot size={22} />
                        </span>
                        <div>
                            <p className="text-sm font-medium text-white">
                                How can I help?
                            </p>
                            <p className="mt-1 text-xs text-zinc-500">
                                Ask about your tasks or draft one in natural language.
                            </p>
                        </div>
                        <div className="flex w-full max-w-sm flex-col gap-2">
                            {SUGGESTIONS.map((suggestion) => (
                                <button
                                    key={suggestion}
                                    type="button"
                                    onClick={() => void sendMessage(suggestion)}
                                    className="flex items-center gap-2 rounded-xl border border-white/8 bg-white/[0.02] px-3 py-2.5 text-left text-xs text-zinc-300 transition hover:bg-white/5"
                                >
                                    <Sparkles size={13} className="flex-shrink-0 text-zinc-500" />
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {messages.map((message, index) => {
                            const isLast = index === messages.length - 1;
                            const canRetry =
                                message.role === "assistant" &&
                                !!message.error &&
                                isLast;

                            return (
                                <ChatMessageBubble
                                    key={message.id}
                                    message={message}
                                    onRetry={
                                        canRetry
                                            ? () => void retryMessage()
                                            : undefined
                                    }
                                />
                            );
                        })}

                        {draft && (
                            <TaskDraftCard
                                key={draftId}
                                draft={draft}
                                onDismiss={clearDraft}
                            />
                        )}

                        <div ref={bottomRef} />
                    </div>
                )}
            </div>

            {streamError && (
                <div className="mx-4 mb-2 flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-2 text-xs text-red-300">
                    <AlertTriangle size={13} className="mt-0.5 flex-shrink-0" />
                    <span>{streamError}</span>
                </div>
            )}

            <div className="border-t border-white/5 p-3">
                <ChatComposer
                    onSend={(text) => void sendMessage(text)}
                    onDraft={(text) => void createTaskDraft(text)}
                    onStop={stopStreaming}
                    isStreaming={isStreaming}
                    isDrafting={draftLoading}
                />
            </div>
        </div>
    );
}
