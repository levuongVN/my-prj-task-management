import { z } from "zod";

export const createMeetingSchema = z.object({
    title: z.string().min(1, "Title is required"),
    startAt: z.string().min(1, "Start time is required"),
    projectId: z.string().optional(),
});

export type CreateMeetingFormValues = z.infer<typeof createMeetingSchema>;