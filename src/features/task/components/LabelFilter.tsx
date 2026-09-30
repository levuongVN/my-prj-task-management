import { useEffect, useRef, useState } from "react";
import { Check, Plus, Tag, Trash2, X } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useLabels } from "../../label/hooks/useLabels";
import { useCreateLabel } from "../../label/hooks/useCreateLabel";
import { useDeleteLabel } from "../../label/hooks/useDeleteLabel";

const PALETTE = [
    "#ef4444", "#f59e0b", "#eab308", "#22c55e",
    "#06b6d4", "#3b82f6", "#a855f7", "#ec4899",
];

interface LabelFilterProps {
    /** Active label id (single, server-side filter ?labelId=) — null = tất cả */
    selectedLabelId: string | null;
    onLabelChange: (labelId: string | null) => void;
}

function getErrorMessage(error: unknown, fallback: string) {
    if (axios.isAxiosError(error)) {
        return error.response?.data?.message ?? fallback;
    }
    return fallback;
}

/**
 * Dropdown lọc theo NHÃN (server-side ?labelId=) + quản lý label
 * (create với palette / delete — BE tự gỡ khỏi mọi task/project).
 */
export function LabelFilter({ selectedLabelId, onLabelChange }: LabelFilterProps) {
    const { data: labels = [], isLoading } = useLabels();
    const createLabelMutation = useCreateLabel();
    const deleteLabelMutation = useDeleteLabel();

    const [open, setOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [creating, setCreating] = useState(false);
    const [newValue, setNewValue] = useState("");
    const [newColor, setNewColor] = useState<string>(PALETTE[0]);

    useEffect(() => {
        if (!open) return;

        const handleClickOutside = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [open]);

    const activeLabel = labels.find((label) => label.id === selectedLabelId);

    const handleCreate = () => {
        const name = newValue.trim();
        if (!name) return;

        createLabelMutation.mutate(
            { name, color: newColor },
            {
                onSuccess: () => setNewValue(""),
                onError: (error) =>
                    toast.error(getErrorMessage(error, "Failed to create label")),
            }
        );
    };

    const handleDelete = async (labelId: string) => {
        deleteLabelMutation.mutate(labelId, {
            onSuccess: () => {
                if (selectedLabelId === labelId) onLabelChange(null);
            },
            onError: (error) =>
                toast.error(getErrorMessage(error, "Failed to delete label")),
        });
    };

    return (
        <div ref={wrapperRef} className="relative">
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className={`flex h-14 w-full items-center justify-center gap-1.5 rounded-xl border border-white/10 cursor-pointer px-3 text-sm font-medium transition ${
                    activeLabel
                        ? "bg-white/5 text-white"
                        : "text-white hover:bg-bg-hover"
                }`}
            >
                <Tag size={14} />

                {activeLabel ? activeLabel.name : "Label"}

                {activeLabel && (
                    <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: activeLabel.color }}
                    />
                )}
            </button>

            {open && (
                <div className="absolute left-0 top-full z-50 mt-2 w-[260px] rounded-2xl border border-white/10 bg-zinc-950 shadow-2xl">
                    {/* List */}
                    <div className="max-h-[220px] overflow-y-auto p-2">
                        {isLoading ? (
                            <p className="px-3 py-6 text-center text-xs text-zinc-500">Loading...</p>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    onClick={() => onLabelChange(null)}
                                    className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm transition ${selectedLabelId === null ? "bg-white/5 text-white" : "text-zinc-400 hover:bg-white/5 hover:text-white"}`}
                                >
                                    All labels
                                    {selectedLabelId === null && <Check size={13} className="ml-auto text-zinc-500" />}
                                </button>

                                {labels.map((label) => {
                                    const checked = selectedLabelId === label.id;

                                    return (
                                        <div key={label.id} className="group flex items-center gap-1">
                                            <button
                                                type="button"
                                                onClick={() => onLabelChange(checked ? null : label.id)}
                                                className={`flex flex-1 items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition ${checked ? "bg-white/5 text-white" : "text-zinc-400 hover:bg-white/5 hover:text-white"}`}
                                            >
                                                <span
                                                    className="h-2 w-2 rounded-full"
                                                    style={{ backgroundColor: label.color }}
                                                />
                                                <span className="truncate">{label.name}</span>
                                                {checked && (
                                                    <X size={12} className="ml-auto text-zinc-500" />
                                                )}
                                            </button>

                                            <button
                                                type="button"
                                                aria-label={`Delete label ${label.name}`}
                                                onClick={() => handleDelete(label.id)}
                                                className="rounded-lg p-1.5 text-zinc-600 opacity-0 transition hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100"
                                            >
                                                <Trash2 size={13} />
                                            </button>
                                        </div>
                                    );
                                })}
                            </>
                        )}
                    </div>

                    {/* Create new */}
                    <div className="border-t border-white/8 p-2">
                        {creating ? (
                            <div className="space-y-2">
                                <input
                                    value={newValue}
                                    autoFocus
                                    maxLength={50}
                                    placeholder="Label name..."
                                    onChange={(e) => setNewValue(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            handleCreate();
                                        }
                                        if (e.key === "Escape") setCreating(false);
                                    }}
                                    className="w-full rounded-xl border border-white/10 bg-black px-3 py-2 text-sm text-white outline-none transition focus:border-white/25"
                                />

                                <div className="flex items-center gap-1.5 px-1">
                                    {PALETTE.map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            aria-label={`Pick color ${color}`}
                                            onClick={() => setNewColor(color)}
                                            className={`h-5 w-5 rounded-full transition ${newColor === color ? "ring-2 ring-white ring-offset-2 ring-offset-zinc-950" : ""}`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>

                                <div className="flex items-center justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setCreating(false)}
                                        className="rounded-lg px-2 py-1 text-xs text-zinc-400 transition hover:text-zinc-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        disabled={!newValue.trim() || createLabelMutation.isPending}
                                        onClick={handleCreate}
                                        className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-black transition hover:opacity-90 disabled:opacity-50"
                                    >
                                        Create
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => {
                                    setCreating(true);
                                    setNewValue("");
                                    setNewColor(PALETTE[0]);
                                }}
                                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-zinc-400 transition hover:bg-white/5 hover:text-white"
                            >
                                <Plus size={13} />
                                New label
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
