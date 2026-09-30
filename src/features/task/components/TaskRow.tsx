import { memo } from "react";
import { Clock3, Repeat } from "lucide-react";
import clsx from "clsx";
import CustomSelect from "../../../shared/components/Ui/CustomSelect";
import { LabelChips } from "../../../shared/components/Ui/LabelChip";
import type { Task } from "../../../shared/types/Task";
import { priorities, statuses, TASK_RECURRENCE_MAP } from "../../../constants/taskOption";

interface TaskRowProps {
    task: Task
    onView: (task: Task) => void;
    onPriorityChange: (id: string, value: number) => void
    onStatusChange: (id: string, value: number) => void
}

function TaskRowInner({
    task,
    onView,
    onPriorityChange,
    onStatusChange,
}: TaskRowProps) {
    const formatDate = (date: string) => date.substring(0, 10);
    const isCompleted = task.status === statuses.indexOf("Completed");

    return (
        <div
            onClick={(e) => {
                // Click hàng → mở detail (không gồm tương tác trong select/button)
                const target = e.target as HTMLElement;
                if (target.closest("button") || target.closest("[role='listbox']")?.contains(target)) return;
                onView(task);
            }}
            className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-3.5 border-b border-white/5 hover:bg-white/[0.03] transition cursor-pointer"
        >
            {/* Task Info */}
            <div className="col-span-5">
                <div className="flex items-center gap-3 min-w-0">
                    <span
                        className={clsx(
                            "h-2 w-2 flex-shrink-0 rounded-full",
                            isCompleted ? "bg-emerald-500" : "bg-zinc-500"
                        )}
                    />

                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2.5 min-w-0">
                            <h3 className={clsx(
                                "truncate text-sm font-medium",
                                isCompleted ? "text-zinc-500 line-through" : "text-white"
                            )}>
                                {task.title}
                            </h3>

                            {/* Labels — chips màu, tối đa 2 + "+N" */}
                            <LabelChips labels={task.labels} max={2} />

                            {/* Checklist progress — Boolean() chống in chữ "0" */}
                            {!!task.totalSubtasks && (
                                <span className="flex flex-shrink-0 items-center gap-1.5 text-[11px] text-zinc-500">
                                    <span className="h-1 w-14 overflow-hidden rounded-full bg-white/10">
                                        <span
                                            className="block h-full rounded-full bg-emerald-500 transition-all"
                                            style={{ width: `${task.progressPercent ?? 0}%` }}
                                        />
                                    </span>
                                    {task.completedSubtasks}/{task.totalSubtasks}
                                </span>
                            )}

                            {/* Description inline, ẩn luôn nếu dòng dài hơn */}
                            {task.description?.trim() && (
                                <span className="hidden lg:block truncate text-xs text-zinc-500">
                                    {task.description}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Priority */}
            <div className="col-span-2 flex items-center">
                <CustomSelect
                    compact
                    value={priorities[task.priority]}
                    onChange={(value) =>
                        onPriorityChange(task.id, priorities.indexOf(value))
                    }
                    type="priority"
                    options={[
                        { label: "High", value: "High" },
                        { label: "Medium", value: "Medium" },
                        { label: "Low", value: "Low" },
                    ]}
                />
            </div>

            {/* Status */}
            <div className="col-span-2 flex items-center">
                <CustomSelect
                    compact
                    value={statuses[task.status]}
                    onChange={(value) =>
                        onStatusChange(task.id, statuses.indexOf(value))
                    }
                    type="status"
                    options={[
                        { label: "Pending", value: "Pending" },
                        { label: "In Progress", value: "In Progress" },
                        { label: "In Review", value: "In Review" },
                        { label: "Completed", value: "Completed" },
                    ]}
                />
            </div>

            {/* Due */}
            <div className="col-span-2 flex items-center text-sm text-zinc-400">
                <span className="flex items-center gap-1.5">
                    <Clock3 size={14} />
                    {task.deadline ? formatDate(task.deadline) : "—"}
                    {/* Recurring badge — task sẽ tự sinh lại sau kỳ này */}
                    {!!task.recurrenceType && (
                        <span className="flex items-center gap-0.5 rounded-md bg-white/5 px-1.5 py-0.5 text-[10px] font-medium text-blue-400">
                            <Repeat size={11} />
                            {TASK_RECURRENCE_MAP[task.recurrenceType]}
                        </span>
                    )}
                </span>
            </div>

            {/* Action — ghost */}
            <div className="col-span-1 flex items-center justify-end">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onView(task);
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400 border border-white/10 transition hover:text-white hover:bg-white/10"
                >
                    View
                </button>
            </div>
        </div>
    )
}

const TaskRow = memo(TaskRowInner);
export default TaskRow;
