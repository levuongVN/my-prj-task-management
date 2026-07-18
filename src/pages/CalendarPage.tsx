import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Briefcase, Video } from "lucide-react";
import type { ViewMode, CalendarEventType, CalendarEvent } from "../shared/types/Calendar";
import Loading from "../shared/components/Ui/Loading";
import MonthView from "../shared/components/calendar/MonthView";
import WeekView from "../shared/components/calendar/WeekView";
import DayView from "../shared/components/calendar/DayView";
import { buildWeekDays, getTodayDateStr, toDateStr } from "../shared/utils/dateHelper";
import { deriveCalendarEvents } from "../shared/utils/deriveCalendarEvents";
import Modal from "../shared/components/Ui/Modal";
import { MONTH_NAMES, EVENT_STYLES } from "../constants/calendarConst";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import axios from "axios";

import { useTasks } from "../features/task/hooks/useTask";
import { useCreateTask } from "../features/task/hooks/useCreateTask";
import { useProjects } from "../features/project/hooks/useProjects";
import { useCreateProject } from "../features/project/hooks/useCreateProject";

import CreateTaskForm from "../shared/components/task/CreateTaskForm";
import ProjectForm from "../shared/components/project/ProjectForm";

import { projectSchema, type ProjectFormValues } from "../features/project/schemals/project.schemal";
import { PROJECT_STATUS_REVERSE } from "../constants/projectConst";
import { priorities, statuses } from "../constants/taskOption";
import { type CreateTaskFormValues } from "../features/task/schemas/task.schema";
import type { Meeting } from "../shared/types/Meeting";
import { useMeetings } from "../features/calendar/Hooks/useMeeting";
import { useCreateMeeting } from "../features/calendar/Hooks/useCreateMeeting";
import type { CreateMeetingFormValues } from "../features/calendar/schemals/event.schema";
import CreateMeetingForm from "../shared/components/calendar/FormCreateMeeting";
import MeetingDetailPanel from "../shared/components/calendar/MeetingDetailPanel";
import type { Project } from "../shared/types/Project";
import type { Task } from "../shared/types/Task";
import { useDeleteProject, useUpdateProject } from "../features/project/hooks";
import ProjectDetailPanel from "../shared/components/project/ProjectDetailPanel";
import TaskDetailModal from "../shared/components/task/TaskDetailModal";

const TODAY_DATE = getTodayDateStr();

type ActiveTab = "task" | "project" | "meeting";

