import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import axios from "axios";

import { useTasks } from "../../task/hooks/useTask";
import { useCreateTask } from "../../task/hooks/useCreateTask";
import { useProjects } from "../../project/hooks/useProjects";
import { useCreateProject } from "../../project/hooks/useCreateProject";
import { useDeleteProject, useUpdateProject } from "../../project/hooks";

import { projectSchema, type ProjectFormValues } from "../../project/schemals/project.schemal";
import { PROJECT_STATUS_REVERSE } from "../../../constants/projectConst";
import { priorities, statuses } from "../../../constants/taskOption";
import { MONTH_NAMES } from "../../../constants/calendarConst";
import type { CreateTaskFormValues } from "../../task/schemas/task.schema";
import type { Meeting } from "../../../shared/types/Meeting";
import type { Project } from "../../../shared/types/Project";
import type { Task } from "../../../shared/types/Task";
import type { CalendarEvent, ViewMode } from "../../../shared/types/Calendar";
import { useMeetings } from "../Hooks/useMeeting";
import { useCreateMeeting } from "../Hooks/useCreateMeeting";
import type { CreateMeetingFormValues } from "../schemals/event.schema";
import type { ActiveTab } from "../components/CreateEventModal";
import { buildWeekDays, getTodayDateStr, toDateStr } from "../../../shared/utils/dateHelper";
import { deriveCalendarEvents } from "../../../shared/utils/deriveCalendarEvents";

export const TODAY_DATE = getTodayDateStr();

export type { ActiveTab };

