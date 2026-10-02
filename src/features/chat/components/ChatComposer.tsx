import { useRef, useState } from "react";
import { ArrowUp, Square, Wand2 } from "lucide-react";

interface ChatComposerProps {
    onSend: (text: string) => void;
    onDraft: (text: string) => void;
    onStop: () => void;
    isStreaming: boolean;
    isDrafting: boolean;
    placeholder?: string;
}

const MAX_HEIGHT = 160;

export function ChatComposer({
    onSend,
    onDraft,
    onStop,
    isStreaming,
    isDrafting,
    placeholder = "Ask anything about your tasks...",
}: ChatComposerProps) {
    const [value, setValue] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const canSend = value.trim().length > 0 && !isStreaming && !isDrafting;

    const resize = () => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = "auto";
        el.style.height = `${Math.min(el.scrollHeight, MAX_HEIGHT)}px`;
    };

    const reset = () => {
        setValue("");
        const el = textareaRef.current;
        if (el) el.style.height = "auto";
    };

    const handleSend = () => {
        if (!canSend) return;
        onSend(value);
        reset();
    };

    const handleDraft = () => {
        if (!value.trim() || isDrafting || isStreaming) return;
        onDraft(value);
        reset();
    };

    return (
        <div className="rounded-2xl border border-white/10 bg-zinc-950 p-2 transition focus-within:border-white/25">
            <textarea
                ref={textareaRef}
                value={value}
                rows={1}
                placeholder={placeholder}
                onChange={(e) => {
                    setValue(e.target.value);
                    resize();
                }}
                onKeyDown={(e) => {
                    if (
                        e.key === "Enter" &&
                        !e.shiftKey &&
                        !e.nativeEvent.isComposing
                    ) {
                        e.preventDefault();
                        handleSend();
                    }
                }}
                className="max-h-40 w-full resize-none bg-transparent px-2.5 py-2 text-sm text-white outline-none placeholder:text-zinc-600 scrollbar-thin"
            />

            <div className="flex items-center justify-between gap-2 px-1">
                <button
                    type="button"
                    onClick={handleDraft}
                    disabled={!value.trim() || isStreaming || isDrafting}
                    className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[11px] font-medium text-zinc-400 transition hover:bg-white/5 hover:text-zinc-200 disabled:cursor-not-allowed disabled:opacity-40"
                    title="Turn this text into a task draft"
                >
                    <Wand2 size={13} />
                    {isDrafting ? "Drafting..." : "Draft task"}
                </button>

                {isStreaming ? (
                    <button
                        type="button"
                        onClick={onStop}
                        className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-zinc-300 transition hover:bg-white/10"
                        title="Stop generating"
                    >
                        <Square size={13} />
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={handleSend}
                        disabled={!canSend}
                        className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent text-accent-fg transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                        title="Send"
                    >
                        <ArrowUp size={16} />
                    </button>
                )}
            </div>
        </div>
    );
}
