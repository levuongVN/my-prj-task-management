import { PeriodPicker } from "./PeriodPicker";
import type { PeriodKey } from "../utils/periodDate";

interface AnalyticsHeaderProps {
    period: PeriodKey;
    selectedDate: Date;
    onPeriodChange: (p: PeriodKey) => void;
    onDateChange: (d: Date) => void;
    onNavigate: (dir: "prev" | "next") => void;
}

export function AnalyticsHeader({ period, selectedDate, onPeriodChange, onDateChange, onNavigate }: AnalyticsHeaderProps) {
    return (
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
                            onClick={() => onPeriodChange(p)}
                            className={`rounded-[9px] px-3.5 py-1.5 text-xs font-medium capitalize transition-all ${period === p
                                ? "bg-white text-black"
                                : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
                                }`}
                        >
                            {p}
                        </button>
                    ))}
                </div>

                <PeriodPicker
                    period={period}
                    value={selectedDate}
                    onChange={onDateChange}
                    onNavigate={onNavigate}
                />
            </div>
        </div>
    );
}
