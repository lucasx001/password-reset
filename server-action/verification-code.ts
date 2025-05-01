'use server'
import { sendEmail } from "./send-email"
import { db } from "@/prisma"
const generateVerificationCode = () => {
    // Generate a random 6-digit verification code
    return Math.floor(100000 + Math.random() * 900000).toString();
}
export const verificationCode = async (email: string) => {
    // Generate a verification code
    const code = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
    // Store the code into prisma
    const existingToken = await db.verificationToken.findUnique({
        where: { email },
    });
    if (!existingToken) {
        const verificationCode = await db.verificationToken.create({
            data: {
                email,
                token: code,
                expiresAt,
            },
        });
    } else {
        const verificationCode = await db.verificationToken.update({
            where: { email },
            data: {
                token: code,
                expiresAt,
            },
        });
    }
    return await sendEmail(email, 'Verification Code', `Your verification code is: ${code}; Expires in 5 minutes`);
}