import { z } from 'zod'
export const signInSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
})

export type SignInSchema = z.infer<typeof signInSchema>

export const signUpSchema = z.object({
        email: z.string().email('Invalid email address'),
        password: z.string().min(6, 'Password must be at least 6 characters long'),
        confirmPassword: z.string().min(6, 'Password must be at least 6 characters long'),
        verificationCode: z.string().min(6, 'Verification code must be at least 6 characters long'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
    })
export type SignUpSchema = z.infer<typeof signUpSchema>
