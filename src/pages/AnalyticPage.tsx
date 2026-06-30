import { useState, useMemo } from "react";
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
    ArrowUpRight,
    ArrowDownRight,
    ChevronLeft, ChevronRight,
    Zap,
} from "lucide-react";
import { priorities, statuses } from "../constants/taskOption";
import { TASKS_MOCK } from "../mocks/calendarMock";

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

// ── Static mock data (không phụ thuộc period) ─────────────────────────────────

const TOP_PROJECTS = [
    { name: "TaskFlow Redesign", tasks: 24, completed: 17, progress: 71 },
    { name: "API Integration", tasks: 18, completed: 7, progress: 39 },
    { name: "Analytics Dashboard", tasks: 12, completed: 2, progress: 17 },
    { name: "User Onboarding V2", tasks: 10, completed: 10, progress: 100 },
    { name: "Auth Refactor", tasks: 8, completed: 8, progress: 100 },
];

const RECENT_ACTIVITY = [
    { action: "Completed", task: "Design new hero section", time: "2 min ago", type: "completed" },
    { action: "In Progress", task: "Fix refresh token bug", time: "18 min ago", type: "created" },
    { action: "Overdue", task: "Q2 Report Draft", time: "1 hr ago", type: "overdue" },
    { action: "In Review", task: "Onboarding flow redesign", time: "3 hr ago", type: "review" },
    { action: "Completed", task: "API endpoint documentation", time: "5 hr ago", type: "completed" },
    { action: "Created", task: "Mobile push notifications", time: "Yesterday", type: "created" },
];

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

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// ── Component ─────────────────────────────────────────────────────────────────

