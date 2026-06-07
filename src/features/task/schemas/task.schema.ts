import { z } from "zod";

export const createTaskSchema = z.object({
    title: z
        .string()
        .min(3, "Title must be at least 3 characters"),

    description: z
        .string()
        .min(10, "Description must be at least 10 characters"),

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
});

export type CreateTaskFormValues = z.infer<typeof createTaskSchema>;