import { useEffect, useRef, useState } from "react";
import { Calendar, Check, ChevronLeft, ChevronRight } from "lucide-react";
import type { PeriodKey } from "../utils/periodDate";
import {
    getCalendarDays,
    getDateLabel,
    getPeriodRange,
    isSameDay,
    isWithinRange,
    MONTHS,
    WEEKDAYS,
} from "../utils/periodDate";

export interface PeriodPickerProps {
    period: PeriodKey;
    value: Date;
    onChange: (date: Date) => void;
    onNavigate: (direction: "prev" | "next") => void;
}

export function PeriodPicker({ period, value, onChange, onNavigate }: PeriodPickerProps) {
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
