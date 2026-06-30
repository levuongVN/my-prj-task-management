import React from "react";
import {
    LayoutDashboard,
    Zap,
    BarChart2,
    Users,
    ShieldCheck,
    Archive,
} from "lucide-react";
export const PROJECT_ICONS: Record<number, React.ReactNode> = {
    1: <LayoutDashboard size={16} />,
    2: <Zap size={16} />,
    3: <BarChart2 size={16} />,
    4: <Users size={16} />,
    5: <ShieldCheck size={16} />,
    6: <Archive size={16} />,
};

export const STATUS_CONFIG = {
    active: {
        label: "Active",
        dot: "bg-blue-500",
        count: "bg-blue-500/10 text-blue-400",
        sectionText: "text-blue-400",
        cardBorder: "border-t-blue-500",
        icon: "bg-blue-500/10 text-blue-400",
        progressBar: "bg-blue-500",
        progressText: "text-blue-400",
        badge: "bg-blue-500/10 text-blue-400",
    },
    completed: {
        label: "Completed",
        dot: "bg-emerald-500",
        count: "bg-emerald-500/10 text-emerald-400",
        sectionText: "text-emerald-400",
        cardBorder: "border-t-emerald-500",
        icon: "bg-emerald-500/10 text-emerald-400",
        progressBar: "bg-emerald-500",
        progressText: "text-emerald-400",
        badge: "bg-emerald-500/10 text-emerald-400",
    },
    archived: {
        label: "Archived",
        dot: "bg-zinc-600",
        count: "bg-zinc-800 text-zinc-500",
        sectionText: "text-zinc-500",
        cardBorder: "border-t-zinc-600",
        icon: "bg-zinc-800 text-zinc-500",
        progressBar: "bg-zinc-600",
        progressText: "text-zinc-500",
        badge: "bg-zinc-800 text-zinc-500",
    },
} as const;

/**
 * Map status number (từ API) → string key dùng trong STATUS_CONFIG
 * 0 = active, 1 = completed, 2 = archived
 */
export const PROJECT_STATUS_MAP: Record<number, keyof typeof STATUS_CONFIG> = {
    0: "active",
    1: "completed",
    2: "archived",
};

/**
 * Map string key → number để gửi lên API
 */
export const PROJECT_STATUS_REVERSE: Record<keyof typeof STATUS_CONFIG, number> = {
    active:    0,
    completed: 1,
    archived:  2,
};

export const SORT_OPTIONS = [
    { value: "due", label: "Due date" },
    { value: "name", label: "Name" },
    { value: "progress", label: "Progress" },
    { value: "status", label: "Status" },
] as const;

export const STATUS_OPTIONS = [
    "active",
    "completed",
    "archived",
] as const;