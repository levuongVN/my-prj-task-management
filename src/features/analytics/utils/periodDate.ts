export type PeriodKey = "week" | "month" | "quarter";

export function getPeriodRange(period: PeriodKey, date: Date): [Date, Date] {
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

export function getDateLabel(period: PeriodKey, date: Date): string {
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

export function navigateDate(period: PeriodKey, date: Date, dir: "prev" | "next"): Date {
    const d = new Date(date);
    const delta = dir === "next" ? 1 : -1;
    if (period === "week") d.setDate(d.getDate() + delta * 7);
    else if (period === "month") d.setMonth(d.getMonth() + delta);
    else d.setMonth(d.getMonth() + delta * 3);
    return d;
}

export function toReferenceDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

export function isSameDay(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function isWithinRange(date: Date, start: Date, end: Date): boolean {
    const value = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    return value >= start.getTime() && value <= end.getTime();
}

export function getCalendarDays(viewDate: Date): Date[] {
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

export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

export const formatChange = (val: number) => val >= 0 ? `+${val}` : `${val}`;
export const isUp = (val: number) => val >= 0;

export function formatTimeAgo(dateStr: string): string {
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
