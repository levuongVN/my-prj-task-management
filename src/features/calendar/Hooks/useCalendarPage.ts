import { useMemo } from "react";

import { useTasks } from "../../task/hooks/useTask";
import { useProjects } from "../../project/hooks/useProjects";

import { useCalendarNavigation, TODAY_DATE } from "./useCalendarNavigation";
import { useCalendarCreateEvent } from "./useCalendarCreateEvent";
import { useCalendarDetailPanels } from "./useCalendarDetailPanels";

import { deriveCalendarEvents } from "../../../shared/utils/deriveCalendarEvents";
import { useMeetings } from "./useMeeting";

export { TODAY_DATE } from "./useCalendarNavigation";
export type { ActiveTab } from "./useCalendarCreateEvent";

export function useCalendarPage() {
    // ── Data fetching ────────────────────────────────────────────────────────
    const { data: rawProjects = [], isLoading: isLoadingProjects } = useProjects();
    const { data: rawTasks = [], isLoading: isLoadingTasks } = useTasks();
    const { data: meetings = [], isLoading: isLoadingMeetings } = useMeetings();

    const isLoading = isLoadingProjects || isLoadingTasks || isLoadingMeetings;

    // ── Derived data (memoized) ──────────────────────────────────────────────
    const projects = useMemo(
        () => rawProjects.map((p) => ({
            id: p.id,
            name: p.name,
            description: p.description ?? undefined,
            status: p.status,
            due: p.due,
            progress: p.progress,
            overdue: new Date(p.due) < new Date() && p.status !== 1,
            taskIds: [],
        })),
        [rawProjects]
    );

    const allEvents = useMemo(
        () => deriveCalendarEvents(projects, rawTasks, meetings),
        [projects, rawTasks, meetings]
    );

    const upcomingEvents = useMemo(
        () => allEvents
            .filter((e) => e.date >= TODAY_DATE)
            .sort((a, b) => a.date.localeCompare(b.date))
            .slice(0, 5),
        [allEvents]
    );

    const projectOptions = useMemo(
        () => rawProjects.map((p) => ({ id: p.id, name: p.name })),
        [rawProjects]
    );

    // ── Sub-hooks ────────────────────────────────────────────────────────────
    const navigation = useCalendarNavigation();
    const createEvent = useCalendarCreateEvent();

    const detailPanels = useCalendarDetailPanels({
        rawTasks,
        meetings,
        mappedProjects: projects,
        projectForm: createEvent.projectForm,
    });

    // ── Mutation loading states ──────────────────────────────────────────────
    const isMutating = false; // Sub-hooks manage their own mutation states

    return {
        // Navigation
        ...navigation,

        // Create event
        isModalOpen: createEvent.isModalOpen,
        setIsModalOpen: createEvent.setIsModalOpen,
        modalDefaultDate: createEvent.modalDefaultDate,
        activeTab: createEvent.activeTab,
        setActiveTab: createEvent.setActiveTab,
        projectForm: createEvent.projectForm,
        handleNewEvent: createEvent.handleNewEvent,
        handleCreateTask: createEvent.handleCreateTask,
        handleCreateProject: createEvent.handleCreateProject,
        handleCreateMeeting: createEvent.handleCreateMeeting,

        // Detail panels
        selectedTask: detailPanels.selectedTask,
        isTaskModalOpen: detailPanels.isTaskModalOpen,
        handleCloseTaskModal: detailPanels.handleCloseTaskModal,
        selectedProject: detailPanels.selectedProject,
        isEditOpen: detailPanels.isEditOpen,
        setIsEditOpen: detailPanels.setIsEditOpen,
        isProjectPanelOpen: detailPanels.isProjectPanelOpen,
        handleCloseProjectPanel: detailPanels.handleCloseProjectPanel,
        handleOpenEdit: detailPanels.handleOpenEdit,
        handleEditProject: detailPanels.handleEditProject,
        handleDeleteProject: detailPanels.handleDeleteProject,
        selectedMeeting: detailPanels.selectedMeeting,
        isMeetingPanelOpen: detailPanels.isMeetingPanelOpen,
        handleCloseMeetingPanel: detailPanels.handleCloseMeetingPanel,
        handleEventClick: detailPanels.handleEventClick,

        // Data
        isLoading,
        isMutating,
        allEvents,
        upcomingEvents,
        projectOptions,
    };
}
