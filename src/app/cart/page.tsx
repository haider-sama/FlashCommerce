'use client';

import { useCart } from "@/hooks/use-cart";
import { trpc } from "@/trpc/client";
import { Check, Loader2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PRODUCT_CATEGORIES } from "@/config";
import { cn, formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";


const CartPage = () => {
    const [isMounted, setIsMounted] = useState<boolean>(false);
    const { items, removeItem } = useCart();
    const router = useRouter();
    const productIds = items.map(({ product }) => product.id);
    const cartTotal = items.reduce((total, { product }) => total + product.price, 0);

    const { mutate: createCheckoutSession, isLoading } =
    trpc.payment.createSession.useMutation({
      onSuccess: ({ url }) => {
        if (url) router.push(url)
      },
    });

    useEffect(() => {
        setIsMounted(true);
      }, []);

    return (
        <div className="bg-white">
            <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
                <h1 className="text-3xl text-center font-bold tracking-tight text-gray-800 sm:text-4xl">
                    Cart
                </h1>

                <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
                    <div className={cn('lg:col-span-7', {
                    "rounded-lg border-2 border-dashed border-zinc-200 p-12" :
                    isMounted && items.length === 0
                    })}>

                    {isMounted && items.length === 0 && (
                        <div className="flex h-full flex-col items-center justify-center space-y-1">
                            <h3 className="font-semibold text-2xl">Your cart is empty</h3>
                                <p className="text-muted-foreground text-center">
                                    Whoops! Nothing to show here yet.
                                </p>
                        </div>
                    )}

                    <ul className={cn({
                    "divide-y divide-gray-200 border-b border-t border-gray-200" :
                        isMounted && items.length > 0
                    })}>
                        {isMounted && items.map(({ product }) => {
                        const label = PRODUCT_CATEGORIES.find(c => c.value === product.category)?.label;
                        const { image } = product.images[0];

                        return (
                            <li key={product.id} className="flex py-6 sm:py-10">
                                <div className="flex-shrink-0">
                                    <div className="relative h-24 w-24">
                                    {typeof image !== "string" && image.url && (
                                        <Image 
                                        fill 
                                        src={image.url}
                                        alt={product.name}
                                        className="h-full w-full rounded-md object-cover object-center 
                                        sm:h-48 sm:w-48"/>
                                        )}
                                    </div>
                                </div>

                                <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                                    <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                                        <div className="flex justify-between">
                                            <h3 className="text-sm">
                                            <Link href={`/product/${product.id}`}
                                            className='font-medium text-gray-600 hover:text-gray-800'>
                                                {product.name}
                                            </Link>
                                            </h3>
                                        </div>

                                        <div className="mt-1 flex text-sm">
                                            <p className="text-muted-foreground">
                                                Category: {label}
                                            </p>
                                        </div>

                                        <div className="mt-1 flex text-sm">
                                            <p className="text-muted-foreground">
                                                {formatPrice(product.price)}
                                            </p>
                                        </div>

                                        <div className="mt-4 sm:mt-0 sm:pr-9 w-20">
                                            <div className="absolute right-0 top-0">
                                                <Button onClick={() => removeItem(product.id)}
                                                aria-label="Remove" variant="ghost">   
                                                    <X className="h-4 w-4" aria-hidden="true" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="mt-4 flex space-x-2 text-sm text-gray-800">
                                        <Check className="h-5 w-5 flex-shrink-0 text-green-400" />
                                        <span>Eligible for instant delivery.</span>
                                    </p>
                                </div>
                            </li>
                        )
                    })}
                    </ul>
                    </div>

                    <section className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
                        <h2 className="text-lg font-medium text-gray-800">Order Summary</h2>
                        <div className="mt-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-600">Order Total</p>
                                <p className="text-sm font-medium text-gray-800">
                                    {isMounted ? (
                                    formatPrice(cartTotal)
                                    ) : (
                                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                    )}
                                </p>
                            </div>
                        </div>

                            <div className="mt-6">
                                <Button onClick={() => createCheckoutSession({ productIds })}
                                disabled={items.length === 0 || isLoading}
                                size="lg"
                                className="w-full">
                                {isLoading && <Loader2 className="w-4 h-4 animate-spin mr-1.5" />}
                                Checkout
                                </Button>
                            </div>
                    </section>
                </div>
            </div>
        </div>
    )
}

export default CartPage;