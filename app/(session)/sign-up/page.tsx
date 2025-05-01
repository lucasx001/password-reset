'use client';
import React from 'react';
import { signUpSchema, SignUpSchema } from '@/lib/schema';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { verificationCode } from '@/server-action/verification-code';
import { toast } from "sonner"
import { signUp } from '@/server-action/sign-up';
import { redirect } from 'next/navigation';

const SignUp: React.FC = () => {
    // 1. Define your form.
    const signUpForm = useForm<SignUpSchema>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
            verificationCode: "",
        },
    })
    const onSubmit = async (values: SignUpSchema) => {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        const result = await signUp(values)
        if (result) {
            toast.success('Sign up successfully');
            // Redirect to sign in page
            redirect('/sign-in');
        } else {
            toast.error('Sign up failed');
        }
    };

    const sendVerificationCode = async () => {
        const email = signUpForm.getValues('email');
        if (!email) {
            alert('Please enter your email address');
            return;
        }
        // Call your server action to send the verification code
        const { code } = await verificationCode(email);
        if (code === 200) {
            toast.success('Verification code sent successfully');
        } else {
            toast.error('Failed to send verification code');
        }
    }

    return (
        <div className="w-screen min-h-screen flex flex-col justify-center items-center">
            <Form {...signUpForm}>
                <form onSubmit={signUpForm.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={signUpForm.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <div className='flex w-full gap-3'>
                                        <Input type="email" placeholder="input your email" {...field} />
                                        <Button onClick={sendVerificationCode} type='button'>Send Code</Button>
                                    </div>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={signUpForm.control}
                        name="verificationCode"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Verification Code</FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="input your verification code" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={signUpForm.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="input your password" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={signUpForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="confirm your password" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <p>Already have an account? <a href={'/sign-in'} className='underline text-primary'>Sign In</a></p>
                    <p>Forgot Password? <a href={'/password-reset'} className='underline text-primary'>Reset Password</a></p>
                    <div className='flex justify-between w-full'>
                        <Button type="submit" className='hover:cursor-pointer w-full'>Sign Up</Button>
                    </div>
                </form>
            </Form>

        </div>
    );
};

export default SignUp;