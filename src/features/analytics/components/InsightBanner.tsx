import { AlertCircle, TrendingUp, Zap } from "lucide-react";
import type { AnalyticsData } from "../types";

interface InsightBannerProps {
    analytics: AnalyticsData | undefined;
}

export function InsightBanner({ analytics }: InsightBannerProps) {
    return (
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {/* Card 1 — Completion rate */}
            <div className="flex items-center gap-4 rounded-2xl border border-emerald-500/15 bg-emerald-500/5 px-5 py-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-emerald-400/15">
                    <TrendingUp size={18} className="text-emerald-400" />
                </div>
                <div>
                    {(analytics?.kpi.completionRateChange ?? 0) >= 0 ? (
                        <>
                            <p className="text-sm font-medium text-emerald-300">Great momentum!</p>
                            <p className="mt-0.5 text-xs text-zinc-600">
                                Completion rate up{" "}
                                <span className="text-emerald-400 font-medium">
                                    +{analytics?.kpi.completionRateChange ?? 0}%
                                </span>{" "}
                                from last period.
                            </p>
                        </>
                    ) : (
                        <>
                            <p className="text-sm font-medium text-red-300">Slowing down</p>
                            <p className="mt-0.5 text-xs text-zinc-600">
                                Completion rate down{" "}
                                <span className="text-red-400 font-medium">
                                    {analytics?.kpi.completionRateChange ?? 0}%
                                </span>{" "}
                                from last period.
                            </p>
                        </>
                    )}
                </div>
            </div>

            {/* Card 2 — Projects at risk */}
            {(() => {
                const atRisk = (analytics?.topProjects ?? []).filter(p => p.progress < 50 && p.totalTasks > 0).length;
                return (
                    <div className="flex items-center gap-4 rounded-2xl border border-amber-500/15 bg-amber-500/5 px-5 py-4">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-amber-400/15">
                            <AlertCircle size={18} className="text-amber-400" />
                        </div>
                        <div>
                            {atRisk > 0 ? (
                                <>
                                    <p className="text-sm font-medium text-amber-300">Watch out</p>
                                    <p className="mt-0.5 text-xs text-zinc-600">
                                        <span className="text-amber-400 font-medium">{atRisk} project{atRisk > 1 ? "s" : ""}</span>{" "}
                                        at risk of falling behind.
                                    </p>
                                </>
                            ) : (
                                <>
                                    <p className="text-sm font-medium text-emerald-300">All on track!</p>
                                    <p className="mt-0.5 text-xs text-zinc-600">No projects at risk right now.</p>
                                </>
                            )}
                        </div>
                    </div>
                );
            })()}

            {/* Card 3 — Peak day */}
            <div className="flex items-center gap-4 rounded-2xl border border-violet-500/15 bg-violet-500/5 px-5 py-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-violet-400/15">
                    <Zap size={18} className="text-violet-400" />
                </div>
                <div>
                    {analytics?.insight.peakDay && analytics.insight.peakDay !== "—" ? (
                        <>
                            <p className="text-sm font-medium text-violet-300">
                                Peak day: {analytics.insight.peakDay}
                            </p>
                            <p className="mt-0.5 text-xs text-zinc-600">
                                Avg{" "}
                                <span className="text-violet-400 font-medium">
                                    {analytics.insight.peakDayCount} tasks
                                </span>{" "}
                                completed on {analytics.insight.peakDay}s.
                            </p>
                        </>
                    ) : (
                        <>
                            <p className="text-sm font-medium text-zinc-400">No peak day yet</p>
                            <p className="mt-0.5 text-xs text-zinc-600">Complete more tasks to see your peak day.</p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
