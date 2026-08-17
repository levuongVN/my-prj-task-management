import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Clock, AlertCircle } from "lucide-react";
import { TASK_PRIORITY_MAP } from "../../../constants/taskOption";
import { format } from "date-fns";
import clsx from "clsx";
import type { Task } from "../../../shared/types/Task";
import { memo } from "react";

interface TaskCardProps {
    task: Task;
    onView: (task: Task) => void;
    isOverlay?: boolean;
}

function TaskCardInner({ task, onView, isOverlay }: TaskCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: task.id, data: { type: "Task", task } });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const priorityColors: Record<number, string> = {
        0: "text-red-500 bg-red-500/10", // High
        1: "text-yellow-500 bg-yellow-500/10", // Medium
        2: "text-green-500 bg-green-500/10", // Low
    };

    if (isDragging && !isOverlay) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="rounded-xl border-2 border-dashed border-zinc-600 bg-zinc-800/20 opacity-50 min-h-[96px]"
            />
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={() => onView(task)}
            className={clsx(
                "p-4 rounded-xl bg-zinc-900 border cursor-grab active:cursor-grabbing transition group flex flex-col gap-3",
                isOverlay ? "border-blue-500/50 shadow-2xl shadow-blue-500/10" : "border-white/5 hover:border-white/20"
            )}
        >
            <h4 className="text-white font-medium line-clamp-2">{task.title}</h4>
            
            <div className="flex items-center justify-between mt-auto">
                <span className={clsx("px-2.5 py-1 text-xs font-medium rounded-md flex items-center gap-1", priorityColors[task.priority] || "text-zinc-400 bg-zinc-800")}>
                    <AlertCircle size={12} />
                    {TASK_PRIORITY_MAP[task.priority]}
                </span>

                {task.deadline && (
                    <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                        <Clock size={14} />
                        <span>{format(new Date(task.deadline), "MMM d")}</span>
                    </div>
                )}
            </div>
        </div>
    );
}

const TaskCard = memo(TaskCardInner);
export default TaskCard;