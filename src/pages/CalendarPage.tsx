import { useState } from "react";
import {
    ChevronLeft,
    ChevronRight,
    Plus,
    Calendar,
    Clock,
    Flag,
    AlertCircle,
    X,
} from "lucide-react";

// ─── Shared types ─────────────────────────────────────────────────────────────
export interface Project {
    id: number;
    name: string;
    description?: string;
    status: "active" | "completed" | "archived";
    due: string;
    progress: number;
    overdue?: boolean;
    taskIds: number[];
}

export interface Task {
    id: number;
    title: string;
    description?: string;
    status: string;
    due: string;
    priority: string;
}

// ─── Calendar-specific derived type ──────────────────────────────────────────
type CalendarEventType = "task" | "milestone" | "meeting" | "overdue";
type ViewMode = "day" | "week" | "month";

interface CalendarEvent {
    id: string;
    title: string;
    type: CalendarEventType;
    time?: string;
    projectName?: string;
    date: string;
    sourceType: "project" | "task";
    sourceId: number;
}

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_PROJECTS: Project[] = [
    { id: 1, name: "TaskFlow Redesign", status: "active", due: "2026-06-20", progress: 72, overdue: false, taskIds: [1, 2] },
    { id: 2, name: "API Integration", status: "active", due: "2026-06-01", progress: 40, overdue: true, taskIds: [3, 4] },
    { id: 3, name: "Analytics Dashboard", status: "active", due: "2026-07-15", progress: 18, overdue: false, taskIds: [5] },
    { id: 4, name: "User Onboarding V2", status: "completed", due: "2026-05-10", progress: 100, overdue: false, taskIds: [] },
    { id: 5, name: "Auth Refactor", status: "completed", due: "2026-04-28", progress: 100, overdue: false, taskIds: [] },
    { id: 6, name: "Legacy Import Tool", status: "archived", due: "2026-01-15", progress: 55, overdue: false, taskIds: [] },
];

const MOCK_TASKS: Task[] = [
    { id: 1, title: "API docs", status: "in-progress", due: "2026-06-04", priority: "medium" },
    { id: 2, title: "Review PR", status: "todo", due: "2026-06-05", priority: "low" },
    { id: 3, title: "Fix auth bug", status: "in-progress", due: "2026-06-10", priority: "high" },
    { id: 4, title: "v1.2 release", status: "todo", due: "2026-06-09", priority: "high" },
    { id: 5, title: "Analytics UI", status: "todo", due: "2026-06-16", priority: "medium" },
    { id: 6, title: "Write tests", status: "todo", due: "2026-06-16", priority: "medium" },
    { id: 7, title: "Deploy script", status: "todo", due: "2026-06-16", priority: "low" },
    { id: 8, title: "Onboarding flow", status: "in-progress", due: "2026-06-12", priority: "high" },
    { id: 9, title: "Perf audit", status: "todo", due: "2026-06-23", priority: "medium" },
    { id: 10, title: "Deploy v1.3", status: "todo", due: "2026-06-29", priority: "high" },
];

const MOCK_MEETINGS: Task[] = [
    { id: 101, title: "Standup 9am", status: "meeting", due: "2026-06-04", priority: "meeting" },
    { id: 102, title: "Design review", status: "meeting", due: "2026-06-10", priority: "meeting" },
    { id: 103, title: "Sprint planning", status: "meeting", due: "2026-06-15", priority: "meeting" },
    { id: 104, title: "Client call", status: "meeting", due: "2026-06-19", priority: "meeting" },
    { id: 105, title: "Retro", status: "meeting", due: "2026-06-24", priority: "meeting" },
    { id: 106, title: "All-hands", status: "meeting", due: "2026-06-30", priority: "meeting" },
];

const MEETING_TIMES: Record<number, string> = {
    101: "09:00", 102: "14:00", 103: "10:00",
    104: "11:00", 105: "16:00", 106: "10:00",
};

// ─── Derive CalendarEvents ────────────────────────────────────────────────────
function deriveCalendarEvents(projects: Project[], tasks: Task[], meetings: Task[]): CalendarEvent[] {
    const events: CalendarEvent[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const project of projects) {
        if (project.status === "archived") continue;
        const dueDate = new Date(project.due);
        const isOverdue = project.overdue || (dueDate < today && project.status !== "completed");
        events.push({
            id: `project-${project.id}`,
            title: project.name,
            type: isOverdue ? "overdue" : "milestone",
            date: project.due,
            sourceType: "project",
            sourceId: project.id,
        });
    }

    for (const task of tasks) {
        if (task.status === "done") continue;
        events.push({
            id: `task-${task.id}`,
            title: task.title,
            type: "task",
            date: task.due,
            sourceType: "task",
            sourceId: task.id,
        });
    }

    for (const meeting of meetings) {
        events.push({
            id: `meeting-${meeting.id}`,
            title: meeting.title,
            type: "meeting",
            time: MEETING_TIMES[meeting.id],
            date: meeting.due,
            sourceType: "task",
            sourceId: meeting.id,
        });
    }

    return events;
}

