import { Controller, useFormContext } from "react-hook-form";
import { useFormState } from "react-hook-form";
import type { CalendarEventType } from "../../../shared/types/Calendar";
import { EVENT_STYLES, EVENT_ICONS } from "../../../constants/calendarConst";
import { MOCK_PROJECTS } from "../../../mocks/calendarMock";
import type { EventFormValues } from "../../../features/calendar/schemals/event.schema";
import Button from "../Ui/Button";

const inputClass = "w-full rounded-xl border border-white/10 bg-black px-4 py-2.5 text-sm text-white outline-none focus:border-white/25 transition-colors placeholder:text-zinc-600";
const labelClass = "mb-1.5 block text-xs font-medium text-zinc-500";

interface Props {
    onSubmit: (data: EventFormValues) => void;
}

export default function EventForm(
    { onSubmit }: Props
) {
    const { register, control, handleSubmit } = useFormContext<EventFormValues>();
    const { errors } = useFormState<EventFormValues>();

    const activeProjects = MOCK_PROJECTS.filter((p) => p.status === 0); // 0 = active

    return (
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {/* Title */}
            <div>
                <label className={labelClass}>Title</label>
                <input
                    {...register("title")}
                    placeholder="Event title..."
                    className={inputClass}
                />
                {errors.title && (
                    <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>
                )}
            </div>

            {/* Date + Time */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className={labelClass}>Date</label>
                    <input
                        type="date"
                        {...register("date")}
                        className={inputClass}
                    />
                    {errors.date && (
                        <p className="mt-1 text-xs text-red-500">{errors.date.message}</p>
                    )}
                </div>
                <div>
                    <label className={labelClass}>
                        Time <span className="text-zinc-700">(optional)</span>
                    </label>
                    <input
                        type="time"
                        {...register("time")}
                        className={inputClass}
                    />
                </div>
            </div>

            {/* Type selector */}
            <div>
                <label className={labelClass}>Type</label>
                <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                        <div className="grid grid-cols-4 gap-2">
                            {(["task", "milestone", "meeting", "overdue"] as CalendarEventType[]).map((t) => {
                                const s = EVENT_STYLES[t];
                                const isSelected = field.value === t;
                                return (
                                    <button
                                        key={t}
                                        type="button"
                                        onClick={() => field.onChange(t)}
                                        className={`flex flex-col items-center gap-1.5 rounded-xl border py-2.5 text-[11px] font-medium capitalize transition-all ${
                                            isSelected
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
                    )}
                />
                {errors.type && (
                    <p className="mt-1 text-xs text-red-500">{errors.type.message}</p>
                )}
            </div>

            {/* Project link */}
            <div>
                <label className={labelClass}>
                    Project <span className="text-zinc-700">(optional)</span>
                </label>
                <select
                    {...register("projectId")}
                    className={`${inputClass} appearance-none`}
                >
                    <option value="">No project</option>
                    {activeProjects.map((p) => (
                        <option key={p.id} value={String(p.id)}>{p.name}</option>
                    ))}
                </select>
            </div>

            <Button type="submit" variant="ghost" className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
                Create Event
            </Button>
        </form>
    );
}