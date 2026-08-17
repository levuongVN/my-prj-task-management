import { Calendar as CalendarIcon, Briefcase, Video } from "lucide-react";
import { FormProvider, type UseFormReturn } from "react-hook-form";
import Modal from "../../../shared/components/Ui/Modal";
import CreateTaskForm from "../../task/components/CreateTaskForm";
import ProjectForm from "../../project/components/ProjectForm";
import CreateMeetingForm from "./FormCreateMeeting";
import type { ProjectFormValues } from "../../../features/project/schemals/project.schemal";
import type { CreateTaskFormValues } from "../../../features/task/schemas/task.schema";
import type { CreateMeetingFormValues } from "../../../features/calendar/schemals/event.schema";

export type ActiveTab = "task" | "project" | "meeting";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    activeTab: ActiveTab;
    onTabChange: (t: ActiveTab) => void;
    modalDefaultDate: string;
    projectOptions: { id: string; name: string }[];
    isMutating: boolean;
    projectForm: UseFormReturn<ProjectFormValues>;
    onCreateTask: (data: CreateTaskFormValues) => void;
    onCreateProject: (data: ProjectFormValues) => void;
    onCreateMeeting: (data: CreateMeetingFormValues) => void;
}

export function CreateEventModal({
    isOpen,
    onClose,
    activeTab,
    onTabChange,
    modalDefaultDate,
    projectOptions,
    isMutating,
    projectForm,
    onCreateTask,
    onCreateProject,
    onCreateMeeting,
}: Props) {
    const tabs: { key: ActiveTab; label: string; icon: React.ReactNode }[] = [
        { key: "task", label: "Task", icon: <CalendarIcon size={14} /> },
        { key: "project", label: "Project", icon: <Briefcase size={14} /> },
        { key: "meeting", label: "Meeting", icon: <Video size={14} /> },
    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create new event">
            <div className="flex gap-2 mb-6 border border-border-subtle bg-zinc-900 p-1 rounded-xl">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => onTabChange(tab.key)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.key ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
                            }`}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {activeTab === "task" && (
                <CreateTaskForm
                    key={`task-form-${modalDefaultDate}`}
                    onSubmit={onCreateTask}
                    isLoading={isMutating}
                    projects={projectOptions}
                />
            )}

            {activeTab === "project" && (
                <FormProvider {...projectForm}>
                    <ProjectForm isLoading = {isMutating} onSubmit={onCreateProject} />
                </FormProvider>
            )}

            {activeTab === "meeting" && (
                <CreateMeetingForm
                    key={`meeting-form-${modalDefaultDate}`}
                    onSubmit={onCreateMeeting}
                    defaultValues={{
                        title: "",
                        startAt: `${modalDefaultDate}T09:00`,
                        projectId: "",
                    }}
                    isLoading={isMutating}
                    projects={projectOptions}
                />
            )}
        </Modal>
    );
}
