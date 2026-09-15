import { Bar } from "react-chartjs-2";
import { CalendarClock, Inbox } from "lucide-react";
import type { Meeting } from "../../../shared/types/Meeting";

interface RightPanelProps {
    weeklyProductivity: {
        labels: string[];
        counts: number[];
        delta: number;
    };
    upcomingMeetings: Meeting[];
}

export default function RightPanel({ weeklyProductivity, upcomingMeetings }: RightPanelProps) {
    const { labels, counts, delta } = weeklyProductivity;

    const productivityData = {
        labels,
        datasets: [
            {
                label: 'Tasks Completed',
                data: counts,

                backgroundColor: '#ffffff',

                borderRadius: 5,
                borderSkipped: false,

                barThickness: 40,
                hoverBackgroundColor: '#d4d4d8',
            },
        ],
    }

    const productivityOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: '#71717a',
                },
            },
            y: {
                grid: {
                    color: 'rgba(255,255,255,0.15)',
                },
                ticks: {
                    color: '#71717a',
                    stepSize: 1,
                    precision: 0,
                },
                beginAtZero: true,
            },
        },
    }

    const deltaText = delta > 0 ? `+${delta}%` : `${delta}%`;

    const formatMeetingTime = (startAt: string) => (
        new Date(startAt).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        })
    );

    const formatMeetingDay = (startAt: string) => {
        const date = new Date(startAt);
        const today = new Date();
        const isToday = date.toDateString() === today.toDateString();

        if (isToday) return "Today";

        return date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <div className="space-y-8">

            {/* PRODUCTIVITY */}
            <section className="rounded-[32px] border border-white/5 bg-[#0b0b0b] p-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            Productivity
                        </h2>

                        <p className="mt-2 text-zinc-500">
                            Last 7 days
                        </p>
                    </div>

                    <div className={delta >= 0 ? "text-emerald-400 font-semibold" : "text-red-400 font-semibold"}>
                        {deltaText}
                    </div>
                </div>

                <div className="mt-10 h-[260px]">
                    <Bar
                        data={productivityData}
                        options={productivityOptions}
                    />
                </div>
            </section>

            {/* SCHEDULE */}
            <section className="rounded-[32px] border border-white/5 bg-[#0b0b0b] p-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            Upcoming
                        </h2>

                        <p className="mt-2 text-zinc-500">
                            Your next events
                        </p>
                    </div>
                </div>

                <div className="mt-8 space-y-5">
                    {upcomingMeetings.length === 0 ? (
                        <div className="flex flex-col items-center gap-3 py-10 text-zinc-500">
                            <Inbox size={32} strokeWidth={1.2} />
                            <p className="text-sm">No upcoming events</p>
                        </div>
                    ) : (
                        upcomingMeetings.map((meeting) => (
                            <div
                                key={meeting.id}
                                className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.03] p-5"
                            >
                                <div className="min-w-0">
                                    <h3 className="font-semibold tracking-tight truncate">
                                        {meeting.title}
                                    </h3>

                                    <p className="mt-2 flex items-center gap-1.5 text-sm text-zinc-500">
                                        <CalendarClock size={14} />
                                        {formatMeetingDay(meeting.startAt)}
                                    </p>
                                </div>

                                <div className="text-sm text-zinc-300 font-medium flex-shrink-0">
                                    {formatMeetingTime(meeting.startAt)}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </div>
    )
}
