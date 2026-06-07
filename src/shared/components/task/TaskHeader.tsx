import { Plus } from "lucide-react";
import Button from "../../../shared/components/Ui/Button";

interface Props {
    onCreateTask: () => void;
}

export default function TaskHeader(
    { onCreateTask }: Props
) {
    return (
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">
            <div>
                <p className="uppercase tracking-[0.3em] text-zinc-500 text-sm mb-2">
                    Task Management
                </p>

                <h1 className="text-4xl font-bold tracking-tight">
                    Manage Your Tasks
                </h1>

                <p className="text-zinc-400 mt-2">
                    Organize, prioritize and track your workflow efficiently.
                </p>
            </div>

            <Button
                variant="secondary"
                className="h-14 px-6 rounded-2xl bg-white text-black font-semibold flex items-center gap-2"
                onClick={onCreateTask}
            >
                <Plus size={20} />
                Create Task
            </Button>
        </div>
    )
}