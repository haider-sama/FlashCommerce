'use client';

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ZodError } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthCredentialsValidator, TAuthCredentialsValidator } from '@/lib/validators/account-credentials-validator'
import { trpc } from "@/trpc/client";

const SignInPage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const isSeller = searchParams.get("as") === "seller";
    const origin = searchParams.get("origin");

    const continueAsSeller = () => {
        router.push("?as=seller");
    }
    const continueAsBuyer = () => {
        router.replace("/sign-in", undefined);
    }

    const {register, handleSubmit, formState: {errors}} = useForm<TAuthCredentialsValidator>({
        resolver: zodResolver(AuthCredentialsValidator)
    });


    const { mutate: signIn, isLoading } = trpc.auth.signIn.useMutation({
      onError: (err) => {
        if (err.data?.code === 'UNAUTHORIZED') {
          toast.error("Invalid username or password.");
          return;
        }

        if (err instanceof ZodError) {
          toast.error(err.issues[0].message);
          return;
        }

        toast.error("Oops! Something went wrong. Please try again.");
      },
      onSuccess: async () => {
        toast.success("Login successful!")
        router.refresh();
        if (origin) {
            router.push(`/${origin}`);
            return;
        }
        if (isSeller) {
            router.push("/sell");
            return;
          }
        router.push("/");
      },
    })

    const onSubmit = ({email, password}: TAuthCredentialsValidator) => {
        signIn({ email, password });
    }


    return (
        <div className="mb-20 flex flex-col relative container pt-20 items-center justify-center lg:px-0">
            <div className="flex flex-col mx-auto w-full justify-center space-y-6 sm:w-[350px]">
                <div className="flex flex-col items-center text-center space-y-2">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Sign in to your {isSeller ? 'seller' : ''}{' '}
                        account
                    </h1>
                    <Link href="/sign-up" className={buttonVariants({
                    variant: 'link', className: 'gap-1.5'
                    })}>Don't have an account? Register here
                    <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                <div className="grid gap-6">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid gap-2">
                            <div className="grid gap-1 py-2">
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

                            <Button disabled={isLoading}>
                                {isLoading && (
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                )}
                                Login
                            </Button>

                        </div>
                    </form>

                    <div className="relative">
                        <div className="flex items-center absolute inset-0"
                        aria-hidden="true">
                            <span className="border-t w-full" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                or
                            </span>
                        </div>
                    </div>

                    {isSeller && (
                    <Button
                    onClick={continueAsBuyer}
                    variant='secondary'
                    disabled={isLoading}>
                    Continue as User
                    </Button>
                    )}

                    {!isSeller && (
                    <Button
                    onClick={continueAsSeller}
                    variant='secondary'
                    disabled={isLoading}>
                    Continue as seller
                    </Button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default SignInPage;