export function useCalendarPage() {
    const [view, setView] = useState<ViewMode>("month");
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth());
    const [selectedDate, setSelectedDate] = useState(TODAY_DATE);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalDefaultDate, setModalDefaultDate] = useState(TODAY_DATE);

    const todayObj = new Date();
    const [weekStartDay, setWeekStartDay] = useState(todayObj.getDate() - todayObj.getDay());
    const [activeTab, setActiveTab] = useState<ActiveTab>("task");

    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isProjectPanelOpen, setIsProjectPanelOpen] = useState(false);

    // ── Meeting detail panel state ─────────────────────────────────────────────
    const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
    const [isMeetingPanelOpen, setIsMeetingPanelOpen] = useState(false);

    const { data: rawProjects = [], isLoading: isLoadingProjects } = useProjects();
    const { data: rawTasks = [], isLoading: isLoadingTasks } = useTasks();
    const { data: meetings = [], isLoading: isLoadingMeetings } = useMeetings();

    const isLoading = isLoadingProjects || isLoadingTasks || isLoadingMeetings;

    const createTaskMutation = useCreateTask();
    const createProjectMutation = useCreateProject();
    const createMeetingMutation = useCreateMeeting();

    const updateProjectMutation = useUpdateProject();
    const deleteProjectMutation = useDeleteProject();

    const isMutating =
        createTaskMutation.isPending ||
        createProjectMutation.isPending ||
        createMeetingMutation.isPending ||
        updateProjectMutation.isPending ||
        deleteProjectMutation.isPending;


    const projects = rawProjects.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description ?? undefined,
        status: p.status,
        due: p.due,
        progress: p.progress,
        overdue: new Date(p.due) < new Date() && p.status !== 1,
        taskIds: [],
    }));

    // ── Dùng meetings từ API thay vì MOCK_MEETINGS ─────────────────────────────
    const allEvents = deriveCalendarEvents(projects, rawTasks, meetings);

    const projectForm = useForm<ProjectFormValues>({
        resolver: zodResolver(projectSchema),
        defaultValues: { name: "", description: "", due: modalDefaultDate, status: "active" },
    });

    // ── Handlers ──────────────────────────────────────────────────────────────

    const handleCreateTask = (data: CreateTaskFormValues) => {
        createTaskMutation.mutate(
            {
                title: data.title,
                description: data.description,
                priority: priorities.indexOf(data.priority),
                status: statuses.indexOf(data.status),
                deadline: new Date(data.due).toISOString(),
                projectId: data.projectId? data.projectId : null,
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

    // ── Click event trên calendar ──────────────────────────────────────────────
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
            const project = projects.find((p) => p.id === event.sourceId);
            if (project) {
                setSelectedProject(project);
                setIsProjectPanelOpen(true);
            }
        }
    };

    const handleCloseMeetingPanel = () => {
        setIsMeetingPanelOpen(false);
        setTimeout(() => setSelectedMeeting(null), 300);
    };

    const [, , dayStr] = selectedDate.split("-");
    const selectedDayNum = parseInt(dayStr, 10);

    // ── Navigation ────────────────────────────────────────────────────────────

    const goBack = () => {
        if (view === "month") {
            if (month === 0) { setMonth(11); setYear((y) => y - 1); }
            else setMonth((m) => m - 1);
        } else if (view === "week") {
            const d = new Date(year, month, weekStartDay - 7);
            setYear(d.getFullYear()); setMonth(d.getMonth()); setWeekStartDay(d.getDate());
        } else {
            const d = new Date(year, month, selectedDayNum - 1);
            setSelectedDate(toDateStr(d.getFullYear(), d.getMonth(), d.getDate()));
        }
    };

    const goForward = () => {
        if (view === "month") {
            if (month === 11) { setMonth(0); setYear((y) => y + 1); }
            else setMonth((m) => m + 1);
        } else if (view === "week") {
            const d = new Date(year, month, weekStartDay + 7);
            setYear(d.getFullYear()); setMonth(d.getMonth()); setWeekStartDay(d.getDate());
        } else {
            const d = new Date(year, month, selectedDayNum + 1);
            setSelectedDate(toDateStr(d.getFullYear(), d.getMonth(), d.getDate()));
        }
    };

    const goToday = () => {
        const t = new Date();
        setYear(t.getFullYear());
        setMonth(t.getMonth());
        setSelectedDate(TODAY_DATE);
        setWeekStartDay(t.getDate() - t.getDay());
    };

    // ── Nav label ─────────────────────────────────────────────────────────────

    const navLabel = view === "month"
        ? `${MONTH_NAMES[month]} ${year}`
        : view === "week"
            ? (() => {
                const days = buildWeekDays(year, month, weekStartDay);
                return `${days[0].day} – ${days[6].day} ${MONTH_NAMES[month]} ${year}`;
            })()
            : (() => {
                const [y, m, d] = selectedDate.split("-").map(Number);
                return `${MONTH_NAMES[m - 1]} ${d}, ${y}`;
            })();

    const handleDayClick = (date: string) => {
        setSelectedDate(date);
        if (view === "month") setView("day");
    };

    const handleNewEvent = (date?: string) => {
        const d = date ?? selectedDate;
        setModalDefaultDate(d);
        setActiveTab("task");
        projectForm.reset({ name: "", description: "", due: d, status: "active" });
        setIsModalOpen(true);
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
                    toast.success("Project updated")
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

    const handleCloseTaskModal = () => {
        setIsTaskModalOpen(false);
        setTimeout(() => setSelectedTask(null), 300);
    };

    const handleCloseProjectPanel = () => {
        setIsProjectPanelOpen(false);
        setTimeout(() => setSelectedProject(null), 300);
    };

    const upcomingEvents = allEvents.filter((e) => e.date >= TODAY_DATE).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 5);

    const projectOptions = rawProjects.map((p) => ({ id: p.id, name: p.name }));

    return {
        view,
        setView,
        year,
        month,
        selectedDate,
        weekStartDay,
        navLabel,
        goBack,
        goForward,
        goToday,
        handleDayClick,
        handleNewEvent,
        isModalOpen,
        setIsModalOpen,
        modalDefaultDate,
        activeTab,
        setActiveTab,
        isEditOpen,
        setIsEditOpen,
        projectForm,
        isLoading,
        isMutating,
        allEvents,
        upcomingEvents,
        projectOptions,
        handleCreateTask,
        handleCreateProject,
        handleCreateMeeting,
        handleOpenEdit,
        handleEditProject,
        handleDeleteProject,
        selectedTask,
        isTaskModalOpen,
        handleCloseTaskModal,
        selectedProject,
        isProjectPanelOpen,
        handleCloseProjectPanel,
        selectedMeeting,
        isMeetingPanelOpen,
        handleCloseMeetingPanel,
        handleEventClick,
        setSelectedDate,
    };
}
