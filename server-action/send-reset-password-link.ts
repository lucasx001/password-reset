'use server'
import { v4 as uuidv4 } from 'uuid';
import { db } from '@/prisma';
import { sendEmail } from '@/server-action/send-email';
export async function sendResetPasswordLink(email: string) {
    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
    // Check if the email exists in the database
    const user = await db.user.findUnique({
        where: { email },
    });
    if (!user) {
        throw new Error('User not found');
    }
    // Store the token into prisma
    const existingToken = await db.verificationToken.findUnique({
        where: { email },
    });
    if (!existingToken) {
        const verificationCode = await db.verificationToken.create({
            data: {
                email,
                token,
                expiresAt,
            },
        });
    } else {
        const verificationCode = await db.verificationToken.update({
            where: { email },
            data: {
                token,
                expiresAt,
            },
        });
    }
    // Send email with the token
    await sendEmail(email, 'Password Reset Link', `Your password reset link is http://localhost:3000/password-reset/${token} Expires in 5 minutes`);
}