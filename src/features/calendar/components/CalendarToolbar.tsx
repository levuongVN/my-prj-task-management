import { ChevronLeft, ChevronRight } from "lucide-react";
import { EVENT_STYLES } from "../../../constants/calendarConst";
import type { CalendarEventType } from "../../../shared/types/Calendar";

interface Props {
    navLabel: string;
    onBack: () => void;
    onForward: () => void;
}

export function CalendarToolbar({ navLabel, onBack, onForward }: Props) {
    return (
        <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <button onClick={onBack} className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/8 bg-[#1a1a1a] text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-colors">
                    <ChevronLeft size={14} />
                </button>
                <span className="min-w-[160px] text-center text-base font-medium text-white">{navLabel}</span>
                <button onClick={onForward} className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/8 bg-[#1a1a1a] text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-colors">
                    <ChevronRight size={14} />
                </button>
            </div>
            <div className="flex items-center gap-4">
                {(Object.entries(EVENT_STYLES) as [CalendarEventType, typeof EVENT_STYLES[CalendarEventType]][]).map(([type, style]) => (
                    <div key={type} className="flex items-center gap-1.5">
                        <div className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                        <span className="text-xs capitalize text-zinc-600">{type}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
