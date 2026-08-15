import { Bar } from "react-chartjs-2";


export default function RightPanel() {
    const productivityData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'Tasks Completed',
                data: [12, 19, 9, 24, 17, 21, 15],

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
                },
            },
        },
    }
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
                            Weekly overview
                        </p>
                    </div>

                    <div className="text-emerald-400 font-semibold">
                        +18%
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
                    {[
                        {
                            title: 'Design Review Meeting',
                            time: '09:00 AM',
                        },
                        {
                            title: 'Sprint Planning',
                            time: '01:30 PM',
                        },
                        {
                            title: 'Team Sync',
                            time: '04:00 PM',
                        },
                    ].map((item) => (
                        <div
                            key={item.title}
                            className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.03] p-5"
                        >
                            <div>
                                <h3 className="font-semibold tracking-tight">
                                    {item.title}
                                </h3>

                                <p className="mt-2 text-sm text-zinc-500">
                                    Today
                                </p>
                            </div>

                            <div className="text-sm text-zinc-300 font-medium">
                                {item.time}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}