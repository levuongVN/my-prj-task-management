import { memo } from "react";
import { Doughnut } from "react-chartjs-2";
import { chartDefaults, tickColor } from "../charts/chartSetup";
import type { AnalyticsData } from "../types";

interface DoughnutCardProps {
    analytics: AnalyticsData | undefined;
}

function DoughnutCardInner({ analytics }: DoughnutCardProps) {
    const priorityDoughnut = {
        labels: ["High", "Medium", "Low"],
        datasets: [
            {
                data: [
                    analytics?.priority.high ?? 0,
                    analytics?.priority.medium ?? 0,
                    analytics?.priority.low ?? 0,
                ],
                backgroundColor: [
                    "#f87171",
                    "#fbbf24",
                    "#34d399",
                ],
                borderColor: "#0d0d0d",
                borderWidth: 3,
                hoverOffset: 6,
            },
        ],
    };

    const statusDoughnut = {
        labels: ["Todo", "In Progress", "In Review", "Done"],
        datasets: [
            {
                data: [
                    analytics?.status.todo ?? 0,
                    analytics?.status.inProgress ?? 0,
                    analytics?.status.inReview ?? 0,
                    analytics?.status.done ?? 0,
                ],
                backgroundColor: [
                    "#71717a",
                    "#60a5fa",
                    "#fbbf24",
                    "#34d399",
                ],
                borderColor: "#0d0d0d",
                borderWidth: 3,
                hoverOffset: 6,
            },
        ],
    };

    const doughnutOptions = {
        ...chartDefaults,
        cutout: "72%",
        plugins: {
            ...chartDefaults.plugins,
            legend: {
                display: true,
                position: "bottom" as const,
                labels: {
                    color: tickColor,
                    boxWidth: 10,
                    boxHeight: 10,
                    borderRadius: 4,
                    useBorderRadius: true,
                    padding: 12,
                },
            },
        },
    };

    return (
        <div className="flex flex-col gap-5">
            <div className="flex-1 rounded-2xl border border-white/5 bg-[#141414] p-5">
                <div className="mb-3">
                    <p className="text-sm font-medium text-white">By Priority</p>
                    <p className="mt-0.5 text-xs text-zinc-600">Distribution of tasks in period</p>
                </div>
                <div className="flex items-center justify-center" style={{ height: 180 }}>
                    <Doughnut data={priorityDoughnut} options={doughnutOptions} />
                </div>
            </div>

            <div className="flex-1 rounded-2xl border border-white/5 bg-[#141414] p-5">
                <div className="mb-3">
                    <p className="text-sm font-medium text-white">By Status</p>
                    <p className="mt-0.5 text-xs text-zinc-600">Tasks current state in period</p>
                </div>
                <div className="flex items-center justify-center" style={{ height: 180 }}>
                    <Doughnut data={statusDoughnut} options={doughnutOptions} />
                </div>
            </div>
        </div>
    );
}

const DoughnutCard = memo(DoughnutCardInner);
export { DoughnutCard };
