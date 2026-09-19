import { z } from 'zod'

export const registerSchema = z
    .object({
        fullName: z
            .string()
            .trim()
            .min(1, 'Full name is required')
            .max(100, 'Full name is too long'),

        email: z.email('Invalid email address'),

        password: z.string().min(6, 'Password must be at least 6 characters'),

        confirmPassword: z.string(),
    })
    .refine((data) => data.confirmPassword === data.password, {
        path: ['confirmPassword'],
        message: 'Passwords do not match',
    })

export type RegisterFormValues = z.infer<typeof registerSchema>
