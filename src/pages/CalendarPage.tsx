import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import type { ViewMode, CalendarEventType } from "../shared/types/Calendar";

import MonthView from "../shared/components/calendar/MonthView";
import WeekView from "../shared/components/calendar/WeekView";
import DayView from "../shared/components/calendar/DayView";
import { buildWeekDays, getTodayDateStr, toDateStr } from "../shared/utils/dateHelper";
import { deriveCalendarEvents } from "../shared/utils/deriveCalendarEvents";
import Modal from "../shared/components/Ui/Modal";
import EventForm from "../shared/components/calendar/eventForm";
import { MONTH_NAMES, EVENT_STYLES } from "../constants/calendarConst";
import { MOCK_PROJECTS, MOCK_MEETINGS, TASKS_MOCK } from "../mocks/calendarMock";
import { FormProvider, useForm } from "react-hook-form";
import { eventSchema, type EventFormValues } from "../features/calendar/schemals/event.schema";
import { zodResolver } from "@hookform/resolvers/zod";

const TODAY_DATE = getTodayDateStr();

export default function CalendarPage() {
    const [view, setView] = useState<ViewMode>("month");
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth()); // 0-indexed
    const [selectedDate, setSelectedDate] = useState(TODAY_DATE);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalDefaultDate, setModalDefaultDate] = useState(TODAY_DATE);

    // weekStartDay = day-of-month for Sunday of the displayed week
    const todayObj = new Date();
    const [weekStartDay, setWeekStartDay] = useState(todayObj.getDate() - todayObj.getDay());

    const eventForm = useForm<EventFormValues>({
        resolver: zodResolver(eventSchema),
        defaultValues: {
            title: "",
            date: modalDefaultDate,
            time: "",
            type: "task",
            projectId: "",
        },
    });

