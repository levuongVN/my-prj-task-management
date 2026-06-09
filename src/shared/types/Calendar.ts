export type CalendarEventType = "task" | "milestone" | "meeting" | "overdue";
export type ViewMode = "day" | "week" | "month";

// CalendarEvent không phải entity riêng — derive từ Project/Task
export interface CalendarEvent {
    id: string;
    title: string;
    type: CalendarEventType;
    time?: string;
    projectName?: string;
    date: string;
    sourceType: "project" | "task" | "meeting";
    sourceId: string;
}

export interface CreateEventForm {
    title: string;
    date: string;
    time: string;
    type: CalendarEventType;
    projectId: string;
}