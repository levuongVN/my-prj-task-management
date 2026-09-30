export const priorities = ["Low", "Medium", "High"];
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

/* ── Recurring tasks ─────────────────────────────────────────────────────────── */
export const TaskRecurrence = {
    None: 0,
    Daily: 1,
    Weekly: 2,
    Monthly: 3,
} as const;

export const TASK_RECURRENCE_MAP: Record<number, string> = {
    [TaskRecurrence.None]: "Not repeating",
    [TaskRecurrence.Daily]: "Daily",
    [TaskRecurrence.Weekly]: "Weekly",
    [TaskRecurrence.Monthly]: "Monthly",
};

export const recurrences = [
    "Not repeating",
    "Daily",
    "Weekly",
    "Monthly",
] as const;

/**
 * Deadline của task KẾ tiếp theo theo chu kỳ (BE clamp cuối tháng như 31/01→28/02).
 * Chỉ dùng để hiển thị toast — BE tự tính giá trị thật khi sinh task.
 */
export function getNextDeadline(
    deadline: string | null | undefined,
    recurrenceType: number
): string | null {
    if (!deadline) return null;
    const date = new Date(deadline);
    switch (recurrenceType) {
        case TaskRecurrence.Daily:
            date.setDate(date.getDate() + 1);
            break;
        case TaskRecurrence.Weekly:
            date.setDate(date.getDate() + 7);
            break;
        case TaskRecurrence.Monthly: {
            const { month, day } = {
                month: date.getMonth(),
                day: date.getDate(),
            };
            date.setMonth(month + 1);
            if (date.getDate() !== day) date.setDate(0); // clamp cuối tháng
            break;
        }
        default:
            return null;
    }
    return date.toISOString();
}