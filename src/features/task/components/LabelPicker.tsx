import { useEffect, useRef, useState } from "react";
import { Plus, Tag, Trash2 } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useLabels } from "../../label/hooks/useLabels";
import { useCreateLabel } from "../../label/hooks/useCreateLabel";
import { useDeleteLabel } from "../../label/hooks/useDeleteLabel";
import type { LabelResponse } from "../../label/types/label.type";

/** Palette FE cố định — BE chỉ validate định dạng hex */
const PALETTE = [
    "#ef4444", "#f59e0b", "#eab308", "#22c55e",
    "#06b6d4", "#3b82f6", "#a855f7", "#ec4899",
];

const MAX_NAME_LENGTH = 50;

interface LabelPickerProps {
    /** Selected label ids (null = chưa đổi nếu BE sweet semantics) */
    value?: string[] | null;
    onChange: (ids: string[]) => void;
}

function getErrorMessage(error: unknown, fallback: string) {
    if (axios.isAxiosError(error)) {
        return error.response?.data?.message ?? fallback;
    }
    return fallback;
}

/**
 * Gán nhãn cho task/project trong form: chips chọn/bỏ chọn,
 * + quản lý CRUD label ngay trong popover (name + color palette).
 * Đặt trong form đặt trong Popover body; BE đọc labelIds: null / [] / [ids].
 */
export function LabelPicker({ value, onChange }: LabelPickerProps) {
    const { data: labels = [], isLoading } = useLabels();
    const createLabelMutation = useCreateLabel();
    const deleteLabelMutation = useDeleteLabel();

    const [open, setOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [newValue, setNewValue] = useState("");
    const [newColor, setNewColor] = useState<string>(PALETTE[0]);
    const [creating, setCreating] = useState(false);

    const selected = value ?? [];

    // đóng khi click ngoài / Esc
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

    const toggle = (label: LabelResponse) => {
        const exists = selected.includes(label.id);
        // [ids] = replace-all semantics → FE duy trì tập đầy đủ
        onChange(
            exists
                ? selected.filter((id) => id !== label.id)
                : [...selected, label.id]
        );
    };

    const handleCreate = () => {
        const name = newValue.trim();
        if (!name) return;

        createLabelMutation.mutate(
            { name, color: newColor },
            {
                onSuccess: (created) => {
                    setNewValue("");
                    setCreating(false);
                    // Tự chọn label vừa tạo (hồn đãi user thao tác gán)
                    onChange([...selected, created.id]);
                },
                onError: (error) =>
                    toast.error(getErrorMessage(error, "Failed to create label")),
            }
        );
    };

    const handleDelete = (label: LabelResponse) => {
        deleteLabelMutation.mutate(label.id, {
            onSuccess: () => {
                // loại khỏi selection nếu đang chọn
                onChange(selected.filter((id) => id !== label.id));
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
                className={`
                    flex w-full min-h-[48px] items-center gap-2 rounded-2xl border px-3 py-2 text-sm transition
                    ${open ? "border-white/25" : "border-white/10 hover:border-white/20"}
                `}
            >
                <Tag size={14} className="text-zinc-500" />

                <span className={`flex-1 text-left truncate ${selected.length > 0 ? "text-zinc-200" : "text-zinc-500"}`}>
                    {selected.length === 0 && "Add labels..."}
                </span>

                {/* Selected chips */}
                {selected.length > 0 && (
                    <span className="flex flex-wrap items-center gap-1">
                        {labels
                            .filter((label) => selected.includes(label.id))
                            .map((label) => (
                                <span
                                    key={label.id}
                                    className="rounded-full px-2 py-0.5 text-[11px] font-medium"
                                    style={{ backgroundColor: `${label.color}26`, color: label.color }}
                                >
                                    {label.name}
                                </span>
                            ))}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute left-0 top-full z-50 mt-2 w-[280px] rounded-2xl border border-white/10 bg-zinc-950 shadow-2xl">
                    <div className="max-h-[220px] overflow-y-auto p-2">
                        {isLoading ? (
                            <p className="px-3 py-6 text-center text-xs text-zinc-500">Loading...</p>
                        ) : labels.length === 0 ? (
                            <p className="px-3 py-4 text-center text-xs text-zinc-500">No labels yet</p>
                        ) : (
                            labels.map((label) => {
                                const checked = selected.includes(label.id);

                                return (
                                    <div
                                        key={label.id}
                                        className="group flex items-center gap-2 rounded-xl px-2 py-1.5"
                                    >
                                        <button
                                            type="button"
                                            onClick={() => toggle(label)}
                                            className={`flex flex-1 items-center gap-2 rounded-lg text-left text-sm transition ${checked ? "text-white" : "text-zinc-300 hover:text-white"}`}
                                        >
                                            <span
                                                className="h-3.5 w-3.5 flex-shrink-0 rounded-full ring-2 ring-transparent transition"
                                                style={{
                                                    backgroundColor: checked ? label.color : "transparent",
                                                    boxShadow: `inset 0 0 0 2px ${label.color}`,
                                                }}
                                            />
                                            <span className="truncate">{label.name}</span>
                                        </button>

                                        <button
                                            type="button"
                                            aria-label={`Delete label ${label.name}`}
                                            onClick={() => handleDelete(label)}
                                            className="rounded-lg p-1 text-zinc-600 opacity-0 transition hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100"
                                        >
                                            <Trash2 size={13} />
                                        </button>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Create new */}
                    <div className="border-t border-white/8 p-2">
                        {creating ? (
                            <div className="space-y-2">
                                <input
                                    value={newValue}
                                    autoFocus
                                    maxLength={MAX_NAME_LENGTH}
                                    placeholder="Label name..."
                                    onChange={(e) => setNewValue(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            handleCreate();
                                        }
                                        if (e.key === "Escape") setCreating(false);
                                    }}
                                    className="w-full rounded-xl border border-white/10 bg-black px-3 py-2 text-sm text-white outline-none transition focus:border-white/30"
                                />

                                {/* Palette chọn màu */}
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
