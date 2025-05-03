'use server'

import { db } from "@/prisma";

export async function resetPassword(password: string, confirmPassword: string, token: string) {
    if (password !== confirmPassword) {
        return {
            code: 400,
            message: "Passwords do not match",
        }
    }
    const res = await db.verificationToken.findUnique({
        where: {
            token,
        },
    })
    if (!res) {
        return {
            code: 400,
            message: "Token not found",
        }
    }
    const user = await db.user.findUnique({
        where: {
            email: res.email,
        },
    });
    if (!user) {
        return {
            code: 400,
            message: "User not found",
        }
    }
    await db.user.update({
        where: {
            email: res.email,
        },
        data: {
            password,
        },
    });
    //step 5: delete the token
    await db.verificationToken.delete({
        where: {
            token,
        },
    });

    return {
        code: 200,
        message: "Password reset successfully",
    }
}