import Image from "next/image";
import MaxWidthWrapper from "../MaxWidthWrappper";
import Link from "next/link";
import NavItems from "./NavItems";
import { buttonVariants } from "../ui/button";
import Cart from "../cart/Cart";
import UserAccountNav from "./UserAccountNav";
import MobileNav from "./MobileNav";
import { cookies } from "next/headers";
import { getServerSideUser } from "@/lib/payload-utils";

const NavBar = async () => {
    const nextCookies = cookies();
    const { user } = await getServerSideUser(nextCookies);

    return (
        <div className="sticky z-50 inset-x-0 top-0 h-16">
            <header className="relative bg-white">
                <MaxWidthWrapper>
                    <div className="border-b border-gray-200">
                        <div className="flex items-center justify-between h-12">
                        <MobileNav />

                            <div className="flex items-center  ml-4 lg:ml-0">
                                <Link href="/">
                                <div className="flex items-center space-x-2 cursor-pointer">
                                    <Image src="/logo.png" alt="FlashCommerce"
                                    width={32} height={32} />
                                    <span className="text-lg font-bold">FlashCommerce</span>
                                    </div>
                                </Link>
                            </div>


                            <div className='hidden z-50 lg:ml-8 lg:block lg:self-stretch'>
                                <NavItems />
                            </div>


                            <div className="flex items-center ml-auto">
                                <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                                {!user && (
                                <>
                                    <Link href='/sign-in'
                                    className={buttonVariants({ variant: 'ghost' })}>
                                        Login
                                    </Link>
                                <span className="h-6 w-px bg-gray-200" aria-hidden="true" />
                                <Link href='/sign-up' 
                                className={buttonVariants({ variant: 'ghost' })}>
                                    Sign up
                                </Link>
                                <div className='flex lg:ml-6'>
                                    <span aria-hidden="true"
                                    className="h-6 w-px bg-gray-200"/>
                                </div>
                                </>
                                )}

                                {user && (
                                <>
                                <UserAccountNav user={user} />
                                <span className="h-6 w-px bg-gray-200" aria-hidden="true" />
                                </>
                                )}


                                <div className="ml-4 flow-root lg:ml-6">
                                    <Cart />
                                </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </MaxWidthWrapper>
            </header>
        </div>
    );
}

export default NavBar;