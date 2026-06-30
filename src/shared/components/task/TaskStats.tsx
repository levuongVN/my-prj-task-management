import { statuses } from "../../../constants/taskOption"
import type { Task } from "../../types/Task"


interface Props {
    tasks: Task[]
}

export default function TaskStats({ tasks }: Props) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            <div className="rounded-3xl border border-white/5 bg-zinc-950 p-6">
                <p className="text-zinc-400 text-sm">Total Tasks</p>

                <h2 className="text-4xl font-bold mt-3">
                    {tasks.length}
                </h2>
            </div>

            <div className="rounded-3xl border border-white/5 bg-zinc-950 p-6">
                <p className="text-zinc-400 text-sm">In Progress</p>

                <h2 className="text-4xl font-bold mt-3 text-blue-400">
                    {
                        tasks.filter(
                            (task) =>
                                statuses[task.status] === "In Progress"
                        ).length
                    }
                </h2>
            </div>

            <div className="rounded-3xl border border-white/5 bg-zinc-950 p-6">
                <p className="text-zinc-400 text-sm">Completed</p>

                <h2 className="text-4xl font-bold mt-3 text-emerald-400">
                    {
                        tasks.filter(
                            (task) =>
                                statuses[task.status] === "Completed"
                        ).length
                    }
                </h2>
            </div>
        </div>
    )
}