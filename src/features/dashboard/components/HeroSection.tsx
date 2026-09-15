import { useNavigate } from "react-router-dom";
import { ArrowRight, Plus, Sparkles } from "lucide-react";

interface HeroSectionProps {
    stats: {
        completedRate: number;
        activeProjects: number;
        overdueTasks: number;
        upcomingTasks: number;
    };
}

export default function HeroSection({ stats }: HeroSectionProps) {
    const navigate = useNavigate();

    return (
        <section className="relative overflow-hidden rounded-[36px] border border-white/5 bg-bg-surface p-8 lg:p-10">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 blur-3xl rounded-full" />

            <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-10">

                <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm text-zinc-300">
                        <Sparkles size={16} />
                        Productivity Insight
                    </div>

                    <h2 className="mt-6 text-4xl lg:text-6xl font-bold tracking-tight leading-tight">
                        Stay focused on what matters most.
                    </h2>

                    <p className="mt-6 text-zinc-400 text-lg leading-8 max-w-xl">
                        Organize tasks, track team performance, and manage your workflow with a modern productivity experience.
                    </p>

                    <div className="mt-8 flex flex-wrap items-center gap-4">
                        <button
                            onClick={() => navigate("/tasks")}
                            className="h-14 px-7 rounded-2xl bg-accent text-accent-fg font-semibold hover:opacity-90 transition flex items-center gap-2"
                        >
                            <Plus size={18} />
                            Manage Tasks
                        </button>

                        <button
                            onClick={() => navigate("/analytics")}
                            className="h-14 px-7 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition font-medium flex items-center gap-2"
                        >
                            View Analytics
                            <ArrowRight size={18} />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-5 min-w-[320px]">
                    {[
                        {
                            label: 'Tasks Completed',
                            value: `${stats.completedRate}%`,
                            bg: 'from-emerald-500/15 to-emerald-500/5',
                            border: 'border-emerald-500/10',
                            valueColor: 'text-emerald-400',
                        },
                        {
                            label: 'Active Projects',
                            value: `${stats.activeProjects}`,
                            bg: 'from-blue-500/15 to-blue-500/5',
                            border: 'border-blue-500/10',
                            valueColor: 'text-blue-400',
                        },
                        {
                            label: 'Overdue Tasks',
                            value: `${stats.overdueTasks}`,
                            bg: 'from-red-500/15 to-red-500/5',
                            border: 'border-red-500/10',
                            valueColor: 'text-red-400',
                        },
                        {
                            label: 'Due in 7 Days',
                            value: `${stats.upcomingTasks}`,
                            bg: 'from-amber-500/15 to-amber-500/5',
                            border: 'border-amber-500/10',
                            valueColor: 'text-amber-400',
                        },
                    ].map((item) => (
                        <div
                            key={item.label}
                            className={`rounded-3xl border ${item.border} bg-gradient-to-br ${item.bg} backdrop-blur p-6`}
                        >
                            <p className="text-sm text-zinc-400 leading-6">
                                {item.label}
                            </p>

                            <h3
                                className={`mt-5 text-4xl font-bold tracking-tight ${item.valueColor}`}
                            >
                                {item.value}
                            </h3>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}