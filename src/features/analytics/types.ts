export interface AnalyticsKpi {
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    overdueTasks: number;
    completionRate: number;
    completedTasksChange: number;
    inProgressTasksChange: number;
    overdueTasksChange: number;
    completionRateChange: number;
}

export interface ActivityTrendPoint {
    label: string;
    completed: number;
    created: number;
}

export interface CompletionTrendPoint {
    label: string;
    completed: number;
    overdue: number;
}

export interface TopProject {
    projectId: string;
    projectName: string;
    completedTasks: number;
    totalTasks: number;
    progress: number;
}

export interface RecentActivityItem {
    type: string;
    action: string;
    taskTitle: string;
    occurredAt: string;
}

export interface AnalyticsInsight {
    peakDay: string;
    peakDayCount: number;
}

export interface AnalyticsData {
    kpi: AnalyticsKpi;
    priority: { high: number; medium: number; low: number };
    status: { todo: number; inProgress: number; inReview: number; done: number };
    activityTrend: ActivityTrendPoint[];
    completionTrend: CompletionTrendPoint[];
    topProjects: TopProject[];
    recentActivity: RecentActivityItem[];
    insight: AnalyticsInsight;
}
