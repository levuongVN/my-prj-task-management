import { ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";

interface PaginationProps {
    page: number;
    totalPages: number;
    totalCount: number;
    shownCount: number;
    onPageChange: (page: number) => void;
    /** Cụm từ hiển thị, vd "tasks" / "projects" */
    label?: string;
}

/** Compact pagination: Prev · 1..N (window quanh page hiện tại) · Next */
export default function Pagination({
    page,
    totalPages,
    totalCount,
    shownCount,
    onPageChange,
    label = "items",
}: PaginationProps) {
    // Rỗng → ẩn pagination
    if (totalCount === 0 || totalPages === 0) return null;

    const hasPrev = page > 1;
    const hasNext = page < totalPages;

    // Window các số trang quanh page hiện tại + trang đầu/cuối
    const pages: number[] = [];
    const windowRadius = 1;
    for (let p = Math.max(1, page - windowRadius); p <= Math.min(totalPages, page + windowRadius); p++) {
        pages.push(p);
    }
    if (pages[0] > 1) pages.unshift(1, ...(pages[0] > 2 ? [-1] : []));
    if (pages[pages.length - 1] < totalPages) {
        if (pages[pages.length - 1] < totalPages - 1) pages.push(-1);
        pages.push(totalPages);
    }

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-white/5">
            <span className="text-sm text-zinc-500">
                {shownCount} of {totalCount} {label}
            </span>

            <div className="flex items-center gap-1">
                <button
                    type="button"
                    aria-label="Previous page"
                    disabled={!hasPrev}
                    onClick={() => hasPrev && onPageChange(page - 1)}
                    className={clsx(
                        "flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 transition",
                        hasPrev
                            ? "hover:bg-white/10 hover:text-white"
                            : "opacity-40 cursor-not-allowed"
                    )}
                >
                    <ChevronLeft size={16} />
                </button>

                {pages.map((p, i) =>
                    p === -1 ? (
                        <span
                            key={`ellipsis-${i}`}
                            className="px-1 text-sm text-zinc-500 select-none"
                        >
                            …
                        </span>
                    ) : (
                        <button
                            key={p}
                            type="button"
                            onClick={() => p !== page && onPageChange(p)}
                            className={clsx(
                                "h-9 min-w-9 rounded-xl border px-2 text-sm font-medium transition",
                                p === page
                                    ? "bg-accent text-accent-fg border-transparent"
                                    : "border-white/10 hover:bg-white/10 hover:text-white"
                            )}
                        >
                            {p}
                        </button>
                    )
                )}

                <button
                    type="button"
                    aria-label="Next page"
                    disabled={!hasNext}
                    onClick={() => hasNext && onPageChange(page + 1)}
                    className={clsx(
                        "flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 transition",
                        hasNext
                            ? "hover:bg-white/10 hover:text-white"
                            : "opacity-40 cursor-not-allowed"
                    )}
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
}