export default function AnalyticPage() {
    const [period, setPeriod] = useState<PeriodKey>("week");
    const [selectedDate, setSelectedDate] = useState(new Date());

    const changeDate = (direction: "prev" | "next") => {
        setSelectedDate((prev) => navigateDate(period, prev, direction));
    };

    const handlePeriodChange = (p: PeriodKey) => {
        setPeriod(p);
        setSelectedDate(new Date());
    };

    // ── Tasks in current period ────────────────────────────────────────────────

    const [rangeStart, rangeEnd] = useMemo(
        () => getPeriodRange(period, selectedDate),
        [period, selectedDate]
    );

    const tasksInRange = useMemo(
        () =>
            TASKS_MOCK.filter((t) => {
                const due = new Date(t.deadline);
                return due >= rangeStart && due <= rangeEnd;
            }),
        [rangeStart, rangeEnd]
    );

    const totalTasks = tasksInRange.length;
    const completedTasks = tasksInRange.filter((t) => statuses[t.status] === "Completed").length;
    const inProgressTasks = tasksInRange.filter((t) => statuses[t.status] === "In Progress").length;
    const overdueTasks = tasksInRange.filter(
        (t) => statuses[t.status] !== "Completed" && new Date(t.deadline) < new Date()
    ).length;
    const completionRate = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    // ── KPI cards ─────────────────────────────────────────────────────────────

    const kpis = [
        {
            label: "Tasks Completed",
            value: completedTasks,
            change: "+12%",
            up: true,
            sub: "completed tasks",
            icon: CheckCircle2,
            color: "text-emerald-400",
            bg: "bg-emerald-400/10",
        },
        {
            label: "In Progress",
            value: inProgressTasks,
            change: "+3",
            up: true,
            sub: "active tasks",
            icon: Activity,
            color: "text-blue-400",
            bg: "bg-blue-400/10",
        },
        {
            label: "Overdue",
            value: overdueTasks,
            change: "-2",
            up: false,
            sub: "past due date",
            icon: AlertCircle,
            color: "text-red-400",
            bg: "bg-red-400/10",
        },
        {
            label: "Completion Rate",
            value: `${completionRate}%`,
            change: "+6%",
            up: true,
            sub: "overall progress",
            icon: Target,
            color: "text-violet-400",
            bg: "bg-violet-400/10",
        },
    ];

    // ── Bar chart data ─────────────────────────────────────────────────────────

    const computedBarData = useMemo(() => {
        if (period === "week") {
            const [start] = getPeriodRange("week", selectedDate);

            const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

            const completed = labels.map((_, i) => {
                const day = new Date(start);
                day.setDate(start.getDate() + i);
                return tasksInRange.filter(
                    (t) =>
                        statuses[t.status] === "Completed" &&
                        new Date(t.deadline).toDateString() === day.toDateString()
                ).length;
            });
            const created = labels.map((_, i) => {
                const day = new Date(start);
                day.setDate(start.getDate() + i);
                return tasksInRange.filter(
                    (t) => new Date(t.deadline).toDateString() === day.toDateString()
                ).length;
            });
            return { labels, completed, created };
        }

        if (period === "month") {
            const [start, end] = getPeriodRange("month", selectedDate);
            const labels: string[] = [];
            const completed: number[] = [];
            const created: number[] = [];
            // eslint-disable-next-line prefer-const
            let cursor = new Date(start);
            let w = 1;
            while (cursor <= end) {
                const wStart = new Date(cursor);
                const wEnd = new Date(cursor);
                wEnd.setDate(cursor.getDate() + 6);
                if (wEnd > end) wEnd.setTime(end.getTime());
                labels.push(`Week ${w}`);
                completed.push(
                    tasksInRange.filter(
                        (t) =>
                            statuses[t.status] === "Completed" &&
                            new Date(t.deadline) >= wStart &&
                            new Date(t.deadline) <= wEnd
                    ).length
                );
                created.push(
                    tasksInRange.filter(
                        (t) => new Date(t.deadline) >= wStart && new Date(t.deadline) <= wEnd
                    ).length
                );
                cursor.setDate(cursor.getDate() + 7);
                w++;
            }
            return { labels, completed, created };
        }

        // quarter — 3 months
        const q = Math.floor(selectedDate.getMonth() / 3);
        const labels = [0, 1, 2].map((i) => MONTH_NAMES[q * 3 + i]);
        const completed = [0, 1, 2].map((i) => {
            const m = q * 3 + i;
            return TASKS_MOCK.filter(
                (t) =>
                    statuses[t.status] === "Completed" &&
                    new Date(t.deadline).getMonth() === m &&
                    new Date(t.deadline).getFullYear() === selectedDate.getFullYear()
            ).length;
        });
        const created = [0, 1, 2].map((i) => {
            const m = q * 3 + i;
            return TASKS_MOCK.filter(
                (t) =>
                    new Date(t.deadline).getMonth() === m &&
                    new Date(t.deadline).getFullYear() === selectedDate.getFullYear()
            ).length;
        });
        return { labels, completed, created };
    }, [period, selectedDate, tasksInRange]);

    // ── Line chart data ────────────────────────────────────────────────────────

    const computedLineData = useMemo(() => {
        const now = new Date();

        if (period === "week") {
            const labels: string[] = [];
            const completed: number[] = [];
            const overdue: number[] = [];
            for (let i = 5; i >= 0; i--) {
                const ref = new Date(selectedDate);
                ref.setDate(ref.getDate() - i * 7);
                const [s, e] = getPeriodRange("week", ref);
                const wNum = Math.ceil(ref.getDate() / 7);
                labels.push(`W${wNum}`);
                completed.push(
                    TASKS_MOCK.filter(
                        (t) =>
                            statuses[t.status] === "Completed" &&
                            new Date(t.deadline) >= s &&
                            new Date(t.deadline) <= e
                    ).length
                );
                overdue.push(
                    TASKS_MOCK.filter(
                        (t) =>
                            statuses[t.status] !== "Completed" &&
                            new Date(t.deadline) >= s &&
                            new Date(t.deadline) <= e &&
                            new Date(t.deadline) < now
                    ).length
                );
            }
            return { labels, completed, overdue };
        }

        if (period === "month") {
            const labels: string[] = [];
            const completed: number[] = [];
            const overdue: number[] = [];
            for (let i = 5; i >= 0; i--) {
                const ref = new Date(selectedDate);
                ref.setMonth(ref.getMonth() - i);
                const [s, e] = getPeriodRange("month", ref);
                labels.push(MONTH_NAMES[ref.getMonth()]);
                completed.push(
                    TASKS_MOCK.filter(
                        (t) =>
                            statuses[t.status] === "Completed" &&
                            t.deadline &&
                            new Date(t.deadline) >= s &&
                            new Date(t.deadline) <= e
                    ).length
                );
                overdue.push(
                    TASKS_MOCK.filter(
                        (t) =>
                            statuses[t.status] !== "Completed" &&
                            t.deadline &&
                            new Date(t.deadline) >= s &&
                            new Date(t.deadline) <= e &&
                            new Date(t.deadline) < now
                    ).length
                );
            }
            return { labels, completed, overdue };
        }

        // quarter
        const labels: string[] = [];
        const completed: number[] = [];
        const overdue: number[] = [];
        for (let i = 5; i >= 0; i--) {
            const ref = new Date(selectedDate);
            ref.setMonth(ref.getMonth() - i * 3);
            const [s, e] = getPeriodRange("quarter", ref);
            const qNum = Math.floor(ref.getMonth() / 3) + 1;
            labels.push(`Q${qNum}'${String(ref.getFullYear()).slice(2)}`);
            completed.push(
                TASKS_MOCK.filter(
                    (t) =>
                        statuses[t.status] === "Completed" &&
                        t.deadline &&
                        new Date(t.deadline) >= s &&
                        new Date(t.deadline) <= e
                ).length
            );
            overdue.push(
                TASKS_MOCK.filter(
                    (t) =>
                        statuses[t.status] !== "Completed" &&
                        t.deadline &&
                        new Date(t.deadline) >= s &&
                        new Date(t.deadline) <= e &&
                        new Date(t.deadline) < now
                ).length
            );
        }
        return { labels, completed, overdue };
    }, [period, selectedDate]);

    // ── Chart configs ──────────────────────────────────────────────────────────

    const barChartData = {
        labels: computedBarData.labels,
        datasets: [
            {
                label: "Completed",
                data: computedBarData.completed,
                backgroundColor: "rgba(52,211,153,0.85)",
                borderRadius: 6,
                borderSkipped: false,
                barThickness: 10,
            },
            {
                label: "Created",
                data: computedBarData.created,
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
        labels: computedLineData.labels,
        datasets: [
            {
                label: "Completed",
                data: computedLineData.completed,
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
                data: computedLineData.overdue,
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
        labels: priorities,
        datasets: [
            {
                data: priorities.map(
                    (p) => tasksInRange.filter((t) => priorities[t.priority] === p).length
                ),
                backgroundColor: ["#f87171", "#fbbf24", "#34d399"],
                borderColor: "#0d0d0d",
                borderWidth: 3,
                hoverOffset: 6,
            },
        ],
    };

    const statusDoughnut = {
        labels: statuses,
        datasets: [
            {
                data: statuses.map(
                    (s) => tasksInRange.filter((t) => statuses[t.status] === s).length
                ),
                backgroundColor: ["#71717a", "#60a5fa", "#fbbf24", "#34d399"],
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
        period === "week"
            ? "Weekly Task Activity"
            : period === "month"
            ? "Monthly Task Activity"
            : "Quarterly Task Activity";

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
                                className={`rounded-[9px] px-3.5 py-1.5 text-xs font-medium capitalize transition-all ${
                                    period === p
                                        ? "bg-white text-black"
                                        : "text-zinc-500 hover:text-zinc-300"
                                }`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center rounded-xl border border-white/8 bg-[#1a1a1a] px-1 py-1">
                        <button
                            onClick={() => changeDate("prev")}
                            className="rounded-lg p-1.5 text-zinc-500 transition hover:bg-white/5 hover:text-white"
                        >
                            <ChevronLeft size={14} />
                        </button>

                        <div className="flex items-center gap-2 px-3">
                            <Calendar size={12} className="text-zinc-500" />
                            <span className="text-xs font-medium text-zinc-300">
                                {getDateLabel(period, selectedDate)}
                            </span>
                        </div>

                        <button
                            onClick={() => changeDate("next")}
                            className="rounded-lg p-1.5 text-zinc-500 transition hover:bg-white/5 hover:text-white"
                        >
                            <ChevronRight size={14} />
                        </button>
                    </div>
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
                                    className={`flex items-center gap-0.5 text-[11px] font-medium ${
                                        kpi.up ? "text-emerald-400" : "text-red-400"
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
                                {period === "week"
                                    ? "6-Week Completion Trend"
                                    : period === "month"
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
                        {TOP_PROJECTS.map((proj) => (
                            <div key={proj.name}>
                                <div className="mb-1.5 flex items-center justify-between">
                                    <p className="text-sm text-zinc-300 truncate max-w-[65%]">
                                        {proj.name}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-zinc-600">
                                            {proj.completed}/{proj.tasks}
                                        </span>
                                        <span
                                            className={`text-xs font-medium ${
                                                proj.progress === 100
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
                                        className={`h-full rounded-full transition-all ${
                                            proj.progress === 100
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
                        {RECENT_ACTIVITY.map((item, idx) => (
                            <div
                                key={idx}
                                className="flex items-start gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-white/4"
                            >
                                <div className="mt-1.5 flex flex-col items-center">
                                    <div
                                        className={`h-2 w-2 flex-shrink-0 rounded-full ${activityDot[item.type]}`}
                                    />
                                    {idx < RECENT_ACTIVITY.length - 1 && (
                                        <div
                                            className="mt-1 w-px flex-1 bg-white/5"
                                            style={{ height: 20 }}
                                        />
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-[11px] font-medium leading-none">
                                        <span className={activityLabel[item.type]}>{item.action}</span>
                                    </p>
                                    <p className="mt-0.5 truncate text-xs text-zinc-400">{item.task}</p>
                                    <p className="mt-0.5 text-[10px] text-zinc-700">{item.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Row 3: Insight banner ─────────────────────────────────────────── */}
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="flex items-center gap-4 rounded-2xl border border-emerald-500/15 bg-emerald-500/5 px-5 py-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-emerald-400/15">
                        <TrendingUp size={18} className="text-emerald-400" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-emerald-300">Great momentum!</p>
                        <p className="mt-0.5 text-xs text-zinc-600">
                            Completion rate up{" "}
                            <span className="text-emerald-400 font-medium">6%</span> from last period.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl border border-amber-500/15 bg-amber-500/5 px-5 py-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-amber-400/15">
                        <AlertCircle size={18} className="text-amber-400" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-amber-300">Watch out</p>
                        <p className="mt-0.5 text-xs text-zinc-600">
                            <span className="text-amber-400 font-medium">3 projects</span> at risk of
                            falling behind.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl border border-violet-500/15 bg-violet-500/5 px-5 py-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-violet-400/15">
                        <Zap size={18} className="text-violet-400" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-violet-300">Peak day: Thursday</p>
                        <p className="mt-0.5 text-xs text-zinc-600">
                            Avg <span className="text-violet-400 font-medium">8 tasks</span> completed
                            on Thursdays.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}