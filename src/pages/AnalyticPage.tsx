import { useEffect, useRef, useState } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
    TrendingUp,
    TrendingDown,
    CheckCircle2,
    AlertCircle,
    Target,
    Activity,
    Users,
    Calendar,
    Check,
    ArrowUpRight,
    ArrowDownRight,
    ChevronLeft, ChevronRight,
    Zap,
} from "lucide-react";
import { useAnalytics } from "../features/analytics/hooks/useAnalytic";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Tooltip,
    Legend,
    Filler
);

// ── Types ─────────────────────────────────────────────────────────────────────

type PeriodKey = "week" | "month" | "quarter";



// ── Period helpers ─────────────────────────────────────────────────────────────

function getPeriodRange(period: PeriodKey, date: Date): [Date, Date] {
    const d = new Date(date);

    if (period === "week") {
        const day = d.getDay();
        const diffToMon = day === 0 ? -6 : 1 - day;
        const start = new Date(d);
        start.setDate(d.getDate() + diffToMon);
        start.setHours(0, 0, 0, 0);
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);
        return [start, end];
    }

    if (period === "month") {
        const start = new Date(d.getFullYear(), d.getMonth(), 1);
        const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
        return [start, end];
    }

    // quarter
    const q = Math.floor(d.getMonth() / 3);
    const start = new Date(d.getFullYear(), q * 3, 1);
    const end = new Date(d.getFullYear(), q * 3 + 3, 0, 23, 59, 59, 999);
    return [start, end];
}

function getDateLabel(period: PeriodKey, date: Date): string {
    if (period === "week") {
        const [start] = getPeriodRange("week", date);
        const tmp = new Date(start);
        tmp.setDate(tmp.getDate() + 3 - ((tmp.getDay() + 6) % 7));
        const week1 = new Date(tmp.getFullYear(), 0, 4);
        const weekNo =
            1 +
            Math.round(
                ((tmp.getTime() - week1.getTime()) / 86400000 -
                    3 +
                    ((week1.getDay() + 6) % 7)) /
                7
            );
        return `Week ${weekNo}, ${start.getFullYear()}`;
    }
    if (period === "month") {
        return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    }
    const q = Math.floor(date.getMonth() / 3) + 1;
    return `Q${q} ${date.getFullYear()}`;
}

function navigateDate(period: PeriodKey, date: Date, dir: "prev" | "next"): Date {
    const d = new Date(date);
    const delta = dir === "next" ? 1 : -1;
    if (period === "week") d.setDate(d.getDate() + delta * 7);
    else if (period === "month") d.setMonth(d.getMonth() + delta);
    else d.setMonth(d.getMonth() + delta * 3);
    return d;
}

function toReferenceDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function isSameDay(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isWithinRange(date: Date, start: Date, end: Date): boolean {
    const value = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    return value >= start.getTime() && value <= end.getTime();
}

function getCalendarDays(viewDate: Date): Date[] {
    const first = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
    const mondayOffset = (first.getDay() + 6) % 7;
    const start = new Date(first);
    start.setDate(first.getDate() - mondayOffset);

    return Array.from({ length: 42 }, (_, index) => {
        const day = new Date(start);
        day.setDate(start.getDate() + index);
        return day;
    });
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

type PeriodPickerProps = {
    period: PeriodKey;
    value: Date;
    onChange: (date: Date) => void;
    onNavigate: (direction: "prev" | "next") => void;
};

function PeriodPicker({ period, value, onChange, onNavigate }: PeriodPickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [viewDate, setViewDate] = useState(value);
    const rootRef = useRef<HTMLDivElement>(null);
    const [weekStart, weekEnd] = getPeriodRange("week", value);

    useEffect(() => {
        if (!isOpen) return;

        const closeOnOutsideClick = (event: MouseEvent) => {
            if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
        };
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") setIsOpen(false);
        };

        document.addEventListener("mousedown", closeOnOutsideClick);
        document.addEventListener("keydown", closeOnEscape);
        return () => {
            document.removeEventListener("mousedown", closeOnOutsideClick);
            document.removeEventListener("keydown", closeOnEscape);
        };
    }, [isOpen]);

    const openPicker = () => {
        setViewDate(value);
        setIsOpen((open) => !open);
    };

    const selectDate = (date: Date) => {
        onChange(date);
        setIsOpen(false);
    };

    const movePickerView = (direction: "prev" | "next") => {
        const delta = direction === "next" ? 1 : -1;
        setViewDate((current) => {
            if (period === "week") return new Date(current.getFullYear(), current.getMonth() + delta, 1);
            return new Date(current.getFullYear() + delta, current.getMonth(), 1);
        });
    };

    return (
        <div ref={rootRef} className="relative">
            <div className="flex items-center rounded-xl border border-white/8 bg-[#1a1a1a] p-1">
                <button
                    type="button"
                    onClick={() => onNavigate("prev")}
                    aria-label={`Previous ${period}`}
                    className="rounded-lg p-1.5 text-zinc-500 transition hover:bg-white/5 hover:text-white"
                >
                    <ChevronLeft size={14} />
                </button>

                <button
                    type="button"
                    onClick={openPicker}
                    aria-expanded={isOpen}
                    aria-haspopup="dialog"
                    className={`flex min-w-[132px] items-center justify-center gap-2 rounded-lg px-3 py-1.5 transition ${isOpen ? "bg-white/8 text-white" : "text-zinc-300 hover:bg-white/5 hover:text-white"}`}
                >
                    <Calendar size={13} className="text-zinc-500" />
                    <span className="text-xs font-medium">{getDateLabel(period, value)}</span>
                </button>

                <button
                    type="button"
                    onClick={() => onNavigate("next")}
                    aria-label={`Next ${period}`}
                    className="rounded-lg p-1.5 text-zinc-500 transition hover:bg-white/5 hover:text-white"
                >
                    <ChevronRight size={14} />
                </button>
            </div>

            {isOpen && (
                <div
                    role="dialog"
                    aria-label={`Choose ${period}`}
                    className="absolute right-0 top-[calc(100%+8px)] z-50 w-[300px] rounded-2xl border border-white/10 bg-[#181818] p-3 shadow-2xl shadow-black/50"
                >
                    <div className="mb-3 flex items-center justify-between">
                        <button
                            type="button"
                            onClick={() => movePickerView("prev")}
                            aria-label={period === "week" ? "Previous month" : "Previous year"}
                            className="rounded-lg p-2 text-zinc-500 transition hover:bg-white/5 hover:text-white"
                        >
                            <ChevronLeft size={15} />
                        </button>
                        <p className="text-sm font-medium text-zinc-200">
                            {period === "week"
                                ? viewDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })
                                : viewDate.getFullYear()}
                        </p>
                        <button
                            type="button"
                            onClick={() => movePickerView("next")}
                            aria-label={period === "week" ? "Next month" : "Next year"}
                            className="rounded-lg p-2 text-zinc-500 transition hover:bg-white/5 hover:text-white"
                        >
                            <ChevronRight size={15} />
                        </button>
                    </div>

                    {period === "week" && (
                        <div>
                            <div className="mb-1 grid grid-cols-7">
                                {WEEKDAYS.map((day) => (
                                    <span key={day} className="py-1 text-center text-[10px] font-medium text-zinc-600">{day}</span>
                                ))}
                            </div>
                            <div className="grid grid-cols-7 gap-y-1">
                                {getCalendarDays(viewDate).map((date) => {
                                    const selected = isWithinRange(date, weekStart, weekEnd);
                                    const isStart = isSameDay(date, weekStart);
                                    const isEnd = isSameDay(date, weekEnd);
                                    const outsideMonth = date.getMonth() !== viewDate.getMonth();
                                    return (
                                        <button
                                            type="button"
                                            key={date.toISOString()}
                                            onClick={() => selectDate(date)}
                                            aria-label={`Select week containing ${date.toLocaleDateString("en-US")}`}
                                            className={`relative flex h-8 items-center justify-center text-xs transition ${selected ? "bg-white/10 text-white" : outsideMonth ? "text-zinc-700 hover:bg-white/5 hover:text-zinc-400" : "text-zinc-400 hover:bg-white/5 hover:text-white"} ${isStart ? "rounded-l-lg" : ""} ${isEnd ? "rounded-r-lg" : ""}`}
                                        >
                                            <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${isSameDay(date, value) ? "bg-white font-semibold text-black" : ""}`}>
                                                {date.getDate()}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {period === "month" && (
                        <div className="grid grid-cols-3 gap-2">
                            {MONTHS.map((month, index) => {
                                const selected = value.getFullYear() === viewDate.getFullYear() && value.getMonth() === index;
                                return (
                                    <button
                                        type="button"
                                        key={month}
                                        onClick={() => selectDate(new Date(viewDate.getFullYear(), index, 1))}
                                        className={`rounded-xl px-3 py-3 text-xs font-medium transition ${selected ? "bg-white text-black" : "bg-white/[0.03] text-zinc-400 hover:bg-white/8 hover:text-white"}`}
                                    >
                                        {month}
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {period === "quarter" && (
                        <div className="grid grid-cols-2 gap-2">
                            {[0, 1, 2, 3].map((quarter) => {
                                const selected = value.getFullYear() === viewDate.getFullYear() && Math.floor(value.getMonth() / 3) === quarter;
                                return (
                                    <button
                                        type="button"
                                        key={quarter}
                                        onClick={() => selectDate(new Date(viewDate.getFullYear(), quarter * 3, 1))}
                                        className={`flex items-center justify-between rounded-xl px-3 py-3 text-left transition ${selected ? "bg-white text-black" : "bg-white/[0.03] text-zinc-400 hover:bg-white/8 hover:text-white"}`}
                                    >
                                        <span>
                                            <span className="block text-sm font-semibold">Q{quarter + 1}</span>
                                            <span className={`mt-0.5 block text-[10px] ${selected ? "text-zinc-600" : "text-zinc-600"}`}>
                                                {MONTHS[quarter * 3]}–{MONTHS[quarter * 3 + 2]}
                                            </span>
                                        </span>
                                        {selected && <Check size={14} />}
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={() => selectDate(new Date())}
                        className="mt-3 w-full rounded-xl border border-white/8 py-2 text-xs font-medium text-zinc-400 transition hover:bg-white/5 hover:text-white"
                    >
                        Current {period}
                    </button>
                </div>
            )}
        </div>
    );
}

const formatChange = (val: number) => val >= 0 ? `+${val}` : `${val}`;
const isUp = (val: number) => val >= 0;

function formatTimeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hr ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return "Yesterday";
    return `${days} days ago`;
}

// ── Chart defaults ─────────────────────────────────────────────────────────────

const chartDefaults = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
        tooltip: {
            backgroundColor: "#1a1a1a",
            borderColor: "rgba(255,255,255,0.08)",
            borderWidth: 1,
            titleColor: "#e4e4e7",
            bodyColor: "#a1a1aa",
            padding: 10,
            cornerRadius: 10,
        },
    },
};

const gridColor = "rgba(255,255,255,0.04)";
const tickColor = "#52525b";


// ── Component ─────────────────────────────────────────────────────────────────

export default function AnalyticPage() {
    const [period, setPeriod] = useState<PeriodKey>("week");
    const [selectedDate, setSelectedDate] = useState(new Date());

    const apiPeriod = {
        week: "Week",
        month: "Month",
        quarter: "Quarter",
    }[period];

    const {
        data: analytics,
    } = useAnalytics(apiPeriod, toReferenceDate(selectedDate));

    const changeDate = (direction: "prev" | "next") => {
        setSelectedDate((prev) => navigateDate(period, prev, direction));
    };

    const handlePeriodChange = (p: PeriodKey) => {
        setPeriod(p);
        setSelectedDate(new Date());
    };


    const totalTasks = analytics?.kpi.totalTasks ?? 0;
    const completedTasks = analytics?.kpi.completedTasks ?? 0;
    const inProgressTasks = analytics?.kpi.inProgressTasks ?? 0;
    const overdueTasks = analytics?.kpi.overdueTasks ?? 0;
    const completionRate = analytics?.kpi.completionRate ?? 0;

    // ── KPI cards ─────────────────────────────────────────────────────────────

    const kpis = [
        {
            label: "Tasks Completed",
            value: completedTasks,
            change: formatChange(analytics?.kpi.completedTasksChange ?? 0),
            up: isUp(analytics?.kpi.completedTasksChange ?? 0),
            sub: "completed tasks",
            icon: CheckCircle2,
            color: "text-emerald-400",
            bg: "bg-emerald-400/10",
        },
        {
            label: "In Progress",
            value: inProgressTasks,
            change: formatChange(analytics?.kpi.inProgressTasksChange ?? 0),
            up: isUp(analytics?.kpi.inProgressTasksChange ?? 0),
            sub: "active tasks",
            icon: Activity,
            color: "text-blue-400",
            bg: "bg-blue-400/10",
        },
        {
            label: "Overdue",
            value: overdueTasks,
            change: formatChange(analytics?.kpi.overdueTasksChange ?? 0),
            up: isUp(analytics?.kpi.overdueTasksChange ?? 0),
            sub: "past due date",
            icon: AlertCircle,
            color: "text-red-400",
            bg: "bg-red-400/10",
        },
        {
            label: "Completion Rate",
            value: `${completionRate}%`,
            change: formatChange(analytics?.kpi.completionRateChange ?? 0),
            up: isUp(analytics?.kpi.completionRateChange ?? 0),
            sub: "overall progress",
            icon: Target,
            color: "text-violet-400",
            bg: "bg-violet-400/10",
        },
    ];

    // ── Chart configs ──────────────────────────────────────────────────────────

    const barChartData = {
        labels: analytics?.activityTrend.map(x => x.label) ?? [],
        datasets: [
            {
                label: "Completed",
                data: analytics?.activityTrend.map(x => x.completed) ?? [],
                backgroundColor: "rgba(52,211,153,0.85)",
                borderRadius: 6,
                borderSkipped: false,
                barThickness: 10,
            },
            {
                label: "Created",
                data:
                    analytics?.activityTrend.map(x => x.created) ?? [],
                backgroundColor: "rgba(99,102,241,0.5)",
                borderRadius: 6,
                borderSkipped: false,
                barThickness: 10,
            },
        ],
    };

    const barOptions = {
        ...chartDefaults,
        plugins: {
            ...chartDefaults.plugins,
            legend: {
                display: true,
                labels: {
                    color: tickColor,
                    boxWidth: 10,
                    boxHeight: 10,
                    borderRadius: 4,
                    useBorderRadius: true,
                },
            },
        },
        scales: {
            x: { grid: { color: gridColor }, ticks: { color: tickColor } },
            y: { grid: { color: gridColor }, ticks: { color: tickColor } },
        },
    };

    const lineChartData = {
        labels: analytics?.completionTrend.map(x => x.label) ?? [],
        datasets: [
            {
                label: "Completed",
                data: analytics?.completionTrend.map(x => x.completed) ?? [],
                borderColor: "#34d399",
                backgroundColor: "rgba(52,211,153,0.08)",
                borderWidth: 2,
                pointRadius: 4,
                pointBackgroundColor: "#34d399",
                fill: true,
                tension: 0.4,
            },
            {
                label: "Overdue",
                data: analytics?.completionTrend.map(x => x.overdue) ?? [],
                borderColor: "#f87171",
                backgroundColor: "rgba(248,113,113,0.05)",
                borderWidth: 2,
                pointRadius: 4,
                pointBackgroundColor: "#f87171",
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const lineOptions = {
        ...chartDefaults,
        plugins: {
            ...chartDefaults.plugins,
            legend: {
                display: true,
                labels: {
                    color: tickColor,
                    boxWidth: 10,
                    boxHeight: 10,
                    borderRadius: 4,
                    useBorderRadius: true,
                },
            },
        },
        scales: {
            x: { grid: { color: gridColor }, ticks: { color: tickColor } },
            y: { grid: { color: gridColor }, ticks: { color: tickColor } },
        },
    };

    const priorityDoughnut = {
        labels: ["High", "Medium", "Low"],
        datasets: [
            {
                data: [
                    analytics?.priority.high ?? 0,
                    analytics?.priority.medium ?? 0,
                    analytics?.priority.low ?? 0,
                ],
                backgroundColor: [
                    "#f87171",
                    "#fbbf24",
                    "#34d399",
                ],
                borderColor: "#0d0d0d",
                borderWidth: 3,
                hoverOffset: 6,
            },
        ],
    };

    const statusDoughnut = {
        labels: ["Todo", "In Progress", "In Review", "Done"],
        datasets: [
            {
                data: [
                    analytics?.status.todo ?? 0,
                    analytics?.status.inProgress ?? 0,
                    analytics?.status.inReview ?? 0,
                    analytics?.status.done ?? 0,
                ],
                backgroundColor: [
                    "#71717a",
                    "#60a5fa",
                    "#fbbf24",
                    "#34d399",
                ],
                borderColor: "#0d0d0d",
                borderWidth: 3,
                hoverOffset: 6,
            },
        ],
    };

    const doughnutOptions = {
        ...chartDefaults,
        cutout: "72%",
        plugins: {
            ...chartDefaults.plugins,
            legend: {
                display: true,
                position: "bottom" as const,
                labels: {
                    color: tickColor,
                    boxWidth: 10,
                    boxHeight: 10,
                    borderRadius: 4,
                    useBorderRadius: true,
                    padding: 12,
                },
            },
        },
    };

    // ── Activity helpers ───────────────────────────────────────────────────────

    const activityDot: Record<string, string> = {
        completed: "bg-emerald-400",
        created: "bg-blue-400",
        overdue: "bg-red-400",
        review: "bg-violet-400",
    };
    const activityLabel: Record<string, string> = {
        completed: "text-emerald-400",
        created: "text-blue-400",
        overdue: "text-red-400",
        review: "text-violet-400",
    };

    // ── Bar chart title theo period ────────────────────────────────────────────

    const barChartTitle =
        period === "week" ? "Weekly Task Activity" : period === "month" ? "Monthly Task Activity" : "Quarterly Task Activity";

    const barChartSub =
        period === "week"
            ? "Created vs completed this week"
            : period === "month"
                ? "Created vs completed by week this month"
                : "Created vs completed by month this quarter";

    // ── Render ─────────────────────────────────────────────────────────────────

    return (
        <div className="min-h-screen bg-[#0d0d0d] px-7 py-7 font-sans">

            {/* ── Page header ──────────────────────────────────────────────────── */}
            <div className="mb-7 flex items-end justify-between">
                <div>
                    <p className="mb-1.5 text-[11px] font-medium uppercase tracking-widest text-zinc-600">
                        Reporting
                    </p>
                    <h1 className="text-[22px] font-medium text-white">Analytics</h1>
                    <p className="mt-1 text-sm text-zinc-600">
                        Track productivity, completion trends and team velocity.
                    </p>
                </div>

                {/* Period switcher + date picker */}
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5 rounded-xl border border-white/8 bg-[#1a1a1a] p-1">
                        {(["week", "month", "quarter"] as PeriodKey[]).map((p) => (
                            <button
                                key={p}
                                onClick={() => handlePeriodChange(p)}
                                className={`rounded-[9px] px-3.5 py-1.5 text-xs font-medium capitalize transition-all ${period === p
                                    ? "bg-white text-black"
                                    : "text-zinc-500 hover:text-zinc-300"
                                    }`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>

                    <PeriodPicker
                        period={period}
                        value={selectedDate}
                        onChange={setSelectedDate}
                        onNavigate={changeDate}
                    />
                </div>
            </div>

            {/* ── KPI grid ─────────────────────────────────────────────────────── */}
            <div className="grid grid-cols-4 gap-4 mb-4">
                {kpis.map((kpi) => {
                    const Icon = kpi.icon;
                    return (
                        <div
                            key={kpi.label}
                            className="group rounded-2xl border border-white/5 bg-[#141414] p-4 transition-all hover:border-white/10 hover:bg-[#181818]"
                        >
                            <div className="mb-3 flex items-center justify-between">
                                <div
                                    className={`flex h-8 w-8 items-center justify-center rounded-xl ${kpi.bg}`}
                                >
                                    <Icon size={15} className={kpi.color} />
                                </div>
                                <span
                                    className={`flex items-center gap-0.5 text-[11px] font-medium ${kpi.up ? "text-emerald-400" : "text-red-400"
                                        }`}
                                >
                                    {kpi.up ? (
                                        <ArrowUpRight size={12} />
                                    ) : (
                                        <ArrowDownRight size={12} />
                                    )}
                                    {kpi.change}
                                </span>
                            </div>
                            <p className="text-[22px] font-semibold tracking-tight text-white">
                                {kpi.value}
                            </p>
                            <p className="mt-0.5 text-xs text-zinc-600">{kpi.label}</p>
                            <p className="mt-0.5 text-[10px] text-zinc-700">{kpi.sub}</p>
                        </div>
                    );
                })}
            </div>

            {/* ── Row 1: Bar + Line ─────────────────────────────────────────────── */}
            <div className="mb-5 grid grid-cols-1 gap-5 xl:grid-cols-2">

                {/* Bar */}
                <div className="rounded-2xl border border-white/5 bg-[#141414] p-5">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-white">{barChartTitle}</p>
                            <p className="mt-0.5 text-xs text-zinc-600">{barChartSub}</p>
                        </div>
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-400/10">
                            <Activity size={14} className="text-indigo-400" />
                        </div>
                    </div>
                    <div className="h-52">
                        <Bar data={barChartData} options={barOptions} />
                    </div>
                </div>

                {/* Line */}
                <div className="rounded-2xl border border-white/5 bg-[#141414] p-5">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-white">
                                {period === "week" ? "6-Week Completion Trend" : period === "month"
                                    ? "6-Month Completion Trend"
                                    : "6-Quarter Completion Trend"}
                            </p>
                            <p className="mt-0.5 text-xs text-zinc-600">
                                Completed vs overdue over last 6{" "}
                                {period === "week"
                                    ? "weeks"
                                    : period === "month"
                                        ? "months"
                                        : "quarters"}
                            </p>
                        </div>
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-400/10">
                            <TrendingUp size={14} className="text-emerald-400" />
                        </div>
                    </div>
                    <div className="h-52">
                        <Line data={lineChartData} options={lineOptions} />
                    </div>
                </div>
            </div>

            {/* ── Row 2: Doughnuts + Projects + Activity ────────────────────────── */}
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_1.2fr_1fr]">

                {/* Doughnuts */}
                <div className="flex flex-col gap-5">
                    <div className="flex-1 rounded-2xl border border-white/5 bg-[#141414] p-5">
                        <div className="mb-3">
                            <p className="text-sm font-medium text-white">By Priority</p>
                            <p className="mt-0.5 text-xs text-zinc-600">Distribution of tasks in period</p>
                        </div>
                        <div className="flex items-center justify-center" style={{ height: 180 }}>
                            <Doughnut data={priorityDoughnut} options={doughnutOptions} />
                        </div>
                    </div>

                    <div className="flex-1 rounded-2xl border border-white/5 bg-[#141414] p-5">
                        <div className="mb-3">
                            <p className="text-sm font-medium text-white">By Status</p>
                            <p className="mt-0.5 text-xs text-zinc-600">Tasks current state in period</p>
                        </div>
                        <div className="flex items-center justify-center" style={{ height: 180 }}>
                            <Doughnut data={statusDoughnut} options={doughnutOptions} />
                        </div>
                    </div>
                </div>

                {/* Top projects */}
                <div className="rounded-2xl border border-white/5 bg-[#141414] p-5">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-white">Top Projects</p>
                            <p className="mt-0.5 text-xs text-zinc-600">Progress by initiative</p>
                        </div>
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-400/10">
                            <Users size={14} className="text-violet-400" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        {analytics?.topProjects.map((proj) => (
                            <div key={proj.projectId}>
                                <div className="mb-1.5 flex items-center justify-between">
                                    <p className="text-sm text-zinc-300 truncate max-w-[65%]">
                                        {proj.projectName}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-zinc-600">
                                            {proj.completedTasks}/{proj.totalTasks}
                                        </span>
                                        <span
                                            className={`text-xs font-medium ${proj.progress === 100
                                                ? "text-emerald-400"
                                                : proj.progress < 25
                                                    ? "text-red-400"
                                                    : "text-zinc-300"
                                                }`}
                                        >
                                            {proj.progress}%
                                        </span>
                                    </div>
                                </div>
                                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                                    <div
                                        className={`h-full rounded-full transition-all ${proj.progress === 100
                                            ? "bg-emerald-400"
                                            : proj.progress < 25
                                                ? "bg-red-400"
                                                : "bg-indigo-400"
                                            }`}
                                        style={{ width: `${proj.progress}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary row */}
                    <div className="mt-5 flex items-center justify-between rounded-xl border border-white/5 bg-[#1a1a1a] px-4 py-3">
                        <div className="text-center">
                            <p className="text-base font-semibold text-white">{totalTasks}</p>
                            <p className="text-[10px] text-zinc-600">Total tasks</p>
                        </div>
                        <div className="h-8 w-px bg-white/5" />
                        <div className="text-center">
                            <p className="text-base font-semibold text-emerald-400">{completedTasks}</p>
                            <p className="text-[10px] text-zinc-600">Done</p>
                        </div>
                        <div className="h-8 w-px bg-white/5" />
                        <div className="text-center">
                            <p className="text-base font-semibold text-blue-400">{inProgressTasks}</p>
                            <p className="text-[10px] text-zinc-600">Active</p>
                        </div>
                        <div className="h-8 w-px bg-white/5" />
                        <div className="text-center">
                            <p className="text-base font-semibold text-red-400">{overdueTasks}</p>
                            <p className="text-[10px] text-zinc-600">Overdue</p>
                        </div>
                    </div>
                </div>

                {/* Recent activity */}
                <div className="rounded-2xl border border-white/5 bg-[#141414] p-5">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-white">Recent Activity</p>
                            <p className="mt-0.5 text-xs text-zinc-600">Latest task events</p>
                        </div>
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-pink-400/10">
                            <TrendingDown size={14} className="text-pink-400" />
                        </div>
                    </div>

                    <div className="space-y-1">
                        {(analytics?.recentActivity ?? []).map((item, idx) => (
                            <div
                                key={idx}
                                className="flex items-start gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-white/4"
                            >
                                <div className="mt-1.5 flex flex-col items-center">
                                    <div className={`h-2 w-2 flex-shrink-0 rounded-full ${activityDot[item.type]}`} />
                                    {idx < (analytics?.recentActivity.length ?? 0) - 1 && (
                                        <div className="mt-1 w-px flex-1 bg-white/5" style={{ height: 20 }} />
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-[11px] font-medium leading-none">
                                        <span className={activityLabel[item.type]}>{item.action}</span>
                                    </p>
                                    <p className="mt-0.5 truncate text-xs text-zinc-400">{item.taskTitle}</p>
                                    <p className="mt-0.5 text-[10px] text-zinc-700">
                                        {formatTimeAgo(item.occurredAt)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Row 3: Insight banner ─────────────────────────────────────────── */}
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {/* Card 1 — Completion rate */}
                <div className="flex items-center gap-4 rounded-2xl border border-emerald-500/15 bg-emerald-500/5 px-5 py-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-emerald-400/15">
                        <TrendingUp size={18} className="text-emerald-400" />
                    </div>
                    <div>
                        {(analytics?.kpi.completionRateChange ?? 0) >= 0 ? (
                            <>
                                <p className="text-sm font-medium text-emerald-300">Great momentum!</p>
                                <p className="mt-0.5 text-xs text-zinc-600">
                                    Completion rate up{" "}
                                    <span className="text-emerald-400 font-medium">
                                        +{analytics?.kpi.completionRateChange ?? 0}%
                                    </span>{" "}
                                    from last period.
                                </p>
                            </>
                        ) : (
                            <>
                                <p className="text-sm font-medium text-red-300">Slowing down</p>
                                <p className="mt-0.5 text-xs text-zinc-600">
                                    Completion rate down{" "}
                                    <span className="text-red-400 font-medium">
                                        {analytics?.kpi.completionRateChange ?? 0}%
                                    </span>{" "}
                                    from last period.
                                </p>
                            </>
                        )}
                    </div>
                </div>

                {/* Card 2 — Projects at risk */}
                {(() => {
                    const atRisk = (analytics?.topProjects ?? []).filter(p => p.progress < 50 && p.totalTasks > 0).length;
                    return (
                        <div className="flex items-center gap-4 rounded-2xl border border-amber-500/15 bg-amber-500/5 px-5 py-4">
                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-amber-400/15">
                                <AlertCircle size={18} className="text-amber-400" />
                            </div>
                            <div>
                                {atRisk > 0 ? (
                                    <>
                                        <p className="text-sm font-medium text-amber-300">Watch out</p>
                                        <p className="mt-0.5 text-xs text-zinc-600">
                                            <span className="text-amber-400 font-medium">{atRisk} project{atRisk > 1 ? "s" : ""}</span>{" "}
                                            at risk of falling behind.
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-sm font-medium text-emerald-300">All on track!</p>
                                        <p className="mt-0.5 text-xs text-zinc-600">No projects at risk right now.</p>
                                    </>
                                )}
                            </div>
                        </div>
                    );
                })()}

                {/* Card 3 — Peak day */}
                <div className="flex items-center gap-4 rounded-2xl border border-violet-500/15 bg-violet-500/5 px-5 py-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-violet-400/15">
                        <Zap size={18} className="text-violet-400" />
                    </div>
                    <div>
                        {analytics?.insight.peakDay && analytics.insight.peakDay !== "—" ? (
                            <>
                                <p className="text-sm font-medium text-violet-300">
                                    Peak day: {analytics.insight.peakDay}
                                </p>
                                <p className="mt-0.5 text-xs text-zinc-600">
                                    Avg{" "}
                                    <span className="text-violet-400 font-medium">
                                        {analytics.insight.peakDayCount} tasks
                                    </span>{" "}
                                    completed on {analytics.insight.peakDay}s.
                                </p>
                            </>
                        ) : (
                            <>
                                <p className="text-sm font-medium text-zinc-400">No peak day yet</p>
                                <p className="mt-0.5 text-xs text-zinc-600">Complete more tasks to see your peak day.</p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
