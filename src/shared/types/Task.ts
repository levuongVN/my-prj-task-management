export interface TaskSubtaskItem {
    id: string
    taskId: string
    title: string
    isCompleted: boolean
    position: number
    createdAt: string
    updatedAt: string
}

export interface Task {
    id: string           // uuid
    title: string
    description?: string
    status: number       // integer (enum)
    priority: number     // integer (enum)
    deadline?: string | null  // timestamp, nullable → đổi từ "due" sang "deadline"
    position: number
    userId: string       // uuid
    createdAt: string    // timestamp
    updatedAt: string    // timestamp
    projectId?: string | null  // uuid, nullable
    // Checklist — optional để tương thích các nơi chưa truyền từ BE
    subtasks?: TaskSubtaskItem[]
    totalSubtasks?: number
    completedSubtasks?: number
    progressPercent?: number
}
