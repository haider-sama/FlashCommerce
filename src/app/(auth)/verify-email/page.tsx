import VerifyEmail from "@/components/emails/VerifyEmail";


interface VerifyEmailPageProps {
    searchParams: {
      [key: string]: string | string[] | undefined
    }
}

const VerifyEmailPage = ({ searchParams }: VerifyEmailPageProps) => {
    const token = searchParams.token;
    const toEmail = searchParams.to;

    return (
        <div className="flex flex-col items-center justify-center pt-20 lg:px-0 container relative">
            <div className="flex flex-col justify-center w-full mx-auto space-y-6 sm:w-[350px]">
                {token && typeof token === "string" ? (
                    <div className="grid gap-6">
                        <VerifyEmail token={token} />
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full space-y-1">
                        <h3 className='font-semibold text-2xl'>Check your email.</h3>
                    

                    {toEmail ? (
                        <p className='text-muted-foreground text-center'>
                        We&apos;ve sent a verification link to{' '}
                        <span className='font-semibold'>{toEmail}</span>
                        </p>
                    ) : (
                        <p className='text-muted-foreground text-center'>
                            We&apos;ve sent a verification link to your
                            email.
                        </p>
                    )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default VerifyEmailPage;