'use server'

import { signUpSchema, type SignUpSchema } from "@/lib/schema";
import { db } from "@/prisma";

export async function signUp(values: SignUpSchema) {
    const { email, password, confirmPassword, verificationCode } = signUpSchema.parse(values);
    const results = await db.verificationToken.findUnique({
        where: { email },
    });
    if (!results) {
        throw new Error('Verification code not found');
    }
    if (results.email === email && results.token === verificationCode) {
        // Check if the verification code is expired
        const currentTime = new Date();
        if (currentTime > results.expiresAt) {
            throw new Error('Verification code expired');
        }
        // Create a new user in the database
        const user = await db.user.create({
            data: {
                email,
                password,
            },
        });
        // Delete the verification code from the database
        await db.verificationToken.delete({
            where: { email },
        });
        return user;
    }
    throw new Error('Invalid verification code');
}