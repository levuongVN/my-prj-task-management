export const priorities = ["High", "Medium", "Low"];
export const statuses = ["Pending", "In Progress", "In Review", "Completed"];

export const TaskStatus = {
    Pending:    0,
    InProgress: 1,
    InReview:   2,
    Completed:  3,
} as const;

export const TaskPriority = {
    High:   0,
    Medium: 1,
    Low:    2,
} as const;

/**
 * Map status number (từ API) → string label hiển thị trên UI
 */
export const TASK_STATUS_MAP: Record<number, string> = {
    [TaskStatus.Pending]:    "Pending",
    [TaskStatus.InProgress]: "In Progress",
    [TaskStatus.InReview]:   "In Review",
    [TaskStatus.Completed]:  "Completed",
};

/**
 * Map priority number (từ API) → string label hiển thị trên UI
 */
export const TASK_PRIORITY_MAP: Record<number, string> = {
    [TaskPriority.High]:   "High",
    [TaskPriority.Medium]: "Medium",
    [TaskPriority.Low]:    "Low",
};