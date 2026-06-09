export interface Task {
    id: string           // uuid
    title: string
    description?: string
    status: number       // integer (enum)
    priority: number     // integer (enum)
    deadline?: string    // timestamp, nullable → đổi từ "due" sang "deadline"
    position: number
    userId: string       // uuid
    createdAt: string    // timestamp
    updatedAt: string    // timestamp
}