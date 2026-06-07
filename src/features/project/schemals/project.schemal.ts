import { z } from "zod";

export const projectSchema = z.object({
    name: z
        .string()
        .min(
            3,
            "Project name must be at least 3 characters"
        )
        .max(
            100,
            "Project name must not exceed 100 characters"
        ),

    description: z
        .string()
        .min(
            10,
            "Description must be at least 10 characters"
        )
        .max(
            500,
            "Description must not exceed 500 characters"
        ),

    due: z
        .string()
        .min(
            1,
            "Due date is required"
        ),

    status: z.enum([
        "active",
        "completed",
        "archived",
    ]),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;