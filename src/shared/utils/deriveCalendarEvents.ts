import { TaskStatus } from "../../constants/taskOption";
// import { MEETING_TIMES } from "../../mocks/calendarMock";
import type { CalendarEvent } from "../types/Calendar";
import type { Meeting } from "../types/Meeting";
import type { Project } from "../types/Project";
import type { Task } from "../types/Task";

export function deriveCalendarEvents(
    projects: Project[],
    tasks: Task[],
    meetings: Meeting[],
): CalendarEvent[] {
    const events: CalendarEvent[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Project deadline → milestone hoặc overdue
    for (const project of projects) {
        if (project.status === "archived") continue;
        const dueDate = new Date(project.due);
        const isOverdue = project.overdue || (dueDate < today && project.status !== "completed");
        events.push({
            id:         `project-${project.id}`,
            title:      project.name,
            type:       isOverdue ? "overdue" : "milestone",
            date:       project.due,
            sourceType: "project",
            sourceId:   project.id,
        });
    }

    // Task deadline → task
    for (const task of tasks) {
        if (task.status === TaskStatus.Completed) continue;
        if (!task.deadline) continue;
        events.push({
            id:         `task-${task.id}`,
            title:      task.title,
            type:       "task",
            date:       task.deadline,
            sourceType: "task",
            sourceId:   task.id,
        });
    }

    // Meetings
    for (const meeting of meetings) {
        events.push({
            id: `meeting-${meeting.id}`,
            title: meeting.title,
            type: "meeting",
            date: meeting.date,
            time: meeting.time,
            sourceType: "meeting",
            sourceId: meeting.id,
        });
    }

    return events;
}