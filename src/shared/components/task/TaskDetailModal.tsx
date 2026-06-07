import Modal from "../Ui/Modal";
import {
    CalendarDays,
    Flag,
    CircleCheckBig,
    Pencil,
    Trash2,
} from "lucide-react";

import type { Task } from "../../types/Task";
import Button from "../Ui/Button";

interface Props {
    isOpen: boolean;
    task: Task | null;
    onClose: () => void;
}

export default function TaskDetailModal({ isOpen, task, onClose }: Props) {
    if (!task) return null;

    const priorityBadge = {
        High: "bg-red-100 text-red-700",
        Medium: "bg-amber-100 text-amber-700",
        Low: "bg-green-100 text-green-700",
    };

    const statusBadge = {
        Pending: "bg-orange-100 text-orange-700",
        "In Progress": "bg-blue-100 text-blue-700",
        "In Review": "bg-purple-100 text-purple-700",
        Completed: "bg-green-100 text-green-700",
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Task overview" size="md">
            <div className="overflow-hidden rounded-2xl border border-white/8 bg-zinc-950">

                {/* Hero */}
                <div className="px-6 py-5 border-b border-white/8">
                    <h2 className="text-lg font-medium text-white leading-snug">
                        {task.title}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                        {task.description}
                    </p>
                </div>

                {/* Meta grid */}
                <div className="grid grid-cols-3 divide-x divide-white/8 border-b border-white/8">
                    <div className="flex flex-col gap-2 px-5 py-4">
                        <span className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-zinc-500">
                            <Flag size={12} />
                            Priority
                        </span>
                        <span
                            className={`inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-medium
                                ${priorityBadge[task.priority as keyof typeof priorityBadge]}`}
                        >
                            {task.priority}
                        </span>
                    </div>

                    <div className="flex flex-col gap-2 px-5 py-4">
                        <span className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-zinc-500">
                            <CircleCheckBig size={12} />
                            Status
                        </span>
                        <span
                            className={`inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-medium
                                ${statusBadge[task.status as keyof typeof statusBadge]}`}
                        >
                            {task.status}
                        </span>
                    </div>

                    <div className="flex flex-col gap-2 px-5 py-4">
                        <span className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-zinc-500">
                            <CalendarDays size={12} />
                            Due date
                        </span>
                        <span className="text-sm font-medium text-white">
                            {task.due}
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 px-6 py-4">
                    <Button
                        variant="secondary"
                        className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium"
                    >
                        <Pencil size={14} />
                        Edit
                    </Button>

                    <Button
                        variant="ghost"
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-white px-4 py-2 text-sm font-medium text-black"
                    >
                        <CircleCheckBig size={14} />
                        Mark complete
                    </Button>

                    <Button
                        variant="ghost"
                        className="flex items-center gap-1.5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/20"
                    >
                        <Trash2 size={14} />
                        Delete
                    </Button>
                </div>
            </div>
        </Modal>
    );
}