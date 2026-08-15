import Loading from "../../../shared/components/Ui/Loading";
import { EVENT_STYLES } from "../../../constants/calendarConst";
import type { CalendarEvent } from "../../../shared/types/Calendar";

interface Props {
    events: CalendarEvent[];
    isLoading: boolean;
    onEventClick: (e: CalendarEvent) => void;
    onNavigateToDate: (date: string) => void;
}

const getDisplayDate = (event: CalendarEvent) => {
    if (event.time) return event.time;

    if (!event.date) return "—";

    try {
        const [y, m, d] = event.date.split("-").map(Number);
        const date = new Date(y, m - 1, d);
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch {
        return "—";
    }
};

export function UpcomingPanel({ events, isLoading, onEventClick, onNavigateToDate }: Props) {
    return (
        <div className="mt-5 rounded-xl border border-white/15 bg-[#141414] p-4">
            <p className="mb-3 text-[11px] font-medium uppercase tracking-widest text-zinc-700">Upcoming</p>
            {
                isLoading ? (
                    <div className="flex h-[100px] items-center justify-center">
                        <Loading text="Loading events..." />
                    </div>
                ) : events.length === 0 ? (
                    <p className="text-sm text-zinc-600">No upcoming events</p>
                ) : (
                    <div className="space-y-0.5">
                        {events.map((event) => {
                            const s = EVENT_STYLES[event.type];
                            const displayDate = getDisplayDate(event);
                            return (
                                <div
                                    key={event.id}
                                    onClick={() => {
                                        if (event.sourceType === "meeting") {
                                            onEventClick(event);
                                        } else {
                                            onNavigateToDate(event.date.split("T")[0]);
                                        }
                                    }}
                                    className="flex items-center gap-3 rounded-lg px-2 py-2.5 hover:bg-white/4 transition-colors cursor-pointer"
                                >
                                    <div className={`h-2 w-2 flex-shrink-0 rounded-full ${s.dot}`} />
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm text-zinc-300">{event.title}</p>
                                        <p className="text-xs text-zinc-600 mt-0.5 capitalize">
                                            {event.type}{event.projectName ? ` · ${event.projectName}` : ""}
                                        </p>
                                    </div>
                                    <span className="flex-shrink-0 text-xs text-zinc-600">{displayDate}</span>
                                </div>
                            );
                        })}
                    </div>
                )
            }
        </div>
    );
}
