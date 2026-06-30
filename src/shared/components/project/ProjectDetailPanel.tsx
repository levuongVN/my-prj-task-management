import { X, Pencil, Trash2, CalendarDays, BarChart2, Clock, AlertTriangle } from "lucide-react";
import { useState } from "react";
import type { Project } from "../../types/Project";

const STATUS_LABEL: Record<number, string> = { 0: "Active", 1: "Completed", 2: "Archived" };
const STATUS_COLOR: Record<number, string> = {
    0: "bg-blue-500/15 text-blue-400 border-blue-500/20",
    1: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    2: "bg-zinc-500/15 text-zinc-400 border-zinc-500/20",
};
const PROGRESS_COLOR: Record<number, string> = {
    0: "bg-blue-500",
    1: "bg-emerald-500",
    2: "bg-zinc-500",
};

interface ProjectDetailPanelProps {
    project: Project | null;
    isOpen: boolean;
    onClose: () => void;
    onEdit: (project: Project) => void;
    onDelete: (project: Project) => void;
    onViewTasks?: (project: Project) => void;
}

export default function ProjectDetailPanel({
    project,
    isOpen,
    onClose,
    onEdit,
    onDelete,
    onViewTasks
}: ProjectDetailPanelProps) {
    const [confirmDelete, setConfirmDelete] = useState(false);

    // Reset confirm state khi đóng panel
    const handleClose = () => {
        setConfirmDelete(false);
        onClose();
    };

    const handleDelete = () => {
        if (!project) return;
        onDelete(project);
        setConfirmDelete(false);
        handleClose();
    };

    if (!project) return null;

    const dueDate = new Date(project.due);
    const formattedDue = dueDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
    const daysLeft = Math.ceil((dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"
                    }`}
                onClick={handleClose}
            />

            {/* Slide-over */}
            <div
                className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-[420px] flex-col bg-[#111] shadow-2xl transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                {/* ── Header ── */}
                <div className="flex items-start justify-between border-b border-white/8 px-6 py-5">
                    <div className="flex-1 pr-4">
                        <p className="mb-1 text-[10px] font-medium uppercase tracking-widest text-zinc-600">
                            Project detail
                        </p>
                        <h2 className="text-lg font-medium leading-snug text-white">
                            {project.name}
                        </h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className="mt-0.5 rounded-lg p-1.5 text-zinc-600 transition-colors hover:bg-white/6 hover:text-zinc-300"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* ── Body ── */}
                <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">

                    {/* Badges */}
                    <div className="flex items-center gap-2">
                        <span
                            className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${STATUS_COLOR[project.status]}`}
                        >
                            <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                            {STATUS_LABEL[project.status] ?? "Unknown"}
                        </span>
                        {project.overdue && (
                            <span className="flex items-center gap-1 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-medium text-red-400">
                                <AlertTriangle size={11} />
                                Overdue
                            </span>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <p className="mb-2 text-[10px] font-medium uppercase tracking-widest text-zinc-600">
                            Description
                        </p>
                        {project.description ? (
                            <p className="text-sm leading-relaxed text-zinc-400">
                                {project.description}
                            </p>
                        ) : (
                            <p className="text-sm italic text-zinc-700">No description provided.</p>
                        )}
                    </div>

                    {/* Progress */}
                    <div>
                        <div className="mb-2 flex items-center justify-between">
                            <p className="text-[10px] font-medium uppercase tracking-widest text-zinc-600">
                                Progress
                            </p>
                            <span className="text-xs font-medium tabular-nums text-zinc-400">
                                {project.progress}%
                            </span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/6">
                            <div
                                className={`h-full rounded-full transition-all duration-500 ${PROGRESS_COLOR[project.status] ?? "bg-white"}`}
                                style={{ width: `${project.progress}%` }}
                            />
                        </div>
                    </div>

                    {/* Meta grid */}
                    <div className="grid grid-cols-2 gap-2.5">
                        <div className="rounded-xl border border-white/6 bg-white/3 px-4 py-3">
                            <div className="mb-1.5 flex items-center gap-1.5">
                                <CalendarDays size={11} className="text-zinc-600" />
                                <span className="text-[10px] font-medium uppercase tracking-widest text-zinc-600">
                                    Due date
                                </span>
                            </div>
                            <p className="text-sm font-medium text-zinc-200">{formattedDue}</p>
                        </div>

                        <div className="rounded-xl border border-white/6 bg-white/3 px-4 py-3">
                            <div className="mb-1.5 flex items-center gap-1.5">
                                <Clock size={11} className="text-zinc-600" />
                                <span className="text-[10px] font-medium uppercase tracking-widest text-zinc-600">
                                    {project.overdue ? "Overdue by" : "Days left"}
                                </span>
                            </div>
                            <p
                                className={`text-sm font-medium tabular-nums ${project.overdue ? "text-red-400" : "text-zinc-200"
                                    }`}
                            >
                                {project.overdue ? `${Math.abs(daysLeft)}d` : daysLeft > 0 ? `${daysLeft}d` : "Today"}
                            </p>
                        </div>

                        <div
                            onClick={() => onViewTasks(project)}
                            className="
                                rounded-xl border border-white/6 bg-white/3 px-4 py-3
                                cursor-pointer
                                transition-all
                                hover:bg-white/6
                                hover:border-white/10
                            "
                        >
                            <div className="mb-1.5 flex items-center gap-1.5">
                                <BarChart2 size={11} className="text-zinc-600" />
                                <span className="text-[10px] font-medium uppercase tracking-widest text-zinc-600">
                                    Tasks
                                </span>
                            </div>

                            <p className="text-sm font-medium text-zinc-200">
                                {project.taskIds?.length ?? 0}
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── Footer ── */}
                <div className="border-t border-white/8 px-6 py-4">
                    {confirmDelete ? (
                        /* Confirm delete inline */
                        <div className="rounded-xl border border-red-500/20 bg-red-500/8 p-4">
                            <p className="mb-3 text-sm text-zinc-300">
                                Delete{" "}
                                <span className="font-medium text-white">"{project.name}"</span>?
                                This can't be undone.
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleDelete}
                                    className="flex-1 rounded-lg bg-red-500 py-2 text-xs font-medium text-white transition-colors hover:bg-red-600"
                                >
                                    Yes, delete
                                </button>
                                <button
                                    onClick={() => setConfirmDelete(false)}
                                    className="flex-1 rounded-lg bg-white/6 py-2 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/10"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <button
                                onClick={() => onEdit(project)}
                                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-black transition-colors hover:bg-zinc-200"
                            >
                                <Pencil size={13} />
                                Edit project
                            </button>
                            <button
                                onClick={() => setConfirmDelete(true)}
                                className="flex items-center justify-center gap-1.5 rounded-xl border border-white/8 px-4 py-2.5 text-sm font-medium text-zinc-400 transition-colors hover:border-red-500/30 hover:bg-red-500/8 hover:text-red-400"
                            >
                                <Trash2 size={13} />
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}