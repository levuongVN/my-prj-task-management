import { useState } from "react";
import { MONTH_NAMES } from "../../../constants/calendarConst";
import type { ViewMode } from "../../../shared/types/Calendar";
import { buildWeekDays, getTodayDateStr, toDateStr } from "../../../shared/utils/dateHelper";

export const TODAY_DATE = getTodayDateStr();

export function useCalendarNavigation() {
    const todayObj = new Date();

    const [view, setView] = useState<ViewMode>("month");
    const [year, setYear] = useState(todayObj.getFullYear());
    const [month, setMonth] = useState(todayObj.getMonth());
    const [selectedDate, setSelectedDate] = useState(TODAY_DATE);
    const [weekStartDay, setWeekStartDay] = useState(todayObj.getDate() - todayObj.getDay());

    const [, , dayStr] = selectedDate.split("-");
    const selectedDayNum = parseInt(dayStr, 10);

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

    const handleDayClick = (date: string) => {
        setSelectedDate(date);
        if (view === "month") setView("day");
    };

    return {
        view,
        setView,
        year,
        month,
        selectedDate,
        setSelectedDate,
        weekStartDay,
        navLabel,
        goBack,
        goForward,
        goToday,
        handleDayClick,
    };
}
