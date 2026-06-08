import type { CalendarEvent } from "../../../shared/types/Calendar";
import { buildWeekDays } from "../../utils/dateHelper";
import EventPill from "./EventPill";

interface Props {
    year: number;
    month: number;
    weekStartDay: number;
    allEvents: CalendarEvent[];
    todayDate: string;
    onDayClick: (date: string) => void;
}

export default function WeekView({ year, month, weekStartDay, allEvents, todayDate, onDayClick }: Props) {
    const days = buildWeekDays(year, month, weekStartDay);
    const getEventsForDate = (date: string) => allEvents.filter((e) => e.date === date);

    return (
        <div className="overflow-hidden rounded-xl border border-white/15">
            {/* Day headers */}
            <div className="grid grid-cols-7 border-b border-white/15 bg-[#141414]">
                {days.map(({ date, day, label }) => {
                    const isToday = date === todayDate;
                    return (
                        <div key={date} className="flex flex-col items-center gap-1 py-3">
                            <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-700">{label}</span>
                            <span className={`flex h-6 w-6 items-center justify-center rounded-md text-xs font-medium ${
                                isToday ? "bg-white text-black" : "text-zinc-400"
                            }`}>
                                {day}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Day columns */}
            <div className="grid grid-cols-7">
                {days.map(({ date }) => {
                    const events  = getEventsForDate(date);
                    const isToday = date === todayDate;
                    return (
                        <div
                            key={date}
                            onClick={() => onDayClick(date)}
                            className={`min-h-[160px] border-r border-white/10 p-2 last:border-r-0 cursor-pointer transition-colors hover:bg-[#1c1c1c] ${
                                isToday ? "bg-[#141414]" : "bg-[#111]"
                            }`}
                        >
                            <div className="space-y-0.5">
                                {events.length === 0 && (
                                    <p className="px-1 pt-2 text-center text-[10px] text-zinc-800">—</p>
                                )}
                                {events.map((event) => <EventPill key={event.id} event={event} />)}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}