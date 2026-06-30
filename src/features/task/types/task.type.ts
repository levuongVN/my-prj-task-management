export interface TaskPayload {
    title: string
    description?: string
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
}
export interface updateTaskPayload {
    id : string
    taskPayload : TaskPayload
}