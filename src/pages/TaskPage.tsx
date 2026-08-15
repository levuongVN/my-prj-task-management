import { useState } from "react";
import TaskHeader from "../features/task/components/TaskHeader";
import TaskStats from "../features/task/components/TaskStats";
import TaskTableHeader from "../features/task/components/TaskTableHeader";
import TaskRow from "../features/task/components/TaskRow";
import Modal from "../shared/components/Ui/Modal";
import CreateTaskForm from "../features/task/components/CreateTaskForm";
import TaskDetailModal from "../features/task/components/TaskDetailModal";
import TaskBoard from "../features/task/components/TaskBoard";
import { TaskToolbar } from "../features/task/components/TaskToolbar";
import { priorities, statuses } from "../constants/taskOption";
import { useTasks } from "../features/task/hooks/useTask";
import { useCreateTask } from "../features/task/hooks/useCreateTask";
import { useUpdateTask } from "../features/task/hooks/useUpdateTask";
import Loading from "../shared/components/Ui/Loading";
import toast from "react-hot-toast";
import axios from "axios";
import { useProjects } from "../features/project/hooks";

export default function TaskPage() {
    const {
        data: tasks = [],
        isLoading,
        error,
    } = useTasks();
    const { data: projects = [] } = useProjects();
    const createTaskMutation = useCreateTask();
    const updateTaskMutation = useUpdateTask();
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState("due");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [viewMode, setViewMode] = useState<"list" | "board">("list");

    const selectedTask =
        tasks.find((task) => task.id === selectedTaskId) ?? null;

    const filteredTasks = tasks.filter((task) => {
        const matchesSearch =
            task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (task.description ?? "").toLowerCase().includes(searchTerm.toLowerCase());

        const matchesPriority =
            selectedPriorities.length === 0 ||
            selectedPriorities.includes(priorities[task.priority]);

        const matchesStatus =
            selectedStatuses.length === 0 ||
            selectedStatuses.includes(statuses[task.status]);

        return (
            matchesSearch &&
            matchesPriority &&
            matchesStatus
        );
    });
    const sortedTasks = [...filteredTasks].sort((a, b) => {
        switch (sortBy) {
            case "title":
                return sortOrder === "asc"
                    ? a.title.localeCompare(b.title)
                    : b.title.localeCompare(a.title);

            case "priority":
                return sortOrder === "asc"
                    ? a.priority - b.priority
                    : b.priority - a.priority;

            case "status":
                return sortOrder === "asc"
                    ? a.status - b.status
                    : b.status - a.status;

            default:
                return 0;
        }
    });

    const handlePriorityChange = (id: string, priority: number) => {
        const task = tasks.find((t) => t.id === id);
        if (!task) return;
        updateTaskMutation.mutate({
            id,
            taskPayload: {
                title: task.title,
                description: task.description,
                projectId: task.projectId,
                priority,
                status: task.status,
                deadline: task.deadline,
            },
        })
    };

    const handleStatusChange = (id: string, status: number) => {
        const task = tasks.find((t) => t.id === id);
        if (!task) return;
        updateTaskMutation.mutate({
            id,
            taskPayload: {
                title: task.title,
                description: task.description,
                projectId: task.projectId,
                priority: task.priority,
                status,
                deadline: task.deadline,
            },
        })
    };

    if (isLoading) {
        return <Loading fullScreen />;
    }

    if (error) {
        return (
            <div className="p-6 text-red-500">
                Failed to load tasks
            </div>
        );
    }
    return (
        <div className="min-h-screen bg-black text-white p-6">
            {/* Header */}
            <TaskHeader onCreateTask={() => setIsOpen(true)} />

            {/* Search & Filter */}
            <TaskToolbar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                selectedPriorities={selectedPriorities}
                onPrioritiesChange={setSelectedPriorities}
                selectedStatuses={selectedStatuses}
                onStatusesChange={setSelectedStatuses}
                onClearFilters={() => {
                    setSelectedPriorities([]);
                    setSelectedStatuses([]);
                }}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortByChange={setSortBy}
                onSortOrderChange={setSortOrder}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
            />

            {/* Stats */}
            <TaskStats tasks={tasks.map((t) => ({ ...t, deadline: t.deadline ?? undefined }))} />

            {/* Task List / Board */}
            {viewMode === "list" ? (
                <div className="rounded-[32px] border border-white/5 bg-zinc-950 overflow-scroll">
                    {/* Header */}
                    <TaskTableHeader />
                    {/* Tasks */}
                    <div>
                        {sortedTasks.map((task) => (
                            <TaskRow
                                key={task.id}
                                task={{ ...task, deadline: task.deadline ?? undefined }}
                                onView={(task) => {
                                    setSelectedTaskId(task.id);
                                    setIsViewOpen(true);
                                }}
                                onPriorityChange={handlePriorityChange}
                                onStatusChange={handleStatusChange}
                            />
                        ))}
                    </div>
                </div>
            ) : (
                <TaskBoard 
                    tasks={sortedTasks} 
                    onStatusChange={handleStatusChange} 
                    onViewTask={(task) => {
                        setSelectedTaskId(task.id);
                        setIsViewOpen(true);
                    }}
                />
            )}

            {/* Create Task Modal */}
            <Modal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title="Create New Task"
                submitText="Create Task"
            >
                <CreateTaskForm 
                    isLoading={createTaskMutation.isPending}
                    onSubmit={(data) => {
                    createTaskMutation.mutate({
                        title: data.title,
                        description: data.description? data.description : null,
                        priority: priorities.indexOf(data.priority),
                        status: statuses.indexOf(data.status),
                        deadline: new Date(data.due).toISOString(),
                        projectId: data.projectId ? data.projectId : null,
                    },
                        {
                            onSuccess: () => {
                                toast.success("Task created successfully");
                                setIsOpen(false);
                            },

                            onError: (error) => {
                                if (axios.isAxiosError(error)) {
                                    toast.error(
                                        error.response?.data?.message ??
                                        "Failed to create task"
                                    );
                                    return;
                                }

                                toast.error("Unexpected error");
                            },
                        }
                    );

                } } 
                projects={projects.map((project) => (
                    {
                        id: project.id,
                        name: project.name,
                    }
                ))}
                 />
            </Modal>
            <TaskDetailModal
                isOpen={isViewOpen}
                task={selectedTask ? { ...selectedTask, deadline: selectedTask.deadline ?? undefined } : null}
                onClose={() => {
                    setIsViewOpen(false);
                    setSelectedTaskId(null);
                }}
            />
        </div>
    );
}