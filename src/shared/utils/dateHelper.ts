import { DAYS_OF_WEEK } from "../../constants/calendarConst";


export function toDateStr(year: number, month: number, day: number): string {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function buildMonthDays(year: number, month: number) {
    const firstDay         = new Date(year, month, 1).getDay();
    const daysInMonth      = new Date(year, month + 1, 0).getDate();
    const days: { date: string; day: number; isCurrentMonth: boolean }[] = [];

    // Dùng Date tự normalize khi tràn ranh giới năm (tháng 1 lùi sang tháng 12
    // năm trước, tháng 12 tiến sang tháng 1 năm sau) — tránh sinh chuỗi
    // "2026-00-xx" / "2026-13-xx" khi cộng trừ month trực tiếp.
    for (let i = firstDay - 1; i >= 0; i--) {
        const d = new Date(year, month, -i);
        days.push({ date: toDateStr(d.getFullYear(), d.getMonth(), d.getDate()), day: d.getDate(), isCurrentMonth: false });
    }
    for (let d = 1; d <= daysInMonth; d++)
        days.push({ date: toDateStr(year, month, d), day: d, isCurrentMonth: true });
    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
        const dt = new Date(year, month + 1, d);
        days.push({ date: toDateStr(dt.getFullYear(), dt.getMonth(), dt.getDate()), day: d, isCurrentMonth: false });
    }

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

export const formatDate = (date: string) => {
    const d = new Date(date);

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();

    return `${day}/${month}/${year}`;
};