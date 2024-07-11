'use client';

import { ShoppingCart } from "lucide-react";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { useState, useEffect } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from '../ui/separator';
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { useCart } from "@/hooks/use-cart";
import CartItem from "./CartItem";

const Cart = () => {
    const [isMounted, setIsMounted] = useState<boolean>(false);
    const { items }  = useCart();
    const itemCount = items.length;
    const cartTotal = items.reduce((total, { product }) => total + product.price, 0);

    useEffect(() => {
        setIsMounted(true);
      }, []);

    return (
        <Sheet>
            <SheetTrigger className="flex items-center -m-2 p-2 group">
                <ShoppingCart aria-hidden="true"
                className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-600"/>
                {itemCount > 0 && (
                <span className="bg-red-400 text-white h-6 w-6 rounded-full 
                flex items-center justify-center text-sm mr-2">
                {isMounted ? itemCount : 0}
                </span>)}
            </SheetTrigger>

            <SheetContent className="flex flex-col w-full pr-0 sm:max-w-lg">
                <SheetHeader className="space-y-2.5 pr-6">
                    <SheetTitle className="text-center">Cart (0)</SheetTitle>
                </SheetHeader>
            
            
            {itemCount > 0 ? (
                <div className="flex flex-col w-full pr-6">
                    <ScrollArea>
                    {items.map(({ product }) => (
                    <CartItem product={product} key={product.id} />
                    ))}
                    </ScrollArea>
                
                <div className="space-y-4 pr-6">
                    <Separator />
                    <div className="space-y-1.5 text-sm">
                        <div className="flex">
                            <span className="flex-1">Total</span>
                            <span> {formatPrice(cartTotal)}</span>
                        </div>
                    </div>
                <SheetFooter>
                    <SheetTrigger asChild>
                        <Link href="/cart"
                        className={buttonVariants({ className: 'w-full' })}>
                            Proceed to checkout
                        </Link>
                    </SheetTrigger>
                </SheetFooter>
                </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-full space-y-1">
                    <div className="text-xl font-semibold">
                        Your cart is empty
                    </div>
                    <SheetTrigger asChild>
                    <Link href="/products"
                    className={buttonVariants({variant: 'link', size: 'sm',
                    className: 'w-full'})}>
                        Start Shopping!
                    </Link>
                    </SheetTrigger>
                </div>
            )}

            </SheetContent>
        </Sheet>
    )
}

export default Cart;