'use client';
import React from 'react';
import Form from "next/form"
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { toast } from 'sonner';
import { sendResetPasswordLink } from '@/server-action/send-reset-password-link';

const PasswordResetPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
            <h1 className="text-2xl font-bold">Password Reset</h1>
            <Form action={async (formData) => {
                await sendResetPasswordLink(formData.get('email') as string);
                toast.success('Password reset link sent to your email');
            }} className='w-[320px]'>
                <div className='flex flex-col gap-2 w-full'>
                    <label htmlFor="email" className="text-normal font-medium">Email</label>
                    <Input type='email' placeholder='input your registered email' name='email' />
                </div>
                <div className='flex w-full'>
                    <Button type="submit" className="mt-4">
                        Send Password Reset Link
                    </Button>
                    <Button variant="link" className="mt-4">
                        <Link href="/sign-in">
                        Back to Sign In
                        </Link>
                    </Button>
                </div>
            </Form>
        </div>
    );
}

export default PasswordResetPage;