import { memo } from "react";
import { CheckCircle2, Clock3 } from "lucide-react";
import CustomSelect from "../../../shared/components/Ui/CustomSelect";
import type { Task } from "../../../shared/types/Task";
import { priorities, statuses } from "../../../constants/taskOption";
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
    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 px-6 py-6 border-b border-white/5 hover:bg-white/[0.02] transition">

            {/* Task Info */}
            <div className="col-span-5">
                <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
                        <CheckCircle2
                            size={20}
                            className="text-white"
                        />
                    </div>

                    <div>
                        <h3 className="font-semibold text-lg">
                            {task.title}
                        </h3>

                        {task.description?.trim() && (
                            <p className="text-zinc-400 mt-1 text-sm line-clamp-1">
                                {task.description}
                            </p>
                        )}

                        {/* Checklist progress — dùng Boolean() tránh gotcha {0 && < />}
                            in ra chữ "0" khi totalSubtasks === 0 */}
                        {!!task.totalSubtasks && (
                            <div className="mt-3 flex items-center gap-3">
                                <div className="h-1.5 w-32 overflow-hidden rounded-full bg-white/10">
                                    <div
                                        className="h-full rounded-full bg-emerald-500 transition-all"
                                        style={{ width: `${task.progressPercent ?? 0}%` }}
                                    />
                                </div>
                                <span className="text-xs text-zinc-500">
                                    {task.completedSubtasks}/{task.totalSubtasks}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Priority */}
            <div className="col-span-2 flex items-center">
                <CustomSelect
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
            <div className="col-span-2 flex items-center text-zinc-400">
                <div className="flex items-center gap-2">
                    <Clock3 size={16} />
                    {task.deadline ? formatDate(task.deadline) : "—"}
                </div>
            </div>

            {/* Action */}
            <div className="col-span-1 flex items-center justify-end">
                <button
                    onClick={() => onView(task)}
                    className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white hover:text-black transition"
                >
                    View
                </button>
            </div>
        </div>
    )
}

const TaskRow = memo(TaskRowInner);
export default TaskRow;
