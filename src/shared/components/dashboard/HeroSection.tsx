import { Plus, Sparkles } from "lucide-react";

export default function HeroSection() {
    return (
        <section className="relative overflow-hidden rounded-[36px] border border-white/5 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black p-8 lg:p-10">
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
                        <button className="h-14 px-7 rounded-2xl bg-white text-black font-semibold hover:opacity-90 transition flex items-center gap-2">
                            <Plus size={18} />
                            Create Task
                        </button>

                        <button className="h-14 px-7 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition font-medium">
                            View Analytics
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-5 min-w-[320px]">
                    {[
                        {
                            label: 'Tasks Completed',
                            value: '84%',
                            bg: 'from-emerald-500/15 to-emerald-500/5',
                            border: 'border-emerald-500/10',
                            valueColor: 'text-emerald-400',
                        },
                        {
                            label: 'Active Projects',
                            value: '12',
                            bg: 'from-blue-500/15 to-blue-500/5',
                            border: 'border-blue-500/10',
                            valueColor: 'text-blue-400',
                        },
                        {
                            label: 'Team Members',
                            value: '24',
                            bg: 'from-purple-500/15 to-purple-500/5',
                            border: 'border-purple-500/10',
                            valueColor: 'text-purple-400',
                        },
                        {
                            label: 'Productivity',
                            value: '+18%',
                            bg: 'from-orange-500/15 to-orange-500/5',
                            border: 'border-orange-500/10',
                            valueColor: 'text-orange-400',
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