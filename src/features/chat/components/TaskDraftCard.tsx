import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Check, Plus, Wand2, X } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

import Button from "../../../shared/components/Ui/Button";
import CustomSelect from "../../../shared/components/Ui/CustomSelect";
import ProjectSelect from "../../project/components/ProjectSelect";
import { useProjects } from "../../project/hooks";
import { useCreateTask } from "../../task/hooks/useCreateTask";
import { createSubtask } from "../../subtask/services/subtask.service";
import { priorities } from "../../../constants/taskOption";
import type { ParseTaskDraft } from "../types";
import { toDateInputValue } from "../utils/chatTime";

interface TaskDraftCardProps {
    draft: ParseTaskDraft;
    onDismiss: () => void;
}

interface DraftSubtask {
    id: string;
    title: string;
}

function createId() {
    return typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getErrorMessage(error: unknown, fallback: string) {
    if (axios.isAxiosError(error)) {
        return error.response?.data?.message ?? fallback;
    }
    return fallback;
}

export function TaskDraftCard({ draft, onDismiss }: TaskDraftCardProps) {
    const queryClient = useQueryClient();
    const createTaskMutation = useCreateTask();
    const { data: pagedProjects } = useProjects(1, 100);
    const projects = pagedProjects?.items ?? [];

    const [title, setTitle] = useState(draft.title);
    const [description, setDescription] = useState(draft.description ?? "");
    const [priority, setPriority] = useState(
        priorities[draft.priority] ?? "Medium"
    );
    const [deadline, setDeadline] = useState(toDateInputValue(draft.deadline));
    const [projectId, setProjectId] = useState(draft.projectId ?? "");
    const [subtasks, setSubtasks] = useState<DraftSubtask[]>(
        draft.subtasks.map((text) => ({ id: createId(), title: text }))
    );
    const [newSubtask, setNewSubtask] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const addSubtask = () => {
        const value = newSubtask.trim();
        if (!value) return;
        setSubtasks((prev) => [...prev, { id: createId(), title: value }]);
        setNewSubtask("");
    };

    const handleCreate = async () => {
        if (!title.trim()) {
            toast.error("Task title is required");
            return;
        }

        setIsSaving(true);
        try {
            const task = await createTaskMutation.mutateAsync({
                title: title.trim(),
                description: description.trim() ? description.trim() : null,
                priority: priorities.indexOf(priority),
                status: 0,
                deadline: deadline ? new Date(deadline).toISOString() : null,
                projectId: projectId || null,
            });

            const validSubtasks = subtasks
                .map((item) => item.title.trim())
                .filter(Boolean);

            for (const subtaskTitle of validSubtasks) {
                await createSubtask({ taskId: task.id, title: subtaskTitle });
            }

            if (validSubtasks.length > 0) {
                queryClient.invalidateQueries({
                    queryKey: ["subtasks", task.id],
                });
            }
            queryClient.invalidateQueries({ queryKey: ["tasks"] });

            toast.success("Task created from draft");
            onDismiss();
        } catch (error) {
            toast.error(getErrorMessage(error, "Failed to create task"));
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="rounded-2xl border border-white/10 bg-zinc-900/80 p-4">
            <div className="mb-3 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-accent text-accent-fg">
                    <Wand2 size={14} />
                </span>
                <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-white">Task draft</p>
                    <p className="text-[11px] text-zinc-500">
                        Review the details and confirm to create the task.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onDismiss}
                    aria-label="Dismiss draft"
                    className="rounded-lg p-1.5 text-zinc-500 transition hover:bg-white/5 hover:text-zinc-200"
                >
                    <X size={15} />
                </button>
            </div>

            <div className="space-y-3">
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Task title"
                    className="h-11 w-full rounded-xl border border-white/10 bg-black px-3.5 text-sm text-white outline-none transition focus:border-white/30"
                />

                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description (optional)"
                    rows={2}
                    className="w-full resize-none rounded-xl border border-white/10 bg-black p-3.5 text-sm text-white outline-none transition focus:border-white/30"
                />

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="mb-1.5 block text-[11px] uppercase tracking-wide text-zinc-500">
                            Priority
                        </label>
                        <CustomSelect
                            value={priority}
                            onChange={setPriority}
                            type="priority"
                            options={[
                                { label: "High", value: "High" },
                                { label: "Medium", value: "Medium" },
                                { label: "Low", value: "Low" },
                            ]}
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-[11px] uppercase tracking-wide text-zinc-500">
                            Due date
                        </label>
                        <input
                            type="date"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            className="calendar-picker-invert h-11 w-full rounded-xl border border-white/10 bg-black px-3.5 text-sm text-white outline-none transition focus:border-white/30"
                        />
                    </div>
                </div>

                <div>
                    <label className="mb-1.5 block text-[11px] uppercase tracking-wide text-zinc-500">
                        Project
                    </label>
                    <ProjectSelect
                        value={projectId}
                        onChange={setProjectId}
                        projects={projects.map((project) => ({
                            id: project.id,
                            name: project.name,
                        }))}
                    />
                    {!draft.projectId && draft.projectName && (
                        <p className="mt-1.5 text-[11px] text-amber-400">
                            AI matched "{draft.projectName}" but no project could be
                            linked. Please choose one.
                        </p>
                    )}
                </div>

                <div>
                    <label className="mb-1.5 block text-[11px] uppercase tracking-wide text-zinc-500">
                        Subtasks
                    </label>
                    <div className="space-y-1.5">
                        {subtasks.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center gap-2 rounded-xl border border-white/8 bg-black px-3 py-1.5"
                            >
                                <input
                                    value={item.title}
                                    onChange={(e) =>
                                        setSubtasks((prev) =>
                                            prev.map((s) =>
                                                s.id === item.id
                                                    ? { ...s, title: e.target.value }
                                                    : s
                                            )
                                        )
                                    }
                                    className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none"
                                />
                                <button
                                    type="button"
                                    aria-label="Remove subtask"
                                    onClick={() =>
                                        setSubtasks((prev) =>
                                            prev.filter((s) => s.id !== item.id)
                                        )
                                    }
                                    className="flex-shrink-0 rounded-lg p-1 text-zinc-500 transition hover:bg-red-500/10 hover:text-red-400"
                                >
                                    <X size={13} />
                                </button>
                            </div>
                        ))}

                        <div className="flex items-center gap-2 rounded-xl border border-dashed border-white/10 px-3 py-1.5">
                            <input
                                value={newSubtask}
                                onChange={(e) => setNewSubtask(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        addSubtask();
                                    }
                                }}
                                placeholder="Add subtask..."
                                className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-zinc-600"
                            />
                            <button
                                type="button"
                                onClick={addSubtask}
                                disabled={!newSubtask.trim()}
                                aria-label="Add subtask"
                                className="flex-shrink-0 rounded-lg p-1 text-zinc-400 transition hover:bg-white/5 hover:text-white disabled:opacity-40"
                            >
                                <Plus size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4 flex justify-end gap-2 border-t border-white/5 pt-3">
                <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={onDismiss}
                    disabled={isSaving}
                    className="rounded-xl"
                >
                    Dismiss
                </Button>
                <Button
                    type="button"
                    size="sm"
                    onClick={handleCreate}
                    isLoading={isSaving}
                    disabled={isSaving}
                    className="rounded-xl"
                >
                    <Check size={14} />
                    Create task
                </Button>
            </div>
        </div>
    );
}
