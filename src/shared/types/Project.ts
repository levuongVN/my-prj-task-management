export interface Project {
    id: string
    name: string
    description?: string
    status: "active" | "completed" | "archived"
    due: string
    progress: number
    overdue?: boolean
    taskIds: string[]
}