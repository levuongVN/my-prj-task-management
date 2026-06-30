import { useState, useMemo } from "react";
import type { Project } from "../types/Project";

type SortBy = "name" | "due" | "progress" | "status";
type SortOrder = "asc" | "desc";

// 0=active, 1=completed, 2=archived
const STATUS_ORDER: Record<number, number> = {
    0: 1,
    1: 2,
    2: 3,
};

const DUE_ORDER: Record<string, number> = {
    Today: 0,
    Tomorrow: 1,
};

function parseDue(due: string): number {
    if (due in DUE_ORDER) return DUE_ORDER[due];
    const d = new Date(due);
    return isNaN(d.getTime()) ? Infinity : d.getTime();
}

export function useProjectFilters(projects: Project[]) {
    const [search, setSearch] = useState("");
    const [selectedStatuses, setSelectedStatuses] = useState<number[]>([]);
    const [sortBy, setSortBy] = useState<SortBy>("due");
    const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

    const filtered = useMemo(() => {
        return projects.filter((p) => {
            const matchesSearch =
                p.name.toLowerCase().includes(search.toLowerCase()) ||
                (p.description ?? "").toLowerCase().includes(search.toLowerCase());

            const matchesStatus =
                selectedStatuses.length === 0 || selectedStatuses.includes(p.status);

            return matchesSearch && matchesStatus;
        });
    }, [projects, search, selectedStatuses]);

    const sorted = useMemo(() => {
        return [...filtered].sort((a, b) => {
            // eslint-disable-next-line no-useless-assignment
            let result = 0;
            switch (sortBy) {
                case "name":
                    result = a.name.localeCompare(b.name);
                    break;
                case "progress":
                    result = a.progress - b.progress;
                    break;
                case "status":
                    result = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
                    break;
                case "due":
                default:
                    result = parseDue(a.due) - parseDue(b.due);
                    break;
            }

            return sortOrder === "asc" ? result : -result;
        });
    }, [filtered, sortBy, sortOrder]);

    const clearFilters = () => {
        setSelectedStatuses([]);
        setSearch("");
    };

    const toggleStatus = (status: number) => {
        setSelectedStatuses((prev) =>
            prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
        );
    };

    return {
        search,
        setSearch,
        selectedStatuses,
        setSelectedStatuses,
        toggleStatus,
        sortBy,
        setSortBy,
        sortOrder,
        setSortOrder,
        clearFilters,
        result: sorted,
        isEmpty: sorted.length === 0,
        byStatus: (s: number) => sorted.filter((p) => p.status === s),
    };
}