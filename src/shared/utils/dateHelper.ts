import { DAYS_OF_WEEK } from "../../constants/calendarConst";


export function toDateStr(year: number, month: number, day: number): string {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function buildMonthDays(year: number, month: number) {
    const firstDay         = new Date(year, month, 1).getDay();
    const daysInMonth      = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth  = new Date(year, month, 0).getDate();
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

export function buildWeekDays(year: number, month: number, weekStartDay: number) {
    const days: { date: string; day: number; label: string }[] = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(year, month, weekStartDay + i);
        days.push({
            date:  toDateStr(d.getFullYear(), d.getMonth(), d.getDate()),
            day:   d.getDate(),
            label: DAYS_OF_WEEK[d.getDay()],
        });
    }
    return days;
}

export function getTodayDateStr(): string {
    const t = new Date();
    return toDateStr(t.getFullYear(), t.getMonth(), t.getDate());
}