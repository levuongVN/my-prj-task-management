import { useState } from "react";
import type { CalendarEvent } from "../../../shared/types/Calendar";
import { DAYS_OF_WEEK } from "../../../constants/calendarConst";
import { buildMonthDays } from "../../utils/dateHelper";
import EventPill from "./EventPill.tsx";

interface Props {
    year: number;
    month: number;
    allEvents: CalendarEvent[];
    todayDate: string;
    onDayClick: (date: string) => void;
}

export default function MonthView({ year, month, allEvents, todayDate, onDayClick }: Props) {
    const [hoveredDay, setHoveredDay] = useState<string | null>(null);
    const days = buildMonthDays(year, month);

    const getEventsForDate  = (date: string) => allEvents.filter((e) => e.date === date);
    const getDefaultEvents  = (events: CalendarEvent[]) =>
        events.filter((e) => e.type === "overdue" || e.type === "milestone" || e.type === "meeting");

    return (
        <div className="overflow-hidden rounded-xl border border-white/15">
            {/* Day headers */}
            <div className="grid grid-cols-7 border-b border-white/15 bg-[#141414]">
                {DAYS_OF_WEEK.map((d) => (
                    <div key={d} className="py-2.5 text-center text-[11px] font-medium uppercase tracking-wider text-zinc-700">
                        {d}
                    </div>
                ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7">
                {days.map(({ date, day, isCurrentMonth }, idx) => {
                    const allDayEvents   = getEventsForDate(date);
                    const isToday        = date === todayDate;
                    const isHovered      = hoveredDay === date;
                    const defaultVisible = getDefaultEvents(allDayEvents).slice(0, 2);
                    const visibleEvents  = isHovered ? allDayEvents : defaultVisible;
                    const hiddenCount    = isHovered ? 0 : Math.max(0, allDayEvents.length - defaultVisible.length);

                    return (
                        <div
                            key={idx}
                            onMouseEnter={() => isCurrentMonth && setHoveredDay(date)}
                            onMouseLeave={() => setHoveredDay(null)}
                            onClick={() => isCurrentMonth && onDayClick(date)}
                            className={`relative min-h-[100px] border-b border-r border-white/10 p-2 last:border-r-0 transition-colors duration-150 ${
                                isHovered ? "bg-[#1c1c1c]" : isToday ? "bg-[#141414]" : "bg-[#111]"
                            } ${!isCurrentMonth ? "opacity-30" : "cursor-pointer"}`}
                        >
                            <div className={`mb-1.5 flex h-[22px] w-[22px] items-center justify-center rounded-md text-xs font-medium transition-colors ${
                                isToday ? "bg-white text-black" : isHovered ? "text-white" : "text-zinc-600"
                            }`}>
                                {day}
                            </div>
                            <div className="space-y-0.5">
                                {visibleEvents.map((event) => <EventPill key={event.id} event={event} />)}
                                {hiddenCount > 0 && (
                                    <p className="px-1 text-[10px] text-zinc-600">+{hiddenCount} more</p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}