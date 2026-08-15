import {
    Activity,
    AlertCircle,
    ArrowDownRight,
    ArrowUpRight,
    CheckCircle2,
    Target,
} from "lucide-react";
import type { AnalyticsData } from "../types";
import { formatChange, isUp } from "../utils/periodDate";

interface KpiGridProps {
    analytics: AnalyticsData | undefined;
}

export function KpiGrid({ analytics }: KpiGridProps) {
    const completedTasks = analytics?.kpi.completedTasks ?? 0;
    const inProgressTasks = analytics?.kpi.inProgressTasks ?? 0;
    const overdueTasks = analytics?.kpi.overdueTasks ?? 0;
    const completionRate = analytics?.kpi.completionRate ?? 0;

    const kpis = [
        {
            label: "Tasks Completed",
            value: completedTasks,
            change: formatChange(analytics?.kpi.completedTasksChange ?? 0),
            up: isUp(analytics?.kpi.completedTasksChange ?? 0),
            sub: "completed tasks",
            icon: CheckCircle2,
            color: "text-emerald-400",
            bg: "bg-emerald-400/10",
        },
        {
            label: "In Progress",
            value: inProgressTasks,
            change: formatChange(analytics?.kpi.inProgressTasksChange ?? 0),
            up: isUp(analytics?.kpi.inProgressTasksChange ?? 0),
            sub: "active tasks",
            icon: Activity,
            color: "text-blue-400",
            bg: "bg-blue-400/10",
        },
        {
            label: "Overdue",
            value: overdueTasks,
            change: formatChange(analytics?.kpi.overdueTasksChange ?? 0),
            up: isUp(analytics?.kpi.overdueTasksChange ?? 0),
            sub: "past due date",
            icon: AlertCircle,
            color: "text-red-400",
            bg: "bg-red-400/10",
        },
        {
            label: "Completion Rate",
            value: `${completionRate}%`,
            change: formatChange(analytics?.kpi.completionRateChange ?? 0),
            up: isUp(analytics?.kpi.completionRateChange ?? 0),
            sub: "overall progress",
            icon: Target,
            color: "text-violet-400",
            bg: "bg-violet-400/10",
        },
    ];

    return (
        <div className="grid grid-cols-4 gap-4 mb-4">
            {kpis.map((kpi) => {
                const Icon = kpi.icon;
                return (
                    <div
                        key={kpi.label}
                        className="group rounded-2xl border border-white/5 bg-[#141414] p-4 transition-all hover:border-white/10 hover:bg-[#181818]"
                    >
                        <div className="mb-3 flex items-center justify-between">
                            <div
                                className={`flex h-8 w-8 items-center justify-center rounded-xl ${kpi.bg}`}
                            >
                                <Icon size={15} className={kpi.color} />
                            </div>
                            <span
                                className={`flex items-center gap-0.5 text-[11px] font-medium ${kpi.up ? "text-emerald-400" : "text-red-400"
                                    }`}
                            >
                                {kpi.up ? (
                                    <ArrowUpRight size={12} />
                                ) : (
                                    <ArrowDownRight size={12} />
                                )}
                                {kpi.change}
                            </span>
                        </div>
                        <p className="text-[22px] font-semibold tracking-tight text-white">
                            {kpi.value}
                        </p>
                        <p className="mt-0.5 text-xs text-zinc-600">{kpi.label}</p>
                        <p className="mt-0.5 text-[10px] text-zinc-700">{kpi.sub}</p>
                    </div>
                );
            })}
        </div>
    );
}
