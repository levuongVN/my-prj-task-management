import { useState } from "react";
import {
    Search,
} from "lucide-react";
import TaskHeader from "../shared/components/task/TaskHeader";
import TaskStats from "../shared/components/task/TaskStats";
import TaskTableHeader from "../shared/components/task/TaskTableHeader";
import TaskRow from "../shared/components/task/TaskRow";
import Modal from "../shared/components/Ui/Modal";
import CreateTaskForm from "../shared/components/task/CreateTaskForm";
import FilterDropdown from "../shared/components/Ui/FilterDropdown";
import SortDropdown from "../shared/components/Ui/SortDropdown";
import type { Task } from "../shared/types/Task";
import TaskDetailModal from "../shared/components/task/TaskDetailModal";
import { priorities, statuses, TaskPriority, TaskStatus } from "../constants/taskOption";

const initialTasks = [
    {
        id: "uuid-1",
        title: "Design Landing Page",
        description: "Create modern hero section for SaaS website.",
        priority: TaskPriority.High,
        status: TaskStatus.InProgress,
        deadline: new Date().toISOString(),
        position: 0,
        userId: "user-uuid",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 2,
        title: "API Integration",
        description: "Connect payment gateway and build webhook endpoints.",
        priority: TaskPriority.Medium,
        status: TaskStatus.Pending,
        deadline: new Date().toISOString(),
        position: 0,
        userId: "user-uuid",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 3,
        title: "Team Meeting",
        description: "Weekly product discussion with team.",
        priority: TaskPriority.Low,
        status: TaskStatus.Completed,
        deadline: new Date().toISOString(),
        position: 0,
        userId: "user-uuid",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 4,
        title: "Analytics Dashboard",
        description: "Implement charts and KPI tracking.",
        priority: TaskPriority.High,
        status: TaskStatus.InReview,
        deadline: new Date().toISOString(),
        position: 0,
        userId: "user-uuid",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
] as Task[];

export default function TaskPage() {
    const [tasks, setTasks] = useState(initialTasks);
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState("due");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    const [isViewOpen, setIsViewOpen] = useState(false);

    const filteredTasks = tasks.filter((task) => {
        const matchesSearch =
            task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.description.toLowerCase().includes(searchTerm.toLowerCase());

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

    const handlePriorityChange = (id: string, value: number) => {
        setTasks((prev) =>
            prev.map((task) =>
                task.id === id ? { ...task, priority: value } : task
            )
        );
    };

    const handleStatusChange = (id: string, value: number) => {
        setTasks((prev) =>
            prev.map((task) =>
                task.id === id ? { ...task, status: value } : task
            )
        );
    };

    return (
        <div className="min-h-screen bg-black text-white p-6">
            {/* Header */}
            <TaskHeader onCreateTask={() => setIsOpen(true)} />

            {/* Search & Filter */}
            <div className="flex flex-col lg:flex-row gap-4 mb-8">
                <div className="flex-1 relative">
                    <Search
                        size={20}
                        className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500"
                    />

                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-14 rounded-2xl bg-zinc-950 border border-white/5 pl-14 pr-5 outline-none text-white placeholder:text-zinc-500 focus:border-zinc-700 transition"
                    />
                </div>

                <FilterDropdown
                    title="Filter Tasks"
                    groups={[
                        {
                            title: "Priority",
                            colors: {
                                High: "bg-red-500",
                                Medium: "bg-yellow-500",
                                Low: "bg-green-500",
                            },
                            options: priorities,
                            selected: selectedPriorities,
                            onChange: setSelectedPriorities,
                        },
                        {
                            title: "Status",
                            colors: {
                                Pending: "bg-yellow-500",
                                "In Progress": "bg-blue-500",
                                "In Review": "bg-purple-500",
                                Completed: "bg-green-500",
                            },
                            options: statuses,
                            selected: selectedStatuses,
                            onChange: setSelectedStatuses,
                        },
                    ]}
                    onClear={() => {
                        setSelectedPriorities([]);
                        setSelectedStatuses([]);
                    }}
                    className="
                    flex items-center gap-1.5 rounded-xl border border-white/10 cursor-pointer hover:bg-zinc-900 transition px-3 h-14
                    "
                />
                <SortDropdown
                    title="Sort Tasks"
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    options={[
                        { label: "Priority", value: "priority" },
                        { label: "Status", value: "status" },
                        { label: "Due Date", value: "due" },
                        { label: "Title", value: "title" },
                    ]}
                    className="flex items-center gap-1.5 rounded-xl border border-white/10 cursor-pointer hover:bg-zinc-900 transition px-3 h-14"
                    onSortByChange={setSortBy}
                    onSortOrderChange={setSortOrder}
                />
            </div>

            {/* Stats */}
            <TaskStats tasks={tasks} />

            {/* Task List */}
            <div className="rounded-[32px] border border-white/5 bg-zinc-950 overflow-hidden">
                {/* Header */}
                <TaskTableHeader />

                {/* Tasks */}
                <div>
                    {sortedTasks.map((task) => (
                        <TaskRow
                            key={task.id}
                            task={task}
                            onView={(task) => {
                                setSelectedTask(task);
                                setIsViewOpen(true);
                            }}
                            onPriorityChange={handlePriorityChange}
                            onStatusChange={handleStatusChange}
                        />
                    ))}
                </div>
            </div>

            {/* Create Task Modal */}
            <Modal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title="Create New Task"
                submitText="Create Task"
            >
                <CreateTaskForm onSubmit={() => { }} />
            </Modal>
            <TaskDetailModal
                isOpen={isViewOpen}
                task={selectedTask}
                onClose={() => {
                    setIsViewOpen(false);
                    setSelectedTask(null);
                }}
            />
        </div>
    );
}