function handleSubmit(data: EventFormValues) {
    console.log("New event data:", data);
    setIsModalOpen(false);
}

    const allEvents = deriveCalendarEvents(MOCK_PROJECTS, TASKS_MOCK, MOCK_MEETINGS);

    const [, , dayStr] = selectedDate.split("-");
    const selectedDayNum = parseInt(dayStr, 10);

    // ── Navigation ────────────────────────────────────────────────────────────
    const goBack = () => {
        if (view === "month") {
            if (month === 0) { setMonth(11); setYear((y) => y - 1); }
            else setMonth((m) => m - 1);
        } else if (view === "week") {
            const d = new Date(year, month, weekStartDay - 7);
            setYear(d.getFullYear()); setMonth(d.getMonth()); setWeekStartDay(d.getDate());
        } else {
            const d = new Date(year, month, selectedDayNum - 1);
            setSelectedDate(toDateStr(d.getFullYear(), d.getMonth(), d.getDate()));
        }
    };

    const goForward = () => {
        if (view === "month") {
            if (month === 11) { setMonth(0); setYear((y) => y + 1); }
            else setMonth((m) => m + 1);
        } else if (view === "week") {
            const d = new Date(year, month, weekStartDay + 7);
            setYear(d.getFullYear()); setMonth(d.getMonth()); setWeekStartDay(d.getDate());
        } else {
            const d = new Date(year, month, selectedDayNum + 1);
            setSelectedDate(toDateStr(d.getFullYear(), d.getMonth(), d.getDate()));
        }
    };

    const goToday = () => {
        const t = new Date();
        setYear(t.getFullYear());
        setMonth(t.getMonth());
        setSelectedDate(TODAY_DATE);
        setWeekStartDay(t.getDate() - t.getDay());
    };

    // ── Nav label ─────────────────────────────────────────────────────────────
    const navLabel = view === "month"
        ? `${MONTH_NAMES[month]} ${year}`
        : view === "week"
            ? (() => {
                const days = buildWeekDays(year, month, weekStartDay);
                return `${days[0].day} – ${days[6].day} ${MONTH_NAMES[month]} ${year}`;
            })()
            : (() => {
                const [y, m, d] = selectedDate.split("-").map(Number);
                return `${MONTH_NAMES[m - 1]} ${d}, ${y}`;
            })();

    // ── Handlers ──────────────────────────────────────────────────────────────
    const handleDayClick = (date: string) => {
        setSelectedDate(date);
        if (view === "month") setView("day");
    };

    const handleNewEvent = (date?: string) => {
        setModalDefaultDate(date ?? selectedDate);
        setIsModalOpen(true);
    };

    const upcomingEvents = allEvents
        .filter((e) => e.date >= TODAY_DATE)
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(0, 5);

    return (
        <div className="min-h-screen bg-[#0d0d0d] px-7 py-7 font-sans">
            {/* Page header */}
            <div className="mb-6 flex items-end justify-between">
                <div>
                    <p className="mb-1.5 text-[11px] font-medium uppercase tracking-widest text-zinc-600">Schedule</p>
                    <h1 className="text-[22px] font-medium text-white">Calendar</h1>
                    <p className="mt-1 text-sm text-zinc-600">Manage your events, tasks and milestones.</p>
                </div>
                <div className="flex items-center gap-2">
                    {/* View switcher */}
                    <div className="flex items-center gap-0.5 rounded-xl border border-white/8 bg-[#1a1a1a] p-1">
                        {(["day", "week", "month"] as ViewMode[]).map((v) => (
                            <button
                                key={v}
                                onClick={() => setView(v)}
                                className={`rounded-[9px] px-3.5 py-1.5 text-xs font-medium capitalize transition-all ${view === v ? "bg-white text-black" : "text-zinc-500 hover:text-zinc-300"
                                    }`}
                            >
                                {v}
                            </button>
                        ))}
                    </div>
                    <button onClick={goToday} className="rounded-xl border border-white/10 bg-transparent px-3.5 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors">
                        Today
                    </button>
                    <button
                        onClick={() => handleNewEvent()}
                        className="flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-sm font-medium text-black hover:bg-zinc-200 transition-colors"
                    >
                        <Plus size={14} /> New event
                    </button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={goBack} className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/8 bg-[#1a1a1a] text-zinc-500 hover:text-zinc-300 transition-colors">
                        <ChevronLeft size={14} />
                    </button>
                    <span className="min-w-[160px] text-center text-base font-medium text-white">{navLabel}</span>
                    <button onClick={goForward} className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/8 bg-[#1a1a1a] text-zinc-500 hover:text-zinc-300 transition-colors">
                        <ChevronRight size={14} />
                    </button>
                </div>
                {/* Legend */}
                <div className="flex items-center gap-4">
                    {(Object.entries(EVENT_STYLES) as [CalendarEventType, typeof EVENT_STYLES[CalendarEventType]][]).map(([type, style]) => (
                        <div key={type} className="flex items-center gap-1.5">
                            <div className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                            <span className="text-xs capitalize text-zinc-600">{type}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Views */}
            {view === "month" && (
                <MonthView year={year} month={month} allEvents={allEvents} todayDate={TODAY_DATE} onDayClick={handleDayClick} />
            )}
            {view === "week" && (
                <WeekView year={year} month={month} weekStartDay={weekStartDay} allEvents={allEvents} todayDate={TODAY_DATE} onDayClick={handleDayClick} />
            )}
            {view === "day" && (
                <DayView date={selectedDate} allEvents={allEvents} onNewEvent={() => handleNewEvent(selectedDate)} />
            )}

            {/* Upcoming panel */}
            <div className="mt-5 rounded-xl border border-white/15 bg-[#141414] p-4">
                <p className="mb-3 text-[11px] font-medium uppercase tracking-widest text-zinc-700">Upcoming</p>
                <div className="space-y-0.5">
                    {upcomingEvents.map((event) => {
                        const s = EVENT_STYLES[event.type];
                        const [, , day] = event.date.split("-");
                        const displayDate = event.time ?? `Jun ${parseInt(day, 10)}`;
                        return (
                            <div
                                key={event.id}
                                onClick={() => { setSelectedDate(event.date); setView("day"); }}
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
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}
                title="Create new event"

                submitText="Create"
            >
                <FormProvider {...eventForm}>
                    <EventForm onSubmit={handleSubmit} />
                </FormProvider>
            </Modal>
        </div>
    );
}