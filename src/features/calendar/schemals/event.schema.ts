import { z } from "zod";

export const eventSchema = z.object({
    title: z
        .string()
        .min(1, "Title is required")
        .max(100, "Title must not exceed 100 characters"),

    date: z
        .string()
        .min(1, "Date is required"),

    time: z
        .string()
        .optional(),

    type: z.enum(["task", "milestone", "meeting", "overdue"]),

    projectId: z
        .string()
        .optional(),
});

export type EventFormValues = z.infer<typeof eventSchema>;