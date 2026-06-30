import { Controller, useFormContext, useFormState } from "react-hook-form";
import { type ProjectFormValues } from "../../../features/project/schemals/project.schemal";
import CustomSelect from "../Ui/CustomSelect";
import Button from "../Ui/Button";

interface Props {
    onSubmit: (data: ProjectFormValues) => void;
    isEdit?: boolean;
}

export default function ProjectForm({ onSubmit, isEdit }: Props) {
    const {
        register,
        control,
        handleSubmit,
    } = useFormContext<ProjectFormValues>();
    const { errors } = useFormState<ProjectFormValues>();

    return (
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label className="mb-2 block text-sm text-zinc-400">
                    Project Name
                </label>

                <input
                    {...register("name")}
                    className="w-full text-white rounded-2xl border border-white/50 bg-black px-4 py-3"
                />
                {errors.name && (
                    <p className="mt-1 text-sm text-red-500">
                        {errors.name.message}
                    </p>
                )}
            </div>

            <div>
                <label className="mb-2 block text-sm text-zinc-400">
                    Description
                </label>

                <textarea
                    {...register("description")}
                    rows={4}
                    className="w-full text-white rounded-2xl border border-white/50 bg-black px-4 py-3"
                />

                {errors.description && (
                    <p className="mt-1 text-sm text-red-500">
                        {errors.description.message}
                    </p>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* Due */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm text-zinc-400">
                        Due Date
                    </label>

                    <input
                        type="date"
                        {...register("due")}
                        className="rounded-2xl border border-white/50 bg-black px-4 py-3 text-white"
                    />

                    {errors.due && (
                        <p className="text-sm text-red-500">
                            {errors.due.message}
                        </p>
                    )}
                </div>

                {/* Status */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm text-zinc-400">
                        Status
                    </label>

                    <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                            <CustomSelect
                                options={[
                                    { label: "Active", value: "Active" },
                                    { label: "Completed", value: "Completed" },
                                    { label: "Archived", value: "Archived" },
                                ]}
                                value={field.value}
                                onChange={field.onChange}
                            />
                        )}
                    />

                    {errors.status && (
                        <p className="text-sm text-red-500">
                            {errors.status.message}
                        </p>
                    )}
                </div>
            </div>

            <Button className="w-full bg-blue-500 text-white py-3 rounded-2xl hover:bg-blue-600 transition-colors" variant="ghost" type="submit">
                {isEdit ? "Update Project" : "Create Project"}
            </Button>
        </form>
    );
}