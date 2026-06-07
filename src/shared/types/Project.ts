export interface Project {
    id: number
    name: string
    description?: string
    status: "active" | "completed" | "archived"
    due: string
    progress: number
    overdue?: boolean
    taskIds: number[]
}