import type { Notification } from "./types";

export const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: "1",
        title: "Task assigned",
        message: "Hiếu Nguyễn assigned you to \"Redesign landing page\".",
        type: "task",
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    },
    {
        id: "2",
        title: "Deadline approaching",
        message: "\"API integration\" is due tomorrow.",
        type: "task",
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
    {
        id: "3",
        title: "Meeting reminder",
        message: "Sprint planning starts in 30 minutes.",
        type: "meeting",
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    },
    {
        id: "4",
        title: "Project updated",
        message: "\"Mobile App\" status changed to In Progress.",
        type: "project",
        read: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
    {
        id: "5",
        title: "System maintenance",
        message: "Scheduled maintenance tonight from 2:00–4:00 AM UTC.",
        type: "system",
        read: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    },
];
