import Loading from "../shared/components/Ui/Loading";
import MonthView from "../features/calendar/components/MonthView";
import WeekView from "../features/calendar/components/WeekView";
import DayView from "../features/calendar/components/DayView";
import Modal from "../shared/components/Ui/Modal";
import { FormProvider } from "react-hook-form";

import ProjectForm from "../features/project/components/ProjectForm";
import MeetingDetailPanel from "../features/calendar/components/MeetingDetailPanel";
import TaskDetailModal from "../features/task/components/TaskDetailModal";
import ProjectDetailPanel from "../features/project/components/ProjectDetailPanel";

import { useCalendarPage, TODAY_DATE } from "../features/calendar/Hooks/useCalendarPage";
import { CalendarPageHeader } from "../features/calendar/components/CalendarPageHeader";
import { CalendarToolbar } from "../features/calendar/components/CalendarToolbar";
import { UpcomingPanel } from "../features/calendar/components/UpcomingPanel";
import { CreateEventModal } from "../features/calendar/components/CreateEventModal";

export default function CalendarPage() {
    const {
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
    } = useCalendarPage();

    const handleNavigateToDate = (date: string) => {
        setSelectedDate(date);
        setView("day");
    };

    return (
        <div className="min-h-screen bg-[#0d0d0d] px-7 py-7 font-sans">
            {/* Page header */}
            <CalendarPageHeader
                view={view}
                onViewChange={setView}
                onGoToday={goToday}
                onNewEvent={handleNewEvent}
            />

            {/* Toolbar */}
            <CalendarToolbar
                navLabel={navLabel}
                onBack={goBack}
                onForward={goForward}
            />

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
            <UpcomingPanel
                events={upcomingEvents}
                isLoading={isLoading}
                onEventClick={handleEventClick}
                onNavigateToDate={handleNavigateToDate}
            />

            {/* Create event modal */}
            <CreateEventModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                modalDefaultDate={modalDefaultDate}
                projectOptions={projectOptions}
                isMutating={isMutating}
                projectForm={projectForm}
                onCreateTask={handleCreateTask}
                onCreateProject={handleCreateProject}
                onCreateMeeting={handleCreateMeeting}
            />

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
