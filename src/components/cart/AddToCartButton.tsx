'use client';

import { Product } from "@/payload-types";
import { useCart } from "@/hooks/use-cart";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";

const AddToCartButton = ({product}: {product: Product}) => {
    const { addItem } = useCart();
    const [isSuccess, setIsSuccess] = useState<boolean>(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
        setIsSuccess(false);
        }, 2000)
    
        return () => clearTimeout(timeout);
        }, [isSuccess])

    return (
        <Button  onClick={() => {
        addItem(product);
        setIsSuccess(true);
        }}
        size="lg"
        className="w-full">
            {isSuccess ? 'Product Added!' : 'Add to cart'}
        </Button>
    )
}

export default AddToCartButton;