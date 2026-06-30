export interface ProjectResponse {
    id: string;

    name: string;

    description: string | null;

    due: string;

    progress: number;

    status: number;

    createdAt: string;
}