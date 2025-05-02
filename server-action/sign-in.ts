'use server'
import { signJWT } from "@/lib/jwt";
import { db } from "@/prisma"
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
export async function signIn(email: string, password: string) {
    
    // Check if the email is valid
    const user = await db.user.findUnique({
        where: { email },
    });
    if (!user) {
        return {
            code: 400,
            message: 'User not found',
        }
    }
    // Check if the password is correct
    if (user.password !== password) {
        return {
            code: 400,
            message: 'Password is incorrect',
        }
    }
    // generate a JWT token
    const jwt = await signJWT({
        email: user.email,
        id: user.id,
    }, (globalThis as unknown as Global).privateKey, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)); // 7 days expiration
    (await cookies()).set('session', jwt)
    // Return the user
    return redirect('/home');
}