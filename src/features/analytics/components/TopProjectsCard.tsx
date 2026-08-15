import { Users } from "lucide-react";
import type { AnalyticsData } from "../types";

interface TopProjectsCardProps {
    analytics: AnalyticsData | undefined;
    totals: { totalTasks: number; completedTasks: number; inProgressTasks: number; overdueTasks: number };
}

export function TopProjectsCard({ analytics, totals }: TopProjectsCardProps) {
    const { totalTasks, completedTasks, inProgressTasks, overdueTasks } = totals;

    return (
        <div className="rounded-2xl border border-white/5 bg-[#141414] p-5">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-white">Top Projects</p>
                    <p className="mt-0.5 text-xs text-zinc-600">Progress by initiative</p>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-400/10">
                    <Users size={14} className="text-violet-400" />
                </div>
            </div>

            <div className="space-y-4">
                {analytics?.topProjects.map((proj) => (
                    <div key={proj.projectId}>
                        <div className="mb-1.5 flex items-center justify-between">
                            <p className="text-sm text-zinc-300 truncate max-w-[65%]">
                                {proj.projectName}
                            </p>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-zinc-600">
                                    {proj.completedTasks}/{proj.totalTasks}
                                </span>
                                <span
                                    className={`text-xs font-medium ${proj.progress === 100
                                        ? "text-emerald-400"
                                        : proj.progress < 25
                                            ? "text-red-400"
                                            : "text-zinc-300"
                                        }`}
                                >
                                    {proj.progress}%
                                </span>
                            </div>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                            <div
                                className={`h-full rounded-full transition-all ${proj.progress === 100
                                    ? "bg-emerald-400"
                                    : proj.progress < 25
                                        ? "bg-red-400"
                                        : "bg-indigo-400"
                                    }`}
                                style={{ width: `${proj.progress}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Summary row */}
            <div className="mt-5 flex items-center justify-between rounded-xl border border-white/5 bg-[#1a1a1a] px-4 py-3">
                <div className="text-center">
                    <p className="text-base font-semibold text-white">{totalTasks}</p>
                    <p className="text-[10px] text-zinc-600">Total tasks</p>
                </div>
                <div className="h-8 w-px bg-white/5" />
                <div className="text-center">
                    <p className="text-base font-semibold text-emerald-400">{completedTasks}</p>
                    <p className="text-[10px] text-zinc-600">Done</p>
                </div>
                <div className="h-8 w-px bg-white/5" />
                <div className="text-center">
                    <p className="text-base font-semibold text-blue-400">{inProgressTasks}</p>
                    <p className="text-[10px] text-zinc-600">Active</p>
                </div>
                <div className="h-8 w-px bg-white/5" />
                <div className="text-center">
                    <p className="text-base font-semibold text-red-400">{overdueTasks}</p>
                    <p className="text-[10px] text-zinc-600">Overdue</p>
                </div>
            </div>
        </div>
    );
}
