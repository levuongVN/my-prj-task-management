import { Controller, useForm, type DefaultValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import CustomSelect from "../../../shared/components/Ui/CustomSelect";
import { createTaskSchema, type CreateTaskFormValues } from "../schemas/task.schema";
import Button from "../../../shared/components/Ui/Button";
import { recurrences } from "../../../constants/taskOption";
import { getTodayDateStr } from "../../../shared/utils/dateHelper";
import type { ProjectOption } from "../../../features/project/components/ProjectSelect";
import ProjectSelect from "../../../features/project/components/ProjectSelect";
import { LabelPicker } from "./LabelPicker";

interface Props {
    defaultValues?: DefaultValues<CreateTaskFormValues>;
    onSubmit: (data: CreateTaskFormValues) => void;
    projects: ProjectOption[];
    isLoading?: boolean;
}

/** Lỗi dưới input — thống nhất cỡ/màu */
function FieldError({ message }: { message?: string }) {
    if (!message) return null;
    return <p className="mt-2 text-xs text-red-400">{message}</p>;
}

export default function CreateTaskForm({
    onSubmit,
    defaultValues,
    projects,
    isLoading = false,
}: Props) {
    const isEdit = !!defaultValues;
    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm<CreateTaskFormValues>({
        resolver: zodResolver(createTaskSchema),
        defaultValues: defaultValues ?? {
            title: "",
            description: "",
            priority: "Medium",
            status: "Pending",
            due: "",
            projectId: "",
            labelIds: [],
            recurrence: recurrences[0],
        },
    });

    return (
        <form id="create-task-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Title */}
            <div>
                <input
                    {...register("title")}
                    placeholder="Task title"
                    className="w-full h-12 rounded-2xl border border-white/10 bg-black px-4 text-base font-medium text-white outline-none transition focus:border-white/30"
                />
                <FieldError message={errors.title?.message} />
            </div>

            {/* Description */}
            <div>
                <textarea
                    rows={3}
                    {...register("description")}
                    placeholder="Description (optional)"
                    className="w-full rounded-2xl border border-white/10 bg-black p-3.5 text-sm text-white outline-none resize-none transition focus:border-white/30"
                />
                <FieldError message={errors.description?.message} />
            </div>

            {/* Priority + Status */}
            <div className="grid grid-cols-2 gap-4">
                <Controller
                    control={control}
                    name="priority"
                    render={({ field }) => (
                        <div>
                            <label className="mb-2 block text-xs uppercase tracking-wide text-zinc-400">
                                Priority
                            </label>

                            <CustomSelect
                                value={field.value}
                                onChange={field.onChange}
                                type="priority"
                                options={[
                                    { label: "High", value: "High" },
                                    { label: "Medium", value: "Medium" },
                                    { label: "Low", value: "Low" },
                                ]}
                            />
                        </div>
                    )}
                />

                <Controller
                    control={control}
                    name="status"
                    render={({ field }) => (
                        <div>
                            <label className="mb-2 block text-xs uppercase tracking-wide text-zinc-400">
                                Status
                            </label>

                            <CustomSelect
                                value={field.value}
                                onChange={field.onChange}
                                type="status"
                                options={[
                                    { label: "Pending", value: "Pending" },
                                    { label: "In Progress", value: "In Progress" },
                                    { label: "In Review", value: "In Review" },
                                    { label: "Completed", value: "Completed" },
                                ]}
                            />
                        </div>
                    )}
                />
            </div>

            {/* Due Date + Repeat */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="mb-2 block text-xs uppercase tracking-wide text-zinc-400">
                        Due date
                    </label>

                    {/* min = hôm nay khi tạo mới (edit giữ deadline cũ thoải mái) */}
                    <input
                        type="date"
                        min={isEdit ? undefined : getTodayDateStr()}
                        {...register("due")}
                        className="calendar-picker-invert w-full h-11 rounded-xl border border-white/10 bg-black px-3.5 text-sm text-white outline-none transition focus:border-white/30"
                    />
                    <FieldError message={errors.due?.message} />
                </div>

                <Controller
                    control={control}
                    name="recurrence"
                    render={({ field }) => (
                        <div>
                            <label className="mb-2 block text-xs uppercase tracking-wide text-zinc-400">
                                Repeat
                            </label>

                            <CustomSelect
                                value={field.value ?? recurrences[0]}
                                onChange={field.onChange}
                                type="status"
                                options={recurrences.map((r) => ({
                                    label: r,
                                    value: r,
                                }))}
                            />
                        </div>
                    )}
                />
            </div>

            {/* Project */}
            <Controller
                control={control}
                name="projectId"
                render={({ field }) => (
                    <div>
                        <label className="mb-2 block text-xs uppercase tracking-wide text-zinc-400">
                            Project
                        </label>

                        <ProjectSelect
                            value={field.value}
                            onChange={field.onChange}
                            projects={projects}
                        />

                        <FieldError message={errors.projectId?.message} />
                    </div>
                )}
            />

            {/* Labels */}
            <Controller
                control={control}
                name="labelIds"
                render={({ field }) => (
                    <div>
                        <label className="mb-2 block text-xs uppercase tracking-wide text-zinc-400">
                            Labels
                        </label>

                        <LabelPicker value={field.value ?? []} onChange={field.onChange} />
                    </div>
                )}
            />

            {/* Footer */}
            <div className="flex justify-end gap-3 pt-2 border-t border-white/5">
                {!isEdit && (
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => reset()}
                        className="rounded-xl px-4 py-2 text-sm"
                    >
                        Reset
                    </Button>
                )}

                <Button
                    type="submit"
                    variant="primary"
                    className="rounded-xl px-5 py-2 text-sm"
                    isLoading={isLoading}
                    disabled={isLoading}
                >
                    {isEdit ? "Update Task" : "Create Task"}
                </Button>
            </div>
        </form>
    );
}
