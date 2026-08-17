import { useState  } from "react";
import toast from "react-hot-toast";

import { useUpdateProject, useDeleteProject } from "../../project/hooks";

import { PROJECT_STATUS_REVERSE } from "../../../constants/projectConst";
import type { ProjectFormValues } from "../../project/schemals/project.schemal";
import type { CalendarEvent } from "../../../shared/types/Calendar";
import type { Meeting } from "../../../shared/types/Meeting";
import type { Project } from "../../../shared/types/Project";
import type { Task } from "../../../shared/types/Task";
import type { UseFormReturn } from "react-hook-form";

interface Params {
    rawTasks: Task[];
    meetings: Meeting[];
    mappedProjects: { id: string; name: string; description?: string; status: number; due: string; progress: number; overdue: boolean; taskIds: string[] }[];
    projectForm: UseFormReturn<ProjectFormValues>;
}

export function useCalendarDetailPanels({ rawTasks, meetings, mappedProjects, projectForm }: Params) {
    // ── Task detail ────────────────────────────────────────────────────────────
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

    const handleCloseTaskModal = () => {
        setIsTaskModalOpen(false);
        setTimeout(() => setSelectedTask(null), 300);
    };

    // ── Project detail ─────────────────────────────────────────────────────────
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isProjectPanelOpen, setIsProjectPanelOpen] = useState(false);

    const updateProjectMutation = useUpdateProject();
    const deleteProjectMutation = useDeleteProject();

    const handleCloseProjectPanel = () => {
        setIsProjectPanelOpen(false);
        setTimeout(() => setSelectedProject(null), 300);
    };

    const handleOpenEdit = (project: Project) => {
        const statusKey = Object.entries(PROJECT_STATUS_REVERSE).find(
            ([, v]) => v === project.status
        )?.[0] as ProjectFormValues["status"] | undefined;

        projectForm.reset({
            name: project.name,
            description: project.description ?? "",
            due: project.due.split("T")[0],
            status: statusKey ?? "active",
        });
        setIsEditOpen(true);
    };

    const handleEditProject = (data: ProjectFormValues) => {
        if (!selectedProject) return;
        updateProjectMutation.mutate(
            {
                id: selectedProject.id,
                projectPayload: {
                    name: data.name,
                    description: data.description ?? null,
                    due: new Date(data.due).toISOString(),
                    status: PROJECT_STATUS_REVERSE[data.status],
                },
            },
            {
                onSuccess: () => {
                    toast.success("Project updated");
                    setIsEditOpen(false);
                },
                onError: () => toast.error("Failed to update project"),
            }
        );
    };

    const handleDeleteProject = (project: Project) => {
        deleteProjectMutation.mutate(project.id, {
            onSuccess: () => {
                handleCloseProjectPanel();
                toast.success("Project deleted");
            },
            onError: () => toast.error("Failed to delete project"),
        });
    };

    // ── Meeting detail ─────────────────────────────────────────────────────────
    const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
    const [isMeetingPanelOpen, setIsMeetingPanelOpen] = useState(false);

    const handleCloseMeetingPanel = () => {
        setIsMeetingPanelOpen(false);
        setTimeout(() => setSelectedMeeting(null), 300);
    };

    // ── Event click routing ────────────────────────────────────────────────────
    const handleEventClick = (event: CalendarEvent) => {
        if (event.sourceType === "meeting") {
            const meeting = meetings.find((m) => m.id === event.sourceId);
            if (meeting) {
                setSelectedMeeting(meeting);
                setIsMeetingPanelOpen(true);
            }
        } else if (event.sourceType === "task") {
            const task = rawTasks.find((t) => t.id === event.sourceId);
            if (task) {
                setSelectedTask(task);
                setIsTaskModalOpen(true);
            }
        } else if (event.sourceType === "project") {
            const project = mappedProjects.find((p) => p.id === event.sourceId);
            if (project) {
                setSelectedProject(project as Project);
                setIsProjectPanelOpen(true);
            }
        }
    };

    return {
        selectedTask,
        isTaskModalOpen,
        handleCloseTaskModal,
        selectedProject,
        isEditOpen,
        setIsEditOpen,
        isProjectPanelOpen,
        handleCloseProjectPanel,
        handleOpenEdit,
        handleEditProject,
        handleDeleteProject,
        selectedMeeting,
        isMeetingPanelOpen,
        handleCloseMeetingPanel,
        handleEventClick,
    };
}
