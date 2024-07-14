'use client';

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ZodError } from "zod";
import { useRouter } from "next/navigation";
import { AuthCredentialsValidator, TAuthCredentialsValidator } from '@/lib/validators/account-credentials-validator'
import { trpc } from "@/trpc/client";

const SignUpPage = () => {
    const {register, handleSubmit, formState: {errors}} = useForm<TAuthCredentialsValidator>({
        resolver: zodResolver(AuthCredentialsValidator)
    });

    const router = useRouter();

    const { mutate, isLoading } = trpc.auth.createPayloadUser.useMutation({
      onError: (err) => {
        if (err.data?.code === 'CONFLICT') {
          toast.error("This email is already in use. Sign in instead?");
          return;
        }

        if (err instanceof ZodError) {
          toast.error(err.issues[0].message);
          return;
        }

        toast.error("Oops! Something went wrong. Please try again.");
      },
      onSuccess: ({ sentToEmail }) => {
        toast.success(`Verification email sent to ${sentToEmail}.`)
        router.push("/verify-email?to=" + sentToEmail);
      },
    })

    const onSubmit = ({email, password}: TAuthCredentialsValidator) => {
        mutate({ email, password });
    }


    return (
        <div className="mb-20 flex flex-col relative container pt-20 items-center justify-center lg:px-0">
            <div className="flex flex-col mx-auto w-full justify-center space-y-6 sm:w-[350px]
            border border-gray-300 rounded-tl-3xl rounded-br-3xl p-8">
                <div className="flex flex-col items-center text-center space-y-2">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Create an account
                    </h1>
                    <Link href="/sign-in" className={buttonVariants({
                    variant: 'link', className: 'gap-1.5'
                    })}>Already have an account? Login here
                    <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                <div className="grid gap-6">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid gap-2">
                            <div className="grid gap-2 py-2">
                                <Label htmlFor="label">Email</Label>
                                <Input placeholder="you@example.com"
                                className={cn({"focus-visible:ring-red-400" : errors.email})}
                                {...register("email")} />
                                {errors?.email && (
                                    <p className="text-sm text-red-400">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>
                            
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input placeholder="Password"
                                className={cn({"focus-visible:ring-red-400" : errors.password})}
                                {...register("password")} 
                                type="password"/>
                                {errors?.password && (
                                    <p className="text-sm text-red-400">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>

                            <Button className="mt-2">Sign up</Button>

                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default SignUpPage;