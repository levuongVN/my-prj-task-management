import { memo } from "react";
import { Line } from "react-chartjs-2";
import { TrendingUp } from "lucide-react";
import { chartDefaults, gridColor, tickColor } from "../charts/chartSetup";
import type { AnalyticsData } from "../types";
import type { PeriodKey } from "../utils/periodDate";

interface LineChartCardProps {
    analytics: AnalyticsData | undefined;
    period: PeriodKey;
}

function LineChartCardInner({ analytics, period }: LineChartCardProps) {
    const lineChartData = {
        labels: analytics?.completionTrend.map(x => x.label) ?? [],
        datasets: [
            {
                label: "Completed",
                data: analytics?.completionTrend.map(x => x.completed) ?? [],
                borderColor: "#34d399",
                backgroundColor: "rgba(52,211,153,0.08)",
                borderWidth: 2,
                pointRadius: 4,
                pointBackgroundColor: "#34d399",
                fill: true,
                tension: 0.4,
            },
            {
                label: "Overdue",
                data: analytics?.completionTrend.map(x => x.overdue) ?? [],
                borderColor: "#f87171",
                backgroundColor: "rgba(248,113,113,0.05)",
                borderWidth: 2,
                pointRadius: 4,
                pointBackgroundColor: "#f87171",
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const lineOptions = {
        ...chartDefaults,
        plugins: {
            ...chartDefaults.plugins,
            legend: {
                display: true,
                labels: {
                    color: tickColor,
                    boxWidth: 10,
                    boxHeight: 10,
                    borderRadius: 4,
                    useBorderRadius: true,
                },
            },
        },
        scales: {
            x: { grid: { color: gridColor }, ticks: { color: tickColor } },
            y: { grid: { color: gridColor }, ticks: { color: tickColor } },
        },
    };

    return (
        <div className="rounded-2xl border border-white/5 bg-[#141414] p-5">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-white">
                        {period === "week" ? "6-Week Completion Trend" : period === "month"
                            ? "6-Month Completion Trend"
                            : "6-Quarter Completion Trend"}
                    </p>
                    <p className="mt-0.5 text-xs text-zinc-600">
                        Completed vs overdue over last 6{" "}
                        {period === "week"
                            ? "weeks"
                            : period === "month"
                                ? "months"
                                : "quarters"}
                    </p>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-400/10">
                    <TrendingUp size={14} className="text-emerald-400" />
                </div>
            </div>
            <div className="h-52">
                <Line data={lineChartData} options={lineOptions} />
            </div>
        </div>
    );
}

const LineChartCard = memo(LineChartCardInner);
export { LineChartCard };
