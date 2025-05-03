'use client';
import { signInSchema, SignInSchema } from '@/lib/schema';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { signIn } from '@/server-action/sign-in';
import { toast } from 'sonner';
interface SignInProps {
    signIn: (email: string, password: string) => Promise<void>;
}

const SignIn: React.FC<SignInProps> = () => {
    // 1. Define your form.
    const signInForm = useForm<SignInSchema>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const onSubmit = async (values: SignInSchema) => {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        try {
            const res = await signIn(values.email, values.password);
            if (res.code !== 200) {
                // Handle error (e.g., show a notification)
                toast.error(res.message);
                return;
            }
            toast.success(res.message);
            
        } catch (error) {
            console.error("Sign in failed:", error);
            // Handle error (e.g., show a notification)
        }
    };

    return (
        <div className='w-screen min-h-screen flex justify-center items-center'>
            <Form {...signInForm}>
                <form onSubmit={signInForm.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={signInForm.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="input your email" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={signInForm.control}
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
                    <p>Doesn't have an account? <Link href={'/sign-up'} className='underline text-primary'>Create One</Link></p>
                    <div className='flex justify-between'>
                        <Button type="submit" className='hover:cursor-pointer'>Sign In</Button>
                        <Button type="button" variant={'link'} className='hover:cursor-pointer' asChild>
                            <Link href={'/password-reset'}>Forgot Password</Link>
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default SignIn;