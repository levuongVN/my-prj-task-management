import Modal from "../Ui/Modal";
import {
    CalendarDays,
    Flag,
    CircleCheckBig,
    Pencil,
    Trash2,
    FolderKanban,
} from "lucide-react";

import type { Task } from "../../types/Task";
import Button from "../Ui/Button";
import { priorities, statuses } from "../../../constants/taskOption";
import { useState } from "react";
import CreateTaskForm from "./CreateTaskForm";
import { useUpdateTask } from "../../../features/task/hooks/useUpdateTask";
import toast from "react-hot-toast";
import axios from "axios";
import useDeleteTask from "../../../features/task/hooks/useDeleteTask";
import { useProjects } from "../../../features/project/hooks";

interface Props {
    isOpen: boolean;
    task: Task | null;
    onClose: () => void;
}

export default function TaskDetailModal({ isOpen, task, onClose }: Props) {
    const [isEditing, setIsEditing] = useState(false);
    const { data: projects = [] } = useProjects();
    const updateTaskMutation = useUpdateTask();
    const deleteTaskMutation = useDeleteTask();
    if (!task) return null;

    const priorityBadge = {
        High: "bg-red-100 text-red-700",
        Medium: "bg-amber-100 text-amber-700",
        Low: "bg-green-100 text-green-700",
    };

    const statusBadge = {
        "Pending": "bg-orange-100 text-orange-700",
        "In Progress": "bg-blue-100 text-blue-700",
        "In Review": "bg-purple-100 text-purple-700",
        "Completed": "bg-green-100 text-green-700",
    };

    const formatDate = (date: string) => date.substring(0, 10);

    const taskProject = projects.find((p) => p.id === task.projectId);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditing ? "Edit Task" : "Task Overview"}
            size="md"
        >
            {isEditing ? (
                <CreateTaskForm
                    defaultValues={{
                        title: task.title,
                        description: task.description,
                        priority: priorities[task.priority] as "High" | "Medium" | "Low",
                        status: statuses[task.status] as "Pending" | "In Progress" | "In Review" | "Completed",
                        due: task.deadline ? formatDate(task.deadline) : "",
                        projectId: task.projectId ?? "",
                    }}
                    onSubmit={(data) => {
                        updateTaskMutation.mutate(
                            {
                                id: task.id,
                                taskPayload: {
                                    title: data.title,
                                    description: data.description,
                                    priority: priorities.indexOf(data.priority),
                                    status: statuses.indexOf(data.status),
                                    deadline: new Date(data.due).toISOString(),
                                    projectId: data.projectId || null,
                                },
                            },
                            {
                                onSuccess: () => {
                                    toast.success("Task updated successfully");
                                    setIsEditing(false);
                                },

                                onError: (error) => {
                                    if (axios.isAxiosError(error)) {
                                        toast.error(
                                            error.response?.data?.message ??
                                            "Failed to update task"
                                        );
                                        return;
                                    }

                                    toast.error("Unexpected error");
                                },
                            })
                    }}
                    projects={projects.map((project) => (
                        {
                            id: project.id,
                            name: project.name,
                        }
                    ))}
                />
            ) : (
                <div className="overflow-hidden rounded-2xl border border-white/8 bg-zinc-950">

                    {/* Hero */}
                    <div className="px-6 py-5 border-b border-white/8">
                        <h2 className="text-lg font-medium text-white leading-snug">
                            {task.title}
                        </h2>

                        <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                            {task.description}
                        </p>
                    </div>

                    {/* Project */}
                    <div className="flex items-center gap-2 px-6 py-3 border-b border-white/8">
                        <FolderKanban size={14} className="text-zinc-500" />
                        <span className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
                            Project
                        </span>
                        {taskProject ? (
                            <span className="ml-1 inline-flex w-fit items-center rounded-full bg-white/8 px-2.5 py-1 text-xs font-medium text-white">
                                {taskProject.name}
                            </span>
                        ) : (
                            <span className="ml-1 text-xs font-medium text-zinc-500">
                                No project
                            </span>
                        )}
                    </div>

                    {/* Meta grid */}
                    <div className="grid grid-cols-3 divide-x divide-white/8 border-b border-white/8">
                        <div className="flex flex-col gap-2 px-5 py-4">
                            <span className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-zinc-500">
                                <Flag size={12} />
                                Priority
                            </span>

                            <span
                                className={`inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-medium
                                ${priorityBadge[
                                    priorities[task.priority] as keyof typeof priorityBadge
                                    ]
                                    }`}
                            >
                                {priorities[task.priority]}
                            </span>
                        </div>

                        <div className="flex flex-col gap-2 px-5 py-4">
                            <span className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-zinc-500">
                                <CircleCheckBig size={12} />
                                Status
                            </span>

                            <span
                                className={`inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-medium
                                ${statusBadge[
                                    statuses[task.status] as keyof typeof statusBadge
                                    ]
                                    }`}
                            >
                                {statuses[task.status]}
                            </span>
                        </div>

                        <div className="flex flex-col gap-2 px-5 py-4">
                            <span className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-zinc-500">
                                <CalendarDays size={12} />
                                Due date
                            </span>

                            <span className="text-sm font-medium text-white">
                                {task.deadline ? formatDate(task.deadline) : "—"}
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 px-6 py-4">
                        <Button
                            variant="secondary"
                            className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium"
                            onClick={() => setIsEditing(true)}
                        >
                            <Pencil size={14} />
                            Edit
                        </Button>

                        <Button
                            onClick={() => {
                                updateTaskMutation.mutate(
                                    {
                                        id: task.id,
                                        taskPayload: {
                                            title: task.title,
                                            description: task.description,
                                            priority: task.priority,
                                            status: statuses.indexOf("Completed"),
                                            deadline: task.deadline,
                                        },
                                    },
                                    {
                                        onSuccess: () => {
                                            toast.success("Task marked as complete");
                                            onClose();
                                        },

                                        onError: (error) => {
                                            if (axios.isAxiosError(error)) {
                                                toast.error(
                                                    error.response?.data?.message ??
                                                    "Failed to update task"
                                                );
                                                return;
                                            }

                                            toast.error("Unexpected error");
                                        },
                                    }
                                )
                            }}
                            variant="ghost"
                            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-white px-4 py-2 text-sm font-medium text-black"
                        >
                            <CircleCheckBig size={14} />
                            Mark complete
                        </Button>

                        <Button
                            onClick={() => {
                                deleteTaskMutation.mutate(task.id, {
                                    onSuccess: () => {
                                        toast.success("Task deleted successfully");
                                        onClose();
                                    },

                                    onError: (error) => {
                                        if (axios.isAxiosError(error)) {
                                            toast.error(
                                                error.response?.data?.message ??
                                                "Failed to delete task"
                                            );
                                            return;
                                        }

                                        toast.error("Unexpected error");
                                    },
                                });
                            }}
                            variant="ghost"
                            className="flex items-center gap-1.5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/20"
                        >
                            <Trash2 size={14} />
                            Delete
                        </Button>
                    </div>
                </div>
            )}
        </Modal>
    );
}