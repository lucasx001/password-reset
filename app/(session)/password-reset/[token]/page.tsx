import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { verifyJWT } from "@/lib/jwt";
import { db } from "@/prisma";
import { resetPassword } from "@/server-action/reset-password";
import Form from "next/form";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { toast } from "sonner";

const PasswordResetPage = async ( { params }: { params: Promise<{token: string}>}) => {
    const { token } = await params;
    const jwt = (await cookies()).get('session')?.value || '';
    //step 1: check if the jwt exists and is not expired
    const { valid } = await verifyJWT(jwt, process.env.publicKey || '');
    if (valid) {
        return redirect('/home');
    }
    //step 2: check if the token is valid
    const res = await db.verificationToken.findUnique({
        where: {
            token,
        },
    })
    if (!res) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <h1 className="text-2xl font-bold">Password Reset</h1>
                <p className="text-sm text-gray-500">Token not found</p>
            </div>
        )
    }
    //step 3: check if the token is expired
    const now = new Date();
    if (res.expiresAt < now) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <h1 className="text-2xl font-bold">Password Reset</h1>
                <p className="text-sm text-gray-500">Token expired</p>
            </div>
        )
    }
    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
            <h1 className="text-2xl font-bold">Password Reset</h1>
            <Form action={async (formData) => {
                'use server'
                const password = formData.get('password') as string;
                const confirmPassword = formData.get('confirm-password') as string;
                const {code, message} = await resetPassword(password, confirmPassword, token);
                if (code === 200) {
                    return redirect('/sign-in');
                }
                toast.error(message);
            }} className="w-[320px] flex flex-col gap-2">
                <div className='flex flex-col gap-2 w-full'>
                    <label htmlFor="password" className="text-normal font-medium">New Password</label>
                    <Input type='password' placeholder='input your new password' name='password' />
                </div>
                <div className='flex flex-col gap-2 w-full'>
                    <label htmlFor="password" className="text-normal font-medium">Confirm New Password</label>
                    <Input type='password' placeholder='input your confirm new password' name='confirm-password' />
                </div>
                <div className='flex w-full'>
                    <Button type="submit" className="mt-4">
                        Reset Password
                    </Button>
                </div>
            </Form>
        </div>
    );
}

export default PasswordResetPage;