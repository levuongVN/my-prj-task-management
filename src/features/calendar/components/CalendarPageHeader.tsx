import { Plus } from "lucide-react";
import type { ViewMode } from "../../../shared/types/Calendar";

interface Props {
    view: ViewMode;
    onViewChange: (v: ViewMode) => void;
    onGoToday: () => void;
    onNewEvent: () => void;
}

export function CalendarPageHeader({ view, onViewChange, onGoToday, onNewEvent }: Props) {
    return (
        <div className="mb-6 flex items-end justify-between">
            <div>
                <p className="mb-1.5 text-[11px] font-medium uppercase tracking-widest text-zinc-600">Schedule</p>
                <h1 className="text-[22px] font-medium text-white">Calendar</h1>
                <p className="mt-1 text-sm text-zinc-600">Manage your events, tasks and milestones.</p>
            </div>
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5 rounded-xl border border-white/8 bg-[#1a1a1a] p-1">
                    {(["day", "week", "month"] as ViewMode[]).map((v) => (
                        <button
                            key={v}
                            onClick={() => onViewChange(v)}
                            className={`rounded-[9px] px-3.5 py-1.5 text-xs font-medium capitalize transition-all ${view === v ? "bg-accent text-accent-fg" : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"}`}
                        >
                            {v}
                        </button>
                    ))}
                </div>
                <button onClick={onGoToday} className="rounded-xl border border-white/10 bg-transparent px-3.5 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors">
                    Today
                </button>
                <button
                    onClick={onNewEvent}
                    className="flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-sm font-medium text-black hover:bg-zinc-200 transition-colors"
                >
                    <Plus size={14} /> New event
                </button>
            </div>
        </div>
    );
}
