export interface TaskPayload {
    title: string
    description?: string | null
    projectId?: string | null
    priority: number
    status: number
    deadline?: string | null
}

export interface TaskResponse{
    id: string
    title: string
    description?: string
    projectId?: string | null
    priority: number
    status: number
    deadline?: string | null
    position: number
    userId: string
    createdAt: string
    updatedAt: string
    // Checklist — optional để tương thích cache cũ chưa invalidate
    subtasks?: SubtaskResponse[]
    totalSubtasks?: number
    completedSubtasks?: number
    progressPercent?: number
}
import type { SubtaskResponse } from "../../subtask/types/subtask.type";
export interface updateTaskPayload {
    id : string
    taskPayload : TaskPayload
}