export default function CalendarPage() {
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

    const getDisplayDate = (event: CalendarEvent) => {
        if (event.time) return event.time; // meeting → hiện giờ

        if (!event.date) return "—";

        try {
            const [y, m, d] = event.date.split("-").map(Number);
            const date = new Date(y, m - 1, d);
            return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        } catch {
            return "—";
        }
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

    const tabs: { key: ActiveTab; label: string; icon: React.ReactNode }[] = [
        { key: "task", label: "Task", icon: <CalendarIcon size={14} /> },
        { key: "project", label: "Project", icon: <Briefcase size={14} /> },
        { key: "meeting", label: "Meeting", icon: <Video size={14} /> },
    ];

    const projectOptions = rawProjects.map((p) => ({ id: p.id, name: p.name }));

    return (
        <div className="min-h-screen bg-[#0d0d0d] px-7 py-7 font-sans">
            {/* Page header */}
            <div className="mb-6 flex items-end justify-between">
                <div>
                    <p className="mb-1.5 text-[11px] font-medium uppercase tracking-widest text-zinc-600">Schedule</p>
                    <h1 className="text-[22px] font-medium text-white">Calendar</h1>
                    <p className="mt-1 text-sm text-zinc-600">Manage your events, tasks and milestones.</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5 rounded-xl border border-white/8 bg-[#1a1a1a] p-1">
                        {(["day", "week", "month"] as ViewMode[]).map((v) => (
                            <button
                                key={v}
                                onClick={() => setView(v)}
                                className={`rounded-[9px] px-3.5 py-1.5 text-xs font-medium capitalize transition-all ${view === v ? "bg-accent text-accent-fg" : "text-zinc-500 hover:text-zinc-300"}`}
                            >
                                {v}
                            </button>
                        ))}
                    </div>
                    <button onClick={goToday} className="rounded-xl border border-white/10 bg-transparent px-3.5 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors">
                        Today
                    </button>
                    <button
                        onClick={() => handleNewEvent()}
                        className="flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-sm font-medium text-black hover:bg-zinc-200 transition-colors"
                    >
                        <Plus size={14} /> New event
                    </button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={goBack} className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/8 bg-[#1a1a1a] text-zinc-500 hover:text-zinc-300 transition-colors">
                        <ChevronLeft size={14} />
                    </button>
                    <span className="min-w-[160px] text-center text-base font-medium text-white">{navLabel}</span>
                    <button onClick={goForward} className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/8 bg-[#1a1a1a] text-zinc-500 hover:text-zinc-300 transition-colors">
                        <ChevronRight size={14} />
                    </button>
                </div>
                <div className="flex items-center gap-4">
                    {(Object.entries(EVENT_STYLES) as [CalendarEventType, typeof EVENT_STYLES[CalendarEventType]][]).map(([type, style]) => (
                        <div key={type} className="flex items-center gap-1.5">
                            <div className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                            <span className="text-xs capitalize text-zinc-600">{type}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Views */}
            {isLoading ? (
                <div className="flex h-[400px] items-center justify-center">
                    <Loading text="Loading calendar..." />
                </div>
            ) : (
                <>
                    {view === "month" && (
                        <MonthView year={year} month={month} allEvents={allEvents} todayDate={TODAY_DATE} onDayClick={handleDayClick} onEventClick={handleEventClick} />
                    )}
                    {view === "week" && (
                        <WeekView year={year} month={month} weekStartDay={weekStartDay} allEvents={allEvents} todayDate={TODAY_DATE} onDayClick={handleDayClick} onEventClick={handleEventClick} />
                    )}
                    {view === "day" && (
                        <DayView date={selectedDate} allEvents={allEvents} onNewEvent={() => handleNewEvent(selectedDate)} onEventClick={handleEventClick} />
                    )}
                </>
            )}

            {/* Upcoming panel */}
            <div className="mt-5 rounded-xl border border-white/15 bg-[#141414] p-4">
                <p className="mb-3 text-[11px] font-medium uppercase tracking-widest text-zinc-700">Upcoming</p>
                {
                    isLoading ? (
                        <div className="flex h-[100px] items-center justify-center">
                            <Loading text="Loading events..." />
                        </div>
                    ) : upcomingEvents.length === 0 ? (
                        <p className="text-sm text-zinc-600">No upcoming events</p>
                    ) : (
                        <div className="space-y-0.5">
                            {upcomingEvents.map((event) => {
                                const s = EVENT_STYLES[event.type];
                                const displayDate = getDisplayDate(event);
                                return (
                                    <div
                                        key={event.id}
                                        onClick={() => {
                                            if (event.sourceType === "meeting") {
                                                handleEventClick(event);
                                            } else {
                                                setSelectedDate(event.date.split("T")[0]);
                                                setView("day");
                                            }
                                        }}
                                        className="flex items-center gap-3 rounded-lg px-2 py-2.5 hover:bg-white/4 transition-colors cursor-pointer"
                                    >
                                        <div className={`h-2 w-2 flex-shrink-0 rounded-full ${s.dot}`} />
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm text-zinc-300">{event.title}</p>
                                            <p className="text-xs text-zinc-600 mt-0.5 capitalize">
                                                {event.type}{event.projectName ? ` · ${event.projectName}` : ""}
                                            </p>
                                        </div>
                                        <span className="flex-shrink-0 text-xs text-zinc-600">{displayDate}</span>
                                    </div>
                                );
                            })}
                        </div>
                    )
                }
            </div>

            {/* Create event modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create new event">
                <div className="flex gap-2 mb-6 bg-zinc-900 p-1 rounded-xl">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.key ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"
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
                        onSubmit={handleCreateTask}
                        isLoading={isMutating}
                        projects={projectOptions}
                    />
                )}

                {activeTab === "project" && (
                    <FormProvider {...projectForm}>
                        <ProjectForm isLoading = {isMutating} onSubmit={handleCreateProject} />
                    </FormProvider>
                )}

                {activeTab === "meeting" && (
                    <CreateMeetingForm
                        key={`meeting-form-${modalDefaultDate}`}
                        onSubmit={handleCreateMeeting}
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

            <Modal
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                title="Edit Project"
            >
                <FormProvider {...projectForm}>
                    <ProjectForm isEdit={true} onSubmit={handleEditProject} />
                </FormProvider>
            </Modal>

            {/* Meeting detail panel */}
            <MeetingDetailPanel
                meeting={selectedMeeting}
                isOpen={isMeetingPanelOpen}
                onClose={handleCloseMeetingPanel}
                projects={projectOptions}
            />
            {/* Task detail modal */}
            <TaskDetailModal
                isOpen={isTaskModalOpen}
                task={selectedTask}
                onClose={handleCloseTaskModal}
            />

            {/* Project detail panel */}
            <ProjectDetailPanel
                project={selectedProject}
                isOpen={isProjectPanelOpen}
                onClose={handleCloseProjectPanel}
                onEdit={handleOpenEdit}
                onDelete={handleDeleteProject}
                isLoading = {isMutating}
            />
        </div>
    );
}