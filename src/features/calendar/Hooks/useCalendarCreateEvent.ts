import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import axios from "axios";

import { useCreateTask } from "../../task/hooks/useCreateTask";
import { useCreateProject } from "../../project/hooks/useCreateProject";

import { projectSchema, type ProjectFormValues } from "../../project/schemals/project.schemal";
import { PROJECT_STATUS_REVERSE } from "../../../constants/projectConst";
import { priorities, statuses } from "../../../constants/taskOption";
import type { CreateTaskFormValues } from "../../task/schemas/task.schema";
import type { CreateMeetingFormValues } from "../schemals/event.schema";
import type { ActiveTab } from "../components/CreateEventModal";
import { TODAY_DATE } from "./useCalendarNavigation";
import { useCreateMeeting } from "./useCreateMeeting";

export type { ActiveTab };

export function useCalendarCreateEvent() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalDefaultDate, setModalDefaultDate] = useState(TODAY_DATE);
    const [activeTab, setActiveTab] = useState<ActiveTab>("task");

    const createTaskMutation = useCreateTask();
    const createProjectMutation = useCreateProject();
    const createMeetingMutation = useCreateMeeting();

    const projectForm = useForm<ProjectFormValues>({
        resolver: zodResolver(projectSchema),
        defaultValues: { name: "", description: "", due: TODAY_DATE, status: "active" },
    });

    const handleNewEvent = (date?: string) => {
        const d = date ?? TODAY_DATE;
        setModalDefaultDate(d);
        setActiveTab("task");
        projectForm.reset({ name: "", description: "", due: d, status: "active" });
        setIsModalOpen(true);
    };

    const handleCreateTask = (data: CreateTaskFormValues) => {
        createTaskMutation.mutate(
            {
                title: data.title,
                description: data.description,
                priority: priorities.indexOf(data.priority),
                status: statuses.indexOf(data.status),
                deadline: new Date(data.due).toISOString(),
                projectId: data.projectId ? data.projectId : null,
            },
            {
                onSuccess: () => {
                    toast.success("Task created successfully");
                    setIsModalOpen(false);
                },
                onError: (error) => {
                    if (axios.isAxiosError(error)) {
                        toast.error(error.response?.data?.message ?? "Failed to create task");
                        return;
                    }
                    toast.error("Unexpected error");
                },
            }
        );
    };

    const handleCreateProject = (data: ProjectFormValues) => {
        createProjectMutation.mutate(
            {
                name: data.name,
                description: data.description ?? null,
                due: new Date(data.due).toISOString(),
                status: PROJECT_STATUS_REVERSE[data.status],
            },
            {
                onSuccess: () => {
                    toast.success("Project created successfully");
                    setIsModalOpen(false);
                },
                onError: () => {
                    toast.error("Failed to create project");
                },
            }
        );
    };

    const handleCreateMeeting = (data: CreateMeetingFormValues) => {
        createMeetingMutation.mutate(
            {
                title: data.title,
                startAt: new Date(data.startAt).toISOString(),
                projectId: data.projectId || null,
            },
            {
                onSuccess: () => {
                    toast.success("Meeting created successfully");
                    setIsModalOpen(false);
                },
                onError: (error) => {
                    if (axios.isAxiosError(error)) {
                        toast.error(error.response?.data?.message ?? "Failed to create meeting");
                        return;
                    }
                    toast.error("Unexpected error");
                },
            }
        );
    };

    return {
        isModalOpen,
        setIsModalOpen,
        modalDefaultDate,
        activeTab,
        setActiveTab,
        projectForm,
        handleNewEvent,
        handleCreateTask,
        handleCreateProject,
        handleCreateMeeting,
    };
}
