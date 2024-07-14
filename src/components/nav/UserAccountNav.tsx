'use client';

import { User } from "@/payload-types"
import { Button } from "../ui/button";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { truncateText } from "@/utils/truncateText";
import { CircleUserRound } from 'lucide-react';

const UserAccountNav = ({ user }: { user: User }) => {
    const { signOut } = useAuth();
    
    return ( 
        <DropdownMenu>
            <DropdownMenuTrigger asChild 
            className="overflow-visible">
                <Button variant="ghost" size="sm" className="relative">
                    <CircleUserRound strokeWidth={1}/>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="bg-white w-64">
                <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-0.5 leading-none">
                    <p>{truncateText(user.email)}</p>
                    </div>
                </div>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild 
                className="cursor-pointer">
                    <Link href="/sell">Seller Dashboard</Link>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={signOut} className="cursor-pointer">
                    Sign Out
                </DropdownMenuItem>
                
            </DropdownMenuContent>
        </DropdownMenu>

    )
}

export default UserAccountNav;