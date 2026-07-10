export interface Meeting {
    id: string;
    title: string;
    startAt: string;
    projectId?: string | null;
    userId: string;
}