import { memo } from "react";
import { statuses } from "../../../constants/taskOption"
import type { Task } from "../../../shared/types/Task"


interface Props {
    tasks: Task[]
}

function TaskStatsInner({ tasks }: Props) {
    const total = tasks.length;
    const inProgress = tasks.filter((t) => statuses[t.status] === "In Progress").length;
    const completed = tasks.filter((t) => statuses[t.status] === "Completed").length;

    const metrics = [
        { label: "Total", value: total, valueColor: "text-white" },
        { label: "In Progress", value: inProgress, valueColor: "text-blue-400" },
        { label: "Completed", value: completed, valueColor: "text-emerald-400" },
    ];

    return (
        <div className="grid grid-cols-3 md:flex gap-3 mb-6">
            {metrics.map((metric) => (
                <div key={metric.label} className="flex items-center gap-3 rounded-2xl border border-white/5 bg-zinc-950 px-4 py-3">
                    <p className="text-xs text-zinc-500">{metric.label}</p>

                    <p className={`ml-auto text-lg font-bold ${metric.valueColor}`}>
                        {metric.value}
                    </p>
                </div>
            ))}
        </div>
    )
}

const TaskStats = memo(TaskStatsInner);
export default TaskStats;
