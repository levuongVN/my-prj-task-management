import { z } from "zod";
import { recurrences } from "../../../constants/taskOption";

export const createTaskSchema = z.object({
    title: z
        .string()
        .min(3, "Title must be at least 3 characters"),

    description: z.string().nullable().optional(),

    priority: z.enum([
        "High",
        "Medium",
        "Low",
    ]),

    status: z.enum([
        "Pending",
        "In Progress",
        "In Review",
        "Completed",
    ]),

    due: z.string().min(1, "Due date is required"),

    projectId: z.string().optional(),

    /** Label ids (labelIds: [] = gỡ hết, [ids] = thay cả bộ — contract BE) */
    labelIds: z.array(z.string()).optional(),

    recurrence: z.enum(recurrences).optional(),
});

export type CreateTaskFormValues = z.infer<typeof createTaskSchema>;