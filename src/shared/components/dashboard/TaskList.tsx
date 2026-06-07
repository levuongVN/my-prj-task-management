import { AlertTriangle, Clock3 } from "lucide-react";
import { getPriorityStyle, getStatusStyle } from "../../utils/taskStyle";
import type { Task } from "../../types/Task";

interface TaskListProps {
    tasks: Task[]
}

export default function TaskList({ tasks }: TaskListProps) {

    return (
        <section className="rounded-[32px] border border-white/5 bg-[#0b0b0b] p-8">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">
                        Ongoing Tasks
                    </h2>

                    <p className="mt-2 text-zinc-500 leading-7">
                        Track your active work and progress in real-time.
                    </p>
                </div>

                <button className="h-12 px-5 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition text-sm font-medium">
                    Manage Tasks
                </button>
            </div>

            <div className="mt-8 space-y-5">
                {tasks.map((task) => (
                    <div
                        key={task.title}
                        className="rounded-3xl border border-white/5 bg-white/[0.03] p-6 hover:bg-white/[0.05] transition"
                    >
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                            <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-3">
                                    <h3 className="text-xl font-semibold tracking-tight">
                                        {task.title}
                                    </h3>

                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityStyle(task.priority)}`}
                                    >
                                        {task.priority}
                                    </span>
                                </div>

                                <div className="mt-5 flex flex-wrap items-center gap-3">
                                    <span className="inline-flex items-center gap-2 text-sm text-zinc-400">
                                        <Clock3 size={16} />
                                        {task.due}
                                    </span>

                                    <span
                                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(task.status)}`}
                                    >
                                        <AlertTriangle size={14} />
                                        {task.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}