import { useState } from "react";
import { useAnalytics } from "../features/analytics/hooks/useAnalytic";
import { navigateDate, toReferenceDate } from "../features/analytics/utils/periodDate";
import type { PeriodKey } from "../features/analytics/utils/periodDate";
import { AnalyticsHeader } from "../features/analytics/components/AnalyticsHeader";
import { BarChartCard } from "../features/analytics/components/BarChartCard";
import { DoughnutCard } from "../features/analytics/components/DoughnutCard";
import { InsightBanner } from "../features/analytics/components/InsightBanner";
import { KpiGrid } from "../features/analytics/components/KpiGrid";
import { LineChartCard } from "../features/analytics/components/LineChartCard";
import { RecentActivityCard } from "../features/analytics/components/RecentActivityCard";
import { TopProjectsCard } from "../features/analytics/components/TopProjectsCard";

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

    return (
        <div className="min-h-screen bg-[#0d0d0d] px-7 py-7 font-sans">
            <AnalyticsHeader
                period={period}
                selectedDate={selectedDate}
                onPeriodChange={handlePeriodChange}
                onDateChange={setSelectedDate}
                onNavigate={changeDate}
            />

            <KpiGrid analytics={analytics} />

            {/* ── Row 1: Bar + Line ─────────────────────────────────────────────── */}
            <div className="mb-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
                <BarChartCard analytics={analytics} period={period} />
                <LineChartCard analytics={analytics} period={period} />
            </div>

            {/* ── Row 2: Doughnuts + Projects + Activity ────────────────────────── */}
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_1.2fr_1fr]">
                <DoughnutCard analytics={analytics} />
                <TopProjectsCard
                    analytics={analytics}
                    totals={{ totalTasks, completedTasks, inProgressTasks, overdueTasks }}
                />
                <RecentActivityCard analytics={analytics} />
            </div>

            {/* ── Row 3: Insight banner ─────────────────────────────────────────── */}
            <InsightBanner analytics={analytics} />
        </div>
    );
}
