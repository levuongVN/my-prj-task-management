import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Check, Loader2, Sparkles, Wand2 } from "lucide-react";
import toast from "react-hot-toast";

import Button from "../../../shared/components/Ui/Button";
import Modal from "../../../shared/components/Ui/Modal";
import { useChatStore } from "../store/chatStore";
import { createSubtask } from "../../subtask/services/subtask.service";

interface TaskBreakdownPanelProps {
    taskId: string;
}

export function TaskBreakdownPanel({ taskId }: TaskBreakdownPanelProps) {
    const queryClient = useQueryClient();
    const breakdown = useChatStore((s) => s.breakdown);
    const breakdownLoading = useChatStore((s) => s.breakdownLoading);
    const requestBreakdown = useChatStore((s) => s.requestBreakdown);
    const clearBreakdown = useChatStore((s) => s.clearBreakdown);

    const [open, setOpen] = useState(false);
    const [excluded, setExcluded] = useState<Set<number>>(new Set());
    const [isSaving, setIsSaving] = useState(false);

    const items = breakdown?.taskId === taskId ? breakdown.items : [];

    const handleOpen = async () => {
        setOpen(true);
        setExcluded(new Set());
        try {
            await requestBreakdown(taskId);
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "Failed to suggest subtasks"
            );
            setOpen(false);
        }
    };

    const handleClose = () => {
        setOpen(false);
        clearBreakdown();
    };

    const toggle = (index: number) => {
        setExcluded((prev) => {
            const next = new Set(prev);
            if (next.has(index)) next.delete(index);
            else next.add(index);
            return next;
        });
    };

    const chosen = items.filter((_, index) => !excluded.has(index));

    const handleCreate = async () => {
        if (chosen.length === 0) return;

        setIsSaving(true);
        try {
            for (const item of chosen) {
                await createSubtask({ taskId, title: item.title });
            }
            queryClient.invalidateQueries({ queryKey: ["subtasks", taskId] });
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
            toast.success(`${chosen.length} subtask${chosen.length > 1 ? "s" : ""} added`);
            handleClose();
        } catch {
            toast.error("Failed to add subtasks");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <>
            <Button
                type="button"
                variant="secondary"
                onClick={() => void handleOpen()}
                className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium"
            >
                <Sparkles size={14} />
                AI breakdown
            </Button>

            <Modal
                isOpen={open}
                onClose={handleClose}
                title="Suggest subtasks"
                size="md"
            >
                <div className="space-y-4">
                    <div className="flex items-center gap-2 rounded-xl border border-white/8 bg-white/[0.02] px-3.5 py-2.5">
                        <Wand2 size={15} className="text-zinc-400" />
                        <p className="text-xs text-zinc-400">
                            AI suggestions are not saved until you confirm them.
                        </p>
                    </div>

                    {breakdownLoading ? (
                        <div className="flex justify-center py-10 text-zinc-500">
                            <Loader2 size={20} className="animate-spin" />
                        </div>
                    ) : items.length === 0 ? (
                        <div className="flex flex-col items-center gap-2 py-10 text-zinc-500">
                            <Sparkles size={24} strokeWidth={1.4} />
                            <p className="text-sm">No suggestions available</p>
                        </div>
                    ) : (
                        <div className="space-y-1.5">
                            {items.map((item, index) => {
                                const isSelected = !excluded.has(index);
                                return (
                                    <button
                                        key={`${item.title}-${index}`}
                                        type="button"
                                        onClick={() => toggle(index)}
                                        className={`flex w-full items-start gap-3 rounded-xl border px-3.5 py-3 text-left transition ${
                                            isSelected
                                                ? "border-emerald-500/30 bg-emerald-500/5"
                                                : "border-white/8 bg-transparent hover:bg-white/5"
                                        }`}
                                    >
                                        <span
                                            className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border transition ${
                                                isSelected
                                                    ? "border-emerald-500/60 bg-emerald-500/20 text-emerald-400"
                                                    : "border-white/25 text-transparent"
                                            }`}
                                        >
                                            <Check size={13} strokeWidth={3} />
                                        </span>
                                        <span className="min-w-0 flex-1">
                                            <span className="block text-sm font-medium text-zinc-100">
                                                {item.title}
                                            </span>
                                            {item.reason && (
                                                <span className="mt-0.5 block text-xs text-zinc-500">
                                                    {item.reason}
                                                </span>
                                            )}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    <div className="flex items-center justify-between border-t border-white/5 pt-4">
                        <span className="text-xs text-zinc-500">
                            {chosen.length} of {items.length} selected
                        </span>
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                onClick={handleClose}
                                disabled={isSaving}
                                className="rounded-xl"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                size="sm"
                                onClick={() => void handleCreate()}
                                isLoading={isSaving}
                                disabled={chosen.length === 0 || isSaving}
                                className="rounded-xl"
                            >
                                Add selected
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
}
