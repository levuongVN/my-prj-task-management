import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import CustomSelect from "../Ui/CustomSelect";
import { createTaskSchema, type CreateTaskFormValues } from "../../../features/task/schemas/task.schema";
import Button from "../Ui/Button";

interface Props {
    onSubmit: (
        data: CreateTaskFormValues
    ) => void;
}

export default function CreateTaskForm({
    onSubmit,
}: Props) {
    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm<CreateTaskFormValues>({
        resolver: zodResolver(
            createTaskSchema
        ),
        defaultValues: {
            title: "",
            description: "",
            priority: "Medium",
            status: "Pending",
            due: "",
        },
    });
    return (
        <form
            id="create-task-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
        >
            {/* Title */}

            <div>
                <label className="mb-2 block text-sm text-zinc-400">
                    Title
                </label>

                <input
                    {...register("title")}
                    className="
                        w-full h-12
                        rounded-2xl
                        border border-white/10
                        bg-black
                        px-4
                        text-white
                        outline-none
                        focus:border-white/30
                    "
                />

                {errors.title && (
                    <p className="mt-2 text-sm text-red-400">
                        {errors.title.message}
                    </p>
                )}
            </div>

            {/* Description */}

            <div>
                <label className="mb-2 block text-sm text-zinc-400">
                    Description
                </label>

                <textarea
                    rows={4}
                    {...register(
                        "description"
                    )}
                    className="
                        w-full
                        rounded-2xl
                        border border-white/10
                        bg-black
                        p-4
                        text-white
                        outline-none
                        resize-none
                    "
                />

                {errors.description && (
                    <p className="mt-2 text-sm text-red-400">
                        {
                            errors.description
                                .message
                        }
                    </p>
                )}
            </div>

            {/* Priority + Status */}

            <div className="grid grid-cols-2 gap-4">
                <Controller
                    control={control}
                    name="priority"
                    render={({
                        field,
                    }) => (
                        <div>
                            <label className="mb-2 block text-sm text-zinc-400">
                                Priority
                            </label>

                            <CustomSelect
                                value={
                                    field.value
                                }
                                onChange={
                                    field.onChange
                                }
                                type="priority"
                                options={[
                                    {
                                        label: "High",
                                        value: "High",
                                    },
                                    {
                                        label: "Medium",
                                        value: "Medium",
                                    },
                                    {
                                        label: "Low",
                                        value: "Low",
                                    },
                                ]}
                            />
                        </div>
                    )}
                />

                <Controller
                    control={control}
                    name="status"
                    render={({
                        field,
                    }) => (
                        <div>
                            <label className="mb-2 block text-sm text-zinc-400">
                                Status
                            </label>

                            <CustomSelect
                                value={
                                    field.value
                                }
                                onChange={
                                    field.onChange
                                }
                                type="status"
                                options={[
                                    {
                                        label: "Pending",
                                        value: "Pending",
                                    },
                                    {
                                        label: "In Progress",
                                        value: "In Progress",
                                    },
                                    {
                                        label: "In Review",
                                        value: "In Review",
                                    },
                                    {
                                        label: "Completed",
                                        value: "Completed",
                                    },
                                ]}
                            />
                        </div>
                    )}
                />
            </div>

            {/* Due Date */}

            <div>
                <label className="mb-2 block text-sm text-zinc-400">
                    Due Date
                </label>

                <input
                    type="date"
                    {...register("due")}
                    className="
                        w-full h-12
                        rounded-2xl
                        border border-white/10
                        bg-black
                        px-4
                        text-white
                    "
                />

                {errors.due && (
                    <p className="mt-2 text-sm text-red-400">
                        {errors.due.message}
                    </p>
                )}
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={() => reset() }
                >
                    Reset
                </Button>

                <Button
                    type="submit"
                    variant="secondary"
                >
                    Create Task
                </Button>
            </div>
        </form>
    );
}