export interface TaskPayload {
    title: string
    description?: string | null
    projectId?: string | null
    priority: number
    status: number
    deadline?: string | null
    /** null = giữ nguyên, [] = gỡ hết, [ids] = thay cả bộ (contract BE) */
    labelIds?: string[] | null
    /** tri-state giống labelIds: không gửi = giữ nguyên, 0 = tắt chuỗi, 1/2/3 = set chu kỳ */
    recurrenceType?: number
}

import type { SubtaskResponse } from "../../subtask/types/subtask.type";
import type { LabelResponse } from "../../label/types/label.type";

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
    // Labels — optional để tương thích cache cũ
    labels?: LabelResponse[]
    /** 0 = không lặp, 1 = daily, 2 = weekly, 3 = monthly */
    recurrenceType?: number
}
export interface updateTaskPayload {
    id : string
    taskPayload : TaskPayload
}