// ─── Styles & icons ───────────────────────────────────────────────────────────
const EVENT_STYLES: Record<CalendarEventType, { bg: string; text: string; dot: string }> = {
    task: { bg: "bg-blue-500/15", text: "text-blue-400", dot: "bg-blue-400" },
    milestone: { bg: "bg-purple-500/15", text: "text-purple-400", dot: "bg-purple-400" },
    meeting: { bg: "bg-teal-500/15", text: "text-teal-400", dot: "bg-teal-400" },
    overdue: { bg: "bg-red-500/15", text: "text-red-400", dot: "bg-red-400" },
};

const EVENT_ICONS: Record<CalendarEventType, React.ReactNode> = {
    task: <Clock size={11} />,
    milestone: <Flag size={11} />,
    meeting: <Calendar size={11} />,
    overdue: <AlertCircle size={11} />,
};

// ─── Date helpers ─────────────────────────────────────────────────────────────
const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function toDateStr(year: number, month: number, day: number): string {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function buildMonthDays(year: number, month: number) {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    const days: { date: string; day: number; isCurrentMonth: boolean }[] = [];

    for (let i = firstDay - 1; i >= 0; i--)
        days.push({ date: toDateStr(year, month - 1, daysInPrevMonth - i), day: daysInPrevMonth - i, isCurrentMonth: false });
    for (let d = 1; d <= daysInMonth; d++)
        days.push({ date: toDateStr(year, month, d), day: d, isCurrentMonth: true });
    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++)
        days.push({ date: toDateStr(year, month + 1, d), day: d, isCurrentMonth: false });

    return days;
}

function buildWeekDays(year: number, month: number, weekStartDay: number) {
    // weekStartDay = 0-indexed day of month for Sunday of this week
    const days: { date: string; day: number; label: string }[] = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(year, month, weekStartDay + i);
        days.push({
            date: toDateStr(d.getFullYear(), d.getMonth(), d.getDate()),
            day: d.getDate(),
            label: DAYS_OF_WEEK[d.getDay()],
        });
    }
    return days;
}

// ─── Create Event Modal ───────────────────────────────────────────────────────
interface CreateEventForm {
    title: string;
    date: string;
    time: string;
    type: CalendarEventType;
    projectId: string;
}

