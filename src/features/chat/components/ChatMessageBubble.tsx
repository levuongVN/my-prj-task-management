import { AlertTriangle, Bot, RotateCcw } from "lucide-react";
import type { ChatMessage } from "../types";
import { formatMessageTime } from "../utils/chatTime";
import { MarkdownText } from "./MarkdownText";

interface ChatMessageBubbleProps {
    message: ChatMessage;
    onRetry?: () => void;
}

export function ChatMessageBubble({ message, onRetry }: ChatMessageBubbleProps) {
    const isUser = message.role === "user";
    const isTyping = message.pending && !message.content;

    if (isUser) {
        return (
            <div className="flex justify-end">
                <div className="max-w-[85%] rounded-2xl rounded-br-md bg-accent px-4 py-2.5 text-sm leading-relaxed text-accent-fg whitespace-pre-wrap break-words">
                    {message.content}
                </div>
            </div>
        );
    }

    return (
        <div className="flex gap-2.5">
            <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-300">
                <Bot size={15} />
            </div>

            <div className="min-w-0 max-w-[85%] space-y-1.5">
                <div className="rounded-2xl rounded-tl-md border border-white/8 bg-zinc-900 px-4 py-2.5 text-sm leading-relaxed text-zinc-100 break-words">
                    {isTyping ? (
                        <span className="flex items-center gap-1 py-1">
                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-500 [animation-delay:-0.3s]" />
                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-500 [animation-delay:-0.15s]" />
                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-500" />
                        </span>
                    ) : (
                        <MarkdownText content={message.content} />
                    )}
                </div>

                {message.error && (
                    <div className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-2 text-xs text-red-300">
                        <AlertTriangle size={13} className="mt-0.5 flex-shrink-0" />
                        <span className="flex-1">{message.error}</span>
                        {onRetry && (
                            <button
                                type="button"
                                onClick={onRetry}
                                className="flex flex-shrink-0 items-center gap-1 rounded-lg px-1.5 py-0.5 font-medium transition hover:bg-red-500/10"
                            >
                                <RotateCcw size={11} />
                                Retry
                            </button>
                        )}
                    </div>
                )}

                {!message.pending && (
                    <p className="pl-1 text-[10px] text-zinc-600">
                        {formatMessageTime(message.createdAt)}
                    </p>
                )}
            </div>
        </div>
    );
}
