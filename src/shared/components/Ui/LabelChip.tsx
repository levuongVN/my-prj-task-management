import type { CSSProperties } from "react";

export interface LabelLike {
    id: string;
    name: string;
    /** hex từ BE, vd #ef4444 */
    color: string;
}

/**
 * Chip màu cho label. Dùng inline style hex từ data (đây là user content),
 * nền alpha 22 (~13%) để chip đọc được trên cả dark & light theme.
 */
export function LabelChip({ label }: { label: LabelLike }) {
    const style: CSSProperties = {
        backgroundColor: `${label.color}26`,
        color: label.color,
        borderColor: `${label.color}40`,
    };

    return (
        <span
            style={style}
            className="inline-flex max-w-[120px] items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium leading-4"
        >
            <span
                className="h-1.5 w-1.5 flex-shrink-0 rounded-full"
                style={{ backgroundColor: label.color }}
            />
            <span className="truncate">{label.name}</span>
        </span>
    );
}

interface LabelChipsProps {
    labels?: LabelLike[];
    max?: number;
}

/** Hàng chips, tối đa `max` + "+N" thay vì tràn */
export function LabelChips({ labels, max = 2 }: LabelChipsProps) {
    if (!labels || labels.length === 0) return null;

    const shown = labels.slice(0, max);
    const rest = labels.length - shown.length;

    return (
        <span className="inline-flex items-center gap-1">
            {shown.map((label) => (
                <LabelChip key={label.id} label={label} />
            ))}

            {rest > 0 && (
                <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] font-medium text-zinc-400">
                    +{rest}
                </span>
            )}
        </span>
    );
}
