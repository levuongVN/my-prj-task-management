import type { Project } from "../shared/types/Project";
import type { Task } from "../shared/types/Task";



export const MOCK_PROJECTS: Project[] = [
    { id: 1, name: "TaskFlow Redesign",   status: "active",    due: "2026-06-20", progress: 72,  overdue: false, taskIds: [1, 2] },
    { id: 2, name: "API Integration",     status: "active",    due: "2026-06-01", progress: 40,  overdue: true,  taskIds: [3, 4] },
    { id: 3, name: "Analytics Dashboard", status: "active",    due: "2026-07-15", progress: 18,  overdue: false, taskIds: [5] },
    { id: 4, name: "User Onboarding V2",  status: "completed", due: "2026-05-10", progress: 100, overdue: false, taskIds: [] },
    { id: 5, name: "Auth Refactor",       status: "completed", due: "2026-04-28", progress: 100, overdue: false, taskIds: [] },
    { id: 6, name: "Legacy Import Tool",  status: "archived",  due: "2026-01-15", progress: 55,  overdue: false, taskIds: [] },
];

export const TASKS_MOCK: Task[] = [
    {
        id: 1,
        title: "Design landing page",
        status: "Completed",
        due: "2026-06-01",
        priority: "High",
    },
    {
        id: 2,
        title: "Implement login",
        status: "In Progress",
        due: "2026-06-10",
        priority: "High",
    },
    {
        id: 3,
        title: "Create dashboard",
        status: "In Review",
        due: "2026-06-12",
        priority: "Medium",
    },
    {
        id: 4,
        title: "Fix refresh token",
        status: "Pending",
        due: "2026-06-05",
        priority: "High",
    },
    {
        id: 5,
        title: "Mobile responsive",
        status: "Completed",
        due: "2026-06-03",
        priority: "Medium",
    },
    {
        id: 6,
        title: "Analytics page",
        status: "In Progress",
        due: "2026-06-15",
        priority: "Low",
    },
    {
        id: 7,
        title: "Setup CI/CD",
        status: "Pending",
        due: "2026-06-18",
        priority: "Medium",
    },
    {
        id: 8,
        title: "Dark mode polish",
        status: "Completed",
        due: "2026-06-02",
        priority: "Low",
    },
];

// Meeting tạm dùng Task shape — sẽ tách Meeting type riêng khi có API
export const MOCK_MEETINGS: Task[] = [
    { id: 101, title: "Standup 9am",     status: "meeting", due: "2026-06-04", priority: "meeting" },
    { id: 102, title: "Design review",   status: "meeting", due: "2026-06-10", priority: "meeting" },
    { id: 103, title: "Sprint planning", status: "meeting", due: "2026-06-15", priority: "meeting" },
    { id: 104, title: "Client call",     status: "meeting", due: "2026-06-19", priority: "meeting" },
    { id: 105, title: "Retro",           status: "meeting", due: "2026-06-24", priority: "meeting" },
    { id: 106, title: "All-hands",       status: "meeting", due: "2026-06-30", priority: "meeting" },
];

export const MEETING_TIMES: Record<number, string> = {
    101: "09:00", 102: "14:00", 103: "10:00",
    104: "11:00", 105: "16:00", 106: "10:00",
};