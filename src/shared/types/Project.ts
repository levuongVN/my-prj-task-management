export interface Project {
    id: string
    name: string
    description?: string
    status: number
    due: string
    progress: number
    overdue?: boolean
    taskIds: string[]
}