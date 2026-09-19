import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
    Check,
    GripVertical,
    ListChecks,
    Pencil,
    Plus,
    Trash2,
} from "lucide-react";
import Button from "../../../shared/components/Ui/Button";
import Loading from "../../../shared/components/Ui/Loading";
import { useSubtasks } from "../../subtask/hooks/useSubtasks";
import { useCreateSubtask } from "../../subtask/hooks/useCreateSubtask";
import { useUpdateSubtask } from "../../subtask/hooks/useUpdateSubtask";
import { useToggleSubtask } from "../../subtask/hooks/useToggleSubtask";
import { useReorderSubtasks } from "../../subtask/hooks/useReorderSubtasks";
import { useDeleteSubtask } from "../../subtask/hooks/useDeleteSubtask";
import type { SubtaskResponse } from "../../subtask/types/subtask.type";

const MAX_TITLE_LENGTH = 255;

interface SubtaskSectionProps {
    taskId: string;
}

function getErrorMessage(error: unknown, fallback: string) {
    if (axios.isAxiosError(error)) {
        return error.response?.data?.message ?? fallback;
    }
    return fallback;
}

export default function SubtaskSection({ taskId }: SubtaskSectionProps) {
    const { data: subtasks = [], isLoading } = useSubtasks(taskId);
    const createSubtaskMutation = useCreateSubtask(taskId);
    const updateSubtaskMutation = useUpdateSubtask(taskId);
    const toggleSubtaskMutation = useToggleSubtask(taskId);
    const reorderSubtaskMutation = useReorderSubtasks(taskId);
    const deleteSubtaskMutation = useDeleteSubtask(taskId);

    const [draft, setDraft] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingDraft, setEditingDraft] = useState("");

    // Drag & drop state (chỉ giữa các item cùng task)
    const [draggingId, setDraggingId] = useState<string | null>(null);

    const completedCount = subtasks.filter((s) => s.isCompleted).length;
    const progress = subtasks.length > 0
        ? Math.round((completedCount / subtasks.length) * 100)
        : 0;
    const isMutating =
        createSubtaskMutation.isPending ||
        updateSubtaskMutation.isPending ||
        toggleSubtaskMutation.isPending ||
        reorderSubtaskMutation.isPending ||
        deleteSubtaskMutation.isPending;

    const handleAdd = () => {
        const title = draft.trim();
        if (!title) return;

        createSubtaskMutation.mutate(
            { taskId, title },
            {
                onSuccess: () => setDraft(""),
                onError: (error) =>
                    toast.error(getErrorMessage(error, "Failed to add subtask")),
            }
        );
    };

    const handleSaveTitle = (subtask: SubtaskResponse) => {
        const title = editingDraft.trim();
        if (!title || title === subtask.title) {
            setEditingId(null);
            return;
        }

        updateSubtaskMutation.mutate(
            { id: subtask.id, subtaskPayload: { title } },
            {
                onSuccess: () => {
                    setEditingId(null);
                    setEditingDraft("");
                },
                onError: (error) =>
                    toast.error(getErrorMessage(error, "Failed to update subtask")),
            }
        );
    };

    // FE gửi full list id theo thứ tự mới; BE tự cập nhật position
    const commitReorder = (fromIndex: number, toIndex: number) => {
        setDraggingId(null);
        if (fromIndex < 0 || fromIndex === toIndex) return;
        if (toIndex < 0 || toIndex >= subtasks.length) return;

        const reordered = [...subtasks];
        const [moved] = reordered.splice(fromIndex, 1);
        reordered.splice(toIndex, 0, moved);

        reorderSubtaskMutation.mutate(
            reordered.map((subtask) => subtask.id),
            {
                onError: (error) =>
                    toast.error(getErrorMessage(error, "Failed to reorder subtasks")),
            }
        );
    };

    const canAdd = draft.trim().length > 0;

    return (
        <section className="border-t border-white/8 p-6">
            {/* Header + progress */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <ListChecks size={15} className="text-zinc-500" />
                    <h3 className="text-sm font-semibold text-white">
                        Checklist
                        {subtasks.length > 0 && (
                            <span className="ml-1.5 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-zinc-300">
                                {completedCount}/{subtasks.length}
                            </span>
                        )}
                    </h3>
                </div>

                <span className="text-xs font-semibold tabular-nums text-zinc-400">
                    {progress}%
                </span>
            </div>

            {/* Progress bar — transition-all cho smooth khi tick */}
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* List */}
            <div className="mt-4 space-y-0.5">
                {isLoading ? (
                    <Loading size={24} text="" />
                ) : subtasks.length === 0 ? (
                    <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-white/10 py-8 text-zinc-600">
                        <ListChecks size={26} strokeWidth={1.5} />
                        <span className="text-sm">No checklist items yet</span>
                    </div>
                ) : (
                    subtasks.map((subtask, index) => {
                        const isEditing = editingId === subtask.id;

                        /* Animate: fade + trượt ngang nhẹ vào lúc render (tw-animate-css) */
                        return (
                            <div
                                key={subtask.id}
                                draggable={!isEditing && !isMutating}
                                onDragStart={() => setDraggingId(subtask.id)}
                                onDragOver={(e) => e.preventDefault()}
                                onDragEnd={() => commitReorder(
                                    subtasks.findIndex((s) => s.id === draggingId),
                                    index
                                )}
                                onDrop={() => commitReorder(
                                    subtasks.findIndex((s) => s.id === draggingId),
                                    index
                                )}
                                className={`animate-in fade-in slide-in-from-left-1 group flex items-center gap-2.5 rounded-xl px-2 py-1.5 duration-200 ${
                                    draggingId === subtask.id
                                        ? "bg-blue-500/10 opacity-60"
                                        : "hover:bg-white/5"
                                }`}
                            >
                                {/* Drag handle */}
                                <GripVertical
                                    size={14}
                                    className="flex-shrink-0 cursor-grab text-zinc-700 opacity-0 transition group-hover:opacity-100 active:cursor-grabbing"
                                />

                                {/* Checkbox — optimistic toggle + zoom animation */}
                                <button
                                    type="button"
                                    disabled={isMutating}
                                    onClick={() => toggleSubtaskMutation.mutate(subtask.id, {
                                        onError: (error) =>
                                            toast.error(getErrorMessage(error, "Failed to update subtask")),
                                    })}
                                    className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border transition-all duration-200 active:scale-90 disabled:opacity-50 ${
                                        subtask.isCompleted
                                            ? "border-emerald-500/60 bg-emerald-500/20 text-emerald-400"
                                            : "border-white/25 hover:border-white/50 hover:bg-white/5"
                                    }`}
                                    aria-label={subtask.isCompleted ? "Mark as not done" : "Mark as done"}
                                >
                                    {subtask.isCompleted && (
                                        /* Zoom-in check icon khi tick (tw-animate-css) */
                                        <Check
                                            size={13}
                                            strokeWidth={3}
                                            className="animate-in zoom-in duration-200"
                                        />
                                    )}
                                </button>

                                {/* Title / inline edit */}
                                {isEditing ? (
                                    <input
                                        value={editingDraft}
                                        maxLength={MAX_TITLE_LENGTH}
                                        autoFocus
                                        onChange={(e) => setEditingDraft(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") handleSaveTitle(subtask);
                                            if (e.key === "Escape") setEditingId(null);
                                        }}
                                        className="min-w-0 flex-1 rounded-lg border border-white/15 bg-black px-2.5 py-1.5 text-sm text-white outline-none transition focus:border-white/35"
                                    />
                                ) : (
                                    <span
                                        className={`min-w-0 flex-1 truncate text-sm transition-colors ${
                                            subtask.isCompleted
                                                ? "text-zinc-600 line-through decoration-zinc-600"
                                                : "text-zinc-200"
                                        }`}
                                    >
                                        {subtask.title}
                                    </span>
                                )}

                                {/* Actions — hiện mượt trên hover của row */}
                                {isEditing ? (
                                    <div className="animate-in fade-in flex flex-shrink-0 items-center gap-1 duration-150">
                                        <button
                                            type="button"
                                            disabled={!editingDraft.trim() || isMutating}
                                            onClick={() => handleSaveTitle(subtask)}
                                            className="rounded-lg px-2 py-1 text-xs font-semibold text-emerald-400 transition hover:bg-emerald-500/10 disabled:opacity-50"
                                        >
                                            Save
                                        </button>
                                        <button
                                            type="button"
                                            disabled={isMutating}
                                            onClick={() => {
                                                setEditingId(null);
                                                setEditingDraft("");
                                            }}
                                            className="rounded-lg px-2 py-1 text-xs text-zinc-400 transition hover:text-zinc-200 disabled:opacity-50"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-shrink-0 items-center gap-0.5 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                                        <button
                                            type="button"
                                            aria-label="Edit subtask"
                                            onClick={() => {
                                                setEditingId(subtask.id);
                                                setEditingDraft(subtask.title);
                                            }}
                                            className="rounded-lg p-1.5 text-zinc-500 transition hover:bg-white/10 hover:text-zinc-300"
                                        >
                                            <Pencil size={13} />
                                        </button>
                                        <button
                                            type="button"
                                            aria-label="Delete subtask"
                                            disabled={isMutating}
                                            onClick={() =>
                                                deleteSubtaskMutation.mutate(subtask.id, {
                                                    onSuccess: () => toast.success("Subtask deleted"),
                                                    onError: (error) =>
                                                        toast.error(getErrorMessage(error, "Failed to delete subtask")),
                                                })
                                            }
                                            className="rounded-lg p-1.5 text-zinc-500 transition hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
                                        >
                                            <Trash2 size={13} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {/* Composer — pill: input + Add gộp trong 1 khối, focus mờ nét */}
            <div className="mt-3 flex items-center gap-2 rounded-2xl border border-white/10 bg-black p-1.5 pl-4 transition focus-within:border-white/25">
                <input
                    value={draft}
                    maxLength={MAX_TITLE_LENGTH}
                    placeholder="Add a checklist item..."
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && canAdd) handleAdd();
                    }}
                    className="h-7 min-w-0 flex-1 bg-transparent text-sm text-white outline-none"
                />

                <Button
                    type="button"
                    size="sm"
                    isLoading={createSubtaskMutation.isPending}
                    disabled={!canAdd || isMutating}
                    onClick={handleAdd}
                    className="rounded-xl px-3 py-2 text-xs"
                >
                    <Plus size={14} />
                    Add
                </Button>
            </div>
        </section>
    );
}
