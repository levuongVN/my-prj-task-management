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

export const MOCK_TASKS: Task[] = [
    { id: 1,  title: "API docs",        status: "in-progress", due: "2026-06-04", priority: "medium" },
    { id: 2,  title: "Review PR",       status: "todo",        due: "2026-06-05", priority: "low"    },
    { id: 3,  title: "Fix auth bug",    status: "in-progress", due: "2026-06-10", priority: "high"   },
    { id: 4,  title: "v1.2 release",    status: "todo",        due: "2026-06-09", priority: "high"   },
    { id: 5,  title: "Analytics UI",    status: "todo",        due: "2026-06-16", priority: "medium" },
    { id: 6,  title: "Write tests",     status: "todo",        due: "2026-06-16", priority: "medium" },
    { id: 7,  title: "Deploy script",   status: "todo",        due: "2026-06-16", priority: "low"    },
    { id: 8,  title: "Onboarding flow", status: "in-progress", due: "2026-06-12", priority: "high"   },
    { id: 9,  title: "Perf audit",      status: "todo",        due: "2026-06-23", priority: "medium" },
    { id: 10, title: "Deploy v1.3",     status: "todo",        due: "2026-06-29", priority: "high"   },
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