function CreateEventModal({
    isOpen,
    onClose,
    defaultDate,
}: {
    isOpen: boolean;
    onClose: () => void;
    defaultDate: string;
}) {
    const [form, setForm] = useState<CreateEventForm>({
        title: "",
        date: defaultDate,
        time: "",
        type: "task",
        projectId: "",
    });

    if (!isOpen) return null;

    const activeProjects = MOCK_PROJECTS.filter((p) => p.status === "active");

    const handleSubmit = () => {
        // TODO: connect to API
        console.log("Create event:", form);
        onClose();
    };

    const inputClass = "w-full rounded-xl border border-white/10 bg-black px-4 py-2.5 text-sm text-white outline-none focus:border-white/25 transition-colors placeholder:text-zinc-600";
    const labelClass = "mb-1.5 block text-xs font-medium text-zinc-500";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#161616] p-6 shadow-2xl">
                {/* Header */}
                <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-base font-medium text-white">New Event</h2>
                    <button
                        onClick={onClose}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-500 hover:bg-white/8 hover:text-zinc-300 transition-colors"
                    >
                        <X size={15} />
                    </button>
                </div>

                <div className="space-y-4">
                    {/* Title */}
                    <div>
                        <label className={labelClass}>Title</label>
                        <input
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            placeholder="Event title..."
                            className={inputClass}
                        />
                    </div>

                    {/* Date + Time */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className={labelClass}>Date</label>
                            <input
                                type="date"
                                value={form.date}
                                onChange={(e) => setForm({ ...form, date: e.target.value })}
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Time <span className="text-zinc-700">(optional)</span></label>
                            <input
                                type="time"
                                value={form.time}
                                onChange={(e) => setForm({ ...form, time: e.target.value })}
                                className={inputClass}
                            />
                        </div>
                    </div>

                    {/* Type */}
                    <div>
                        <label className={labelClass}>Type</label>
                        <div className="grid grid-cols-4 gap-2">
                            {(["task", "milestone", "meeting", "overdue"] as CalendarEventType[]).map((t) => {
                                const s = EVENT_STYLES[t];
                                const isSelected = form.type === t;
                                return (
                                    <button
                                        key={t}
                                        onClick={() => setForm({ ...form, type: t })}
                                        className={`flex flex-col items-center gap-1.5 rounded-xl border py-2.5 text-[11px] font-medium capitalize transition-all ${isSelected
                                                ? `${s.bg} ${s.text} border-current/30`
                                                : "border-white/8 bg-white/4 text-zinc-600 hover:border-white/15 hover:text-zinc-400"
                                            }`}
                                    >
                                        <span className={isSelected ? s.text : "text-zinc-600"}>
                                            {EVENT_ICONS[t]}
                                        </span>
                                        {t}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Project link */}
                    <div>
                        <label className={labelClass}>Project <span className="text-zinc-700">(optional)</span></label>
                        <select
                            value={form.projectId}
                            onChange={(e) => setForm({ ...form, projectId: e.target.value })}
                            className={`${inputClass} appearance-none`}
                        >
                            <option value="">No project</option>
                            {activeProjects.map((p) => (
                                <option key={p.id} value={String(p.id)}>
                                    {p.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-6 flex items-center justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!form.title || !form.date}
                        className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-black hover:bg-zinc-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        Create event
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Event pill (shared) ──────────────────────────────────────────────────────
function EventPill({ event }: { event: CalendarEvent }) {
    const s = EVENT_STYLES[event.type];
    return (
        <div className={`flex items-center gap-1 rounded-md px-1.5 py-[3px] text-[11px] font-medium cursor-pointer overflow-hidden ${s.bg} ${s.text}`}>
            <span className="flex-shrink-0 opacity-70">{EVENT_ICONS[event.type]}</span>
            <span className="truncate">{event.title}</span>
            {event.time && <span className="ml-auto flex-shrink-0 opacity-60">{event.time}</span>}
        </div>
    );
}

// ─── Month View ───────────────────────────────────────────────────────────────
function MonthView({
    year, month, allEvents, todayDate, onDayClick,
}: {
    year: number; month: number; allEvents: CalendarEvent[]; todayDate: string;
    onDayClick: (date: string) => void;
}) {
    const [hoveredDay, setHoveredDay] = useState<string | null>(null);
    const days = buildMonthDays(year, month);

    const getEventsForDate = (date: string) => allEvents.filter((e) => e.date === date);
    const getDefaultEvents = (events: CalendarEvent[]) =>
        events.filter((e) => e.type === "overdue" || e.type === "milestone" || e.type === "meeting");

    return (
        <div className="overflow-hidden rounded-xl border border-white/15">
            <div className="grid grid-cols-7 border-b border-white/15 bg-[#141414]">
                {DAYS_OF_WEEK.map((d) => (
                    <div key={d} className="py-2.5 text-center text-[11px] font-medium uppercase tracking-wider text-zinc-700">
                        {d}
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-7">
                {days.map(({ date, day, isCurrentMonth }, idx) => {
                    const allDayEvents = getEventsForDate(date);
                    const isToday = date === todayDate;
                    const isHovered = hoveredDay === date;
                    const defaultVisible = getDefaultEvents(allDayEvents).slice(0, 2);
                    const visibleEvents = isHovered ? allDayEvents : defaultVisible;
                    const hiddenCount = isHovered ? 0 : Math.max(0, allDayEvents.length - defaultVisible.length);

                    return (
                        <div
                            key={idx}
                            onMouseEnter={() => isCurrentMonth && setHoveredDay(date)}
                            onMouseLeave={() => setHoveredDay(null)}
                            onClick={() => isCurrentMonth && onDayClick(date)}
                            className={`relative min-h-[100px] border-b border-r border-white/10 p-2 last:border-r-0 transition-colors duration-150 ${isHovered ? "bg-[#1c1c1c]" : isToday ? "bg-[#141414]" : "bg-[#111]"
                                } ${!isCurrentMonth ? "opacity-30" : "cursor-pointer"}`}
                        >
                            <div className={`mb-1.5 flex h-[22px] w-[22px] items-center justify-center rounded-md text-xs font-medium transition-colors ${isToday ? "bg-white text-black" : isHovered ? "text-white" : "text-zinc-600"
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

// ─── Week View ────────────────────────────────────────────────────────────────
function WeekView({
    year, month, weekStartDay, allEvents, todayDate, onDayClick,
}: {
    year: number; month: number; weekStartDay: number; allEvents: CalendarEvent[]; todayDate: string;
    onDayClick: (date: string) => void;
}) {
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
                            <span className={`flex h-6 w-6 items-center justify-center rounded-md text-xs font-medium ${isToday ? "bg-white text-black" : "text-zinc-400"
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
                    const events = getEventsForDate(date);
                    const isToday = date === todayDate;
                    return (
                        <div
                            key={date}
                            onClick={() => onDayClick(date)}
                            className={`min-h-[160px] border-r border-white/10 p-2 last:border-r-0 cursor-pointer transition-colors hover:bg-[#1c1c1c] ${isToday ? "bg-[#141414]" : "bg-[#111]"
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

// ─── Day View ─────────────────────────────────────────────────────────────────
function DayView({
    date, allEvents, onNewEvent,
}: {
    date: string; allEvents: CalendarEvent[]; onNewEvent: () => void;
}) {
    const events = allEvents.filter((e) => e.date === date);
    const [y, m, d] = date.split("-").map(Number);
    const label = `${DAYS_OF_WEEK[new Date(y, m - 1, d).getDay()]}, ${MONTH_NAMES[m - 1]} ${d}`;

    // Group by type for nicer display
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
                <p className="mt-0.5 text-xs text-zinc-600">{events.length} event{events.length !== 1 ? "s" : ""}</p>
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

// ─── Page component ───────────────────────────────────────────────────────────
const TODAY_DATE = "2026-06-07";
export default function CalendarPage() {
    const [view, setView] = useState<ViewMode>("month");
    const [year, setYear] = useState(2026);
    const [month, setMonth] = useState(5); // 0-indexed
    const [selectedDate, setSelectedDate] = useState(TODAY_DATE);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalDefaultDate, setModalDefaultDate] = useState(TODAY_DATE);

    const allEvents = deriveCalendarEvents(MOCK_PROJECTS, MOCK_TASKS, MOCK_MEETINGS);

    // ── Navigation ──────────────────────────────────────────────────────────
    const goBack = () => {
        if (view === "month") {
            if (month === 0) { setMonth(11); setYear(y => y - 1); }
            else setMonth(m => m - 1);
        } else if (view === "week") {
            const d = new Date(year, month, weekStartDay - 7);
            setYear(d.getFullYear()); setMonth(d.getMonth());
            setWeekStartDay(d.getDate());
        } else {
            const d = new Date(year, month, selectedDayNum - 1);
            setSelectedDate(toDateStr(d.getFullYear(), d.getMonth(), d.getDate()));
        }
    };

    const goForward = () => {
        if (view === "month") {
            if (month === 11) { setMonth(0); setYear(y => y + 1); }
            else setMonth(m => m + 1);
        } else if (view === "week") {
            const d = new Date(year, month, weekStartDay + 7);
            setYear(d.getFullYear()); setMonth(d.getMonth());
            setWeekStartDay(d.getDate());
        } else {
            const d = new Date(year, month, selectedDayNum + 1);
            setSelectedDate(toDateStr(d.getFullYear(), d.getMonth(), d.getDate()));
        }
    };

    const goToday = () => {
        setYear(2026); setMonth(5); setSelectedDate(TODAY_DATE);
        const todayObj = new Date(2026, 5, 7);
        setWeekStartDay(7 - todayObj.getDay()); // Sunday of current week
    };

    // ── Week state ───────────────────────────────────────────────────────────
    // weekStartDay = day-of-month for Sunday of displayed week (can be negative for prev month)
    const todayObj = new Date(2026, 5, 7);
    const [weekStartDay, setWeekStartDay] = useState(7 - todayObj.getDay()); // Sun Jun 1

    // ── Day state ────────────────────────────────────────────────────────────
    const [, , dayStr] = selectedDate.split("-");
    const selectedDayNum = parseInt(dayStr, 10);

    // ── Label ────────────────────────────────────────────────────────────────
    const navLabel = view === "month"
        ? `${MONTH_NAMES[month]} ${year}`
        : view === "week"
            ? (() => {
                const days = buildWeekDays(year, month, weekStartDay);
                const first = days[0]; const last = days[6];
                return `${first.day} – ${last.day} ${MONTH_NAMES[month]} ${year}`;
            })()
            : (() => {
                const [y, m, d] = selectedDate.split("-").map(Number);
                return `${MONTH_NAMES[m - 1]} ${d}, ${y}`;
            })();

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
                <MonthView
                    year={year} month={month}
                    allEvents={allEvents} todayDate={TODAY_DATE}
                    onDayClick={handleDayClick}
                />
            )}
            {view === "week" && (
                <WeekView
                    year={year} month={month} weekStartDay={weekStartDay}
                    allEvents={allEvents} todayDate={TODAY_DATE}
                    onDayClick={handleDayClick}
                />
            )}
            {view === "day" && (
                <DayView
                    date={selectedDate}
                    allEvents={allEvents}
                    onNewEvent={() => handleNewEvent(selectedDate)}
                />
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

            {/* Create event modal */}
            <CreateEventModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                defaultDate={modalDefaultDate}
            />
        </div>
    );
}