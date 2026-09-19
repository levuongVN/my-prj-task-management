export interface SubtaskResponse {
    id: string
    taskId: string
    title: string
    isCompleted: boolean
    position: number
    createdAt: string
    updatedAt: string
}

export interface CreateSubtaskPayload {
    taskId: string
    title: string
}

export interface UpdateSubtaskPayload {
    id: string
    subtaskPayload: UpdateSubtaskTitlePayload
}

export interface UpdateSubtaskTitlePayload {
    title: string
}

export interface ReorderSubtasksPayload {
    taskId: string
    orderedSubtaskIds: string[]
}
