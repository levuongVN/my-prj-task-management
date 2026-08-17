export type NotificationType = "task" | "project" | "meeting" | "system";

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: NotificationType;
    read: boolean;
    createdAt: string;
}
