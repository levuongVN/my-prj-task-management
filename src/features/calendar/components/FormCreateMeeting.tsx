import { Controller, useForm, type DefaultValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../../../shared/components/Ui/Button";
import ProjectSelect from "../../../features/project/components/ProjectSelect";
import type { ProjectOption } from "../../../features/project/components/ProjectSelect";
import { createMeetingSchema, type CreateMeetingFormValues } from "../schemals/event.schema";

interface Props {
    defaultValues?: DefaultValues<CreateMeetingFormValues>;
    onSubmit: (data: CreateMeetingFormValues) => void;
    projects: ProjectOption[];
    isLoading?: boolean;
}

export default function CreateMeetingForm({ onSubmit, defaultValues, projects, isLoading }: Props) {
    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm<CreateMeetingFormValues>({
        resolver: zodResolver(createMeetingSchema),
        defaultValues: defaultValues ?? {
            title: "",
            startAt: "",
            projectId: "",
        },
    });

    return (
        <form
            id="create-meeting-form"
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
                    placeholder="e.g. Weekly sync"
                    className="
                        w-full h-12
                        rounded-2xl
                        border border-white/10
                        bg-black
                        px-4
                        text-white
                        outline-none
                        placeholder:text-zinc-600
                        focus:border-white/30
                    "
                />
                {errors.title && (
                    <p className="mt-2 text-sm text-red-400">{errors.title.message}</p>
                )}
            </div>

            {/* Start At */}
            <div>
                <label className="mb-2 block text-sm text-zinc-400">
                    Start time
                </label>
                <input
                    type="datetime-local"
                    {...register("startAt")}
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
                {errors.startAt && (
                    <p className="mt-2 text-sm text-red-400">{errors.startAt.message}</p>
                )}
            </div>

            {/* Project (optional) */}
            <Controller
                control={control}
                name="projectId"
                render={({ field }) => (
                    <div>
                        <label className="mb-2 block text-sm text-zinc-400">
                            Project
                            <span className="ml-1.5 text-zinc-600">(optional)</span>
                        </label>
                        <ProjectSelect
                            value={field.value}
                            onChange={field.onChange}
                            projects={projects}
                        />
                    </div>
                )}
            />

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={() => reset()}
                >
                    Reset
                </Button>
                <Button isLoading = {isLoading} type="submit" variant="primary">
                    Create Meeting
                </Button>
            </div>
        </form>
    );
}