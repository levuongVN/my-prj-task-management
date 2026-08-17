import { memo } from "react";
import { Bar } from "react-chartjs-2";
import { Activity } from "lucide-react";
import { chartDefaults, gridColor, tickColor } from "../charts/chartSetup";
import type { AnalyticsData } from "../types";
import type { PeriodKey } from "../utils/periodDate";

interface BarChartCardProps {
    analytics: AnalyticsData | undefined;
    period: PeriodKey;
}

function BarChartCardInner({ analytics, period }: BarChartCardProps) {
    const barChartData = {
        labels: analytics?.activityTrend.map(x => x.label) ?? [],
        datasets: [
            {
                label: "Completed",
                data: analytics?.activityTrend.map(x => x.completed) ?? [],
                backgroundColor: "rgba(52,211,153,0.85)",
                borderRadius: 6,
                borderSkipped: false,
                barThickness: 10,
            },
            {
                label: "Created",
                data:
                    analytics?.activityTrend.map(x => x.created) ?? [],
                backgroundColor: "rgba(99,102,241,0.5)",
                borderRadius: 6,
                borderSkipped: false,
                barThickness: 10,
            },
        ],
    };

    const barOptions = {
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

    const barChartTitle =
        period === "week" ? "Weekly Task Activity" : period === "month" ? "Monthly Task Activity" : "Quarterly Task Activity";

    const barChartSub =
        period === "week"
            ? "Created vs completed this week"
            : period === "month"
                ? "Created vs completed by week this month"
                : "Created vs completed by month this quarter";

    return (
        <div className="rounded-2xl border border-white/5 bg-[#141414] p-5">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-white">{barChartTitle}</p>
                    <p className="mt-0.5 text-xs text-zinc-600">{barChartSub}</p>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-400/10">
                    <Activity size={14} className="text-indigo-400" />
                </div>
            </div>
            <div className="h-52">
                <Bar data={barChartData} options={barOptions} />
            </div>
        </div>
    );
}

const BarChartCard = memo(BarChartCardInner);
export { BarChartCard };
