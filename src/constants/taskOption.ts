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