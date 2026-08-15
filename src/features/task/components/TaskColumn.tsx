import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import TaskCard from "./TaskCard";
import type { Task } from "../../../shared/types/Task";
import clsx from "clsx";

interface TaskColumnProps {
    id: string; // The status value (0, 1, 2, 3) as string
    title: string;
    tasks: Task[];
    onViewTask: (task: Task) => void;
}

export default function TaskColumn({ id, title, tasks, onViewTask }: TaskColumnProps) {
    const { setNodeRef, isOver } = useDroppable({
        id,
        data: { type: "Column", statusId: parseInt(id) }
    });

    const statusColors: Record<string, string> = {
        "0": "bg-yellow-500", // Pending
        "1": "bg-blue-500",   // In Progress
        "2": "bg-purple-500", // In Review
        "3": "bg-green-500",  // Completed
    };

    return (
        <div className="flex flex-col bg-zinc-950/50 rounded-2xl border border-white/5 min-w-[320px] w-[320px]">
            {/* Column Header */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${statusColors[id] || 'bg-zinc-500'}`} />
                    <h3 className="font-semibold text-white">{title}</h3>
                </div>
                <span className="bg-zinc-900 text-zinc-400 text-xs font-medium px-2 py-1 rounded-md">
                    {tasks.length}
                </span>
            </div>

            {/* Droppable Area */}
            <div 
                ref={setNodeRef}
                className={clsx(
                    "p-3 flex-1 overflow-y-auto flex flex-col gap-3 min-h-[150px] transition-colors rounded-b-2xl",
                    isOver ? "bg-zinc-900/60 ring-1 ring-inset ring-white/10" : ""
                )}
            >
                <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                    {tasks.map(task => (
                        <TaskCard key={task.id} task={task} onView={onViewTask} />
                    ))}
                </SortableContext>
            </div>
        </div>
    );
}
