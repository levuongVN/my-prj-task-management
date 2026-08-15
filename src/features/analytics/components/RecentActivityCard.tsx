import { TrendingDown } from "lucide-react";
import type { AnalyticsData } from "../types";
import { formatTimeAgo } from "../utils/periodDate";

interface RecentActivityCardProps {
    analytics: AnalyticsData | undefined;
}

export function RecentActivityCard({ analytics }: RecentActivityCardProps) {
    const activityDot: Record<string, string> = {
        completed: "bg-emerald-400",
        created: "bg-blue-400",
        overdue: "bg-red-400",
        review: "bg-violet-400",
    };
    const activityLabel: Record<string, string> = {
        completed: "text-emerald-400",
        created: "text-blue-400",
        overdue: "text-red-400",
        review: "text-violet-400",
    };

    return (
        <div className="rounded-2xl border border-white/5 bg-[#141414] p-5">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-white">Recent Activity</p>
                    <p className="mt-0.5 text-xs text-zinc-600">Latest task events</p>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-pink-400/10">
                    <TrendingDown size={14} className="text-pink-400" />
                </div>
            </div>

            <div className="space-y-1">
                {(analytics?.recentActivity ?? []).map((item, idx) => (
                    <div
                        key={idx}
                        className="flex items-start gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-white/4"
                    >
                        <div className="mt-1.5 flex flex-col items-center">
                            <div className={`h-2 w-2 flex-shrink-0 rounded-full ${activityDot[item.type]}`} />
                            {idx < (analytics?.recentActivity.length ?? 0) - 1 && (
                                <div className="mt-1 w-px flex-1 bg-white/5" style={{ height: 20 }} />
                            )}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-[11px] font-medium leading-none">
                                <span className={activityLabel[item.type]}>{item.action}</span>
                            </p>
                            <p className="mt-0.5 truncate text-xs text-zinc-400">{item.taskTitle}</p>
                            <p className="mt-0.5 text-[10px] text-zinc-700">
                                {formatTimeAgo(item.occurredAt)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
