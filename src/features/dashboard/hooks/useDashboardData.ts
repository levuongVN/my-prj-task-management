import { useMemo } from "react";
import { useTasks } from "../../task/hooks/useTask";
import { useProjects } from "../../project/hooks";
import { useMeetings } from "../../calendar/Hooks/useMeeting";
import { TaskStatus } from "../../../constants/taskOption";

const DAY_MS = 24 * 60 * 60 * 1000;

interface DashboardStats {
    completedRate: number;
    activeProjects: number;
    overdueTasks: number;
    upcomingTasks: number;
}

export function useDashboardData() {
    const { data: tasks = [], isLoading: tasksLoading } = useTasks();
    const { data: projects = [], isLoading: projectsLoading } = useProjects();
    const { data: meetings = [], isLoading: meetingsLoading } = useMeetings();

    const ongoingTasks = useMemo(() => (
        tasks
            .filter((task) => task.status !== TaskStatus.Completed)
            .sort((a, b) => {
                const aTime = a.deadline ? new Date(a.deadline).getTime() : Number.MAX_SAFE_INTEGER;
                const bTime = b.deadline ? new Date(b.deadline).getTime() : Number.MAX_SAFE_INTEGER;
                return aTime - bTime;
            })
    ), [tasks]);

    const stats: DashboardStats = useMemo(() => {
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const completed = tasks.filter((task) => task.status === TaskStatus.Completed).length;

        const overdueTasks = tasks.filter((task) => {
            if (task.status === TaskStatus.Completed || !task.deadline) return false;
            return new Date(task.deadline).getTime() < now.getTime();
        }).length;

        const upcomingTasks = tasks.filter((task) => {
            if (task.status === TaskStatus.Completed || !task.deadline) return false;
            const time = new Date(task.deadline).getTime();
            return time >= now.getTime() && time < todayStart.getTime() + 7 * DAY_MS;
        }).length;

        return {
            completedRate: tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0,
            activeProjects: projects.filter((project) => project.status === 0).length,
            overdueTasks,
            upcomingTasks,
        };
    }, [tasks, projects]);

    // Tasks completed per day over the last 7 days (based on updatedAt)
    const weeklyProductivity = useMemo(() => {
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const thisWeek = Array<number>(7).fill(0);
        const lastWeek = Array<number>(7).fill(0);

        const weekStart = todayStart.getTime() - 6 * DAY_MS;
        const lastWeekStart = weekStart - 7 * DAY_MS;

        tasks.forEach((task) => {
            if (task.status !== TaskStatus.Completed) return;
            const time = new Date(task.updatedAt).getTime();
            if (time >= weekStart && time < todayStart.getTime() + DAY_MS) {
                thisWeek[Math.floor((time - weekStart) / DAY_MS)] += 1;
            } else if (time >= lastWeekStart && time < weekStart) {
                lastWeek[Math.floor((time - lastWeekStart) / DAY_MS)] += 1;
            }
        });

        const labels = Array.from({ length: 7 }, (_, i) => (
            new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6 + i)
                .toLocaleDateString("en-US", { weekday: "short" })
        ));

        const lastWeekTotal = lastWeek.reduce((sum, n) => sum + n, 0);
        const thisWeekTotal = thisWeek.reduce((sum, n) => sum + n, 0);
        const delta = lastWeekTotal > 0
            ? Math.round(((thisWeekTotal - lastWeekTotal) / lastWeekTotal) * 100)
            : thisWeekTotal > 0
                ? 100
                : 0;

        return { labels, counts: thisWeek, delta };
    }, [tasks]);

    const upcomingMeetings = useMemo(() => {
        const now = new Date();
        const cutoff = now.getTime() - 12 * 60 * 60 * 1000;

        return meetings
            .filter((meeting) => new Date(meeting.startAt).getTime() >= cutoff)
            .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime())
            .slice(0, 3);
    }, [meetings]);

    return {
        stats,
        ongoingTasks,
        upcomingMeetings,
        weeklyProductivity,
        isLoading: tasksLoading || projectsLoading || meetingsLoading,
    };
}
