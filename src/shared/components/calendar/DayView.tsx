import { Plus } from "lucide-react";
import type { CalendarEvent, CalendarEventType } from "../../../shared/types/Calendar";
import { DAYS_OF_WEEK, MONTH_NAMES, EVENT_STYLES, EVENT_ICONS } from "../../../constants/calendarConst";

interface Props {
    date: string;
    allEvents: CalendarEvent[];
    onNewEvent: () => void;
}

export default function DayView({ date, allEvents, onNewEvent }: Props) {
    const events = allEvents.filter(
        (e) => e.date.split("T")[0] === date
    );

    const [y, m, d] = date.split("-").map(Number);
    const label = `${DAYS_OF_WEEK[new Date(y, m - 1, d).getDay()]}, ${MONTH_NAMES[m - 1]} ${d}`;

    // Group by type
    const grouped: Partial<Record<CalendarEventType, CalendarEvent[]>> = {};
    for (const e of events) {
        if (!grouped[e.type]) grouped[e.type] = [];
        grouped[e.type]!.push(e);
    }

    return (
        <div className="overflow-hidden rounded-xl border border-white/15">
            {/* Header */}
            <div className="border-b border-white/15 bg-[#141414] px-5 py-4">
                <p className="text-sm font-medium text-white">{label}</p>
                <p className="mt-0.5 text-xs text-zinc-600">
                    {events.length} event{events.length !== 1 ? "s" : ""}
                </p>
            </div>

            {/* Events list */}
            <div className="bg-[#111] p-4">
                {events.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <p className="text-sm text-zinc-700">No events on this day</p>
                        <button
                            onClick={onNewEvent}
                            className="mt-3 flex items-center gap-1.5 rounded-xl border border-white/10 px-3.5 py-2 text-xs font-medium text-zinc-500 hover:text-zinc-300 transition-colors"
                        >
                            <Plus size={12} /> Add event
                        </button>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {(["meeting", "milestone", "overdue", "task"] as CalendarEventType[]).map((type) => {
                            const group = grouped[type];
                            if (!group?.length) return null;
                            const s = EVENT_STYLES[type];
                            return (
                                <div key={type}>
                                    <p className={`mb-1.5 text-[10px] font-medium uppercase tracking-wider ${s.text} opacity-60`}>
                                        {type}
                                    </p>
                                    <div className="space-y-1.5">
                                        {group.map((event) => (
                                            <div
                                                key={event.id}
                                                className={`flex items-center gap-3 rounded-xl border border-white/6 px-4 py-3 ${s.bg} cursor-pointer hover:border-white/12 transition-colors`}
                                            >
                                                <span className={s.text}>{EVENT_ICONS[type]}</span>
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-sm font-medium ${s.text}`}>{event.title}</p>
                                                    {event.projectName && (
                                                        <p className="mt-0.5 text-xs text-zinc-600">{event.projectName}</p>
                                                    )}
                                                </div>
                                                {event.time && (
                                                    <span className={`text-xs font-medium ${s.text} opacity-70`}>{event.time}</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}