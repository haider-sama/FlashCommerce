'use client';

import { PRODUCT_CATEGORIES } from "@/config";
import { Button } from "../ui/button";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

type Category = (typeof PRODUCT_CATEGORIES)[number];

interface NavItemProps {
  category: Category
  handleOpen: () => void
  close: () => void
  isOpen: boolean
  isAnyOpen: boolean
};

const NavItem = ({  
    isAnyOpen,
    category,
    handleOpen,
    close,
    isOpen} : NavItemProps) => {
        
    return (
        <div className="flex">
          
          <div className="relative flex items-center">
            <Button onClick={handleOpen} className="gap-1.2" 
            variant={isOpen ? "secondary" : "ghost"}>
              {category.label}
              <ChevronDown className={cn("h-4 w-4 transition-all text-muted-foreground", {
                "-rotate-180" : isOpen
              })} />
            </Button>
          </div>


          {isOpen && (
            <div onClick={() => close()}
            className={cn("absolute inset-x-0 top-full text-sm text-muted-foreground", {
            "animate-in fade-in-10 slide-in-from-top-5": !isAnyOpen
            })}>
              <div className="absolute inset-0 top-1/2 bg-white shadow" aria-hidden="true"></div>
            

            <div className="relative bg-white">
              <div className="mx-auto max-w-6xl px-8">
                <div className="grid grid-cols-4 gap-x-8 gap-y-10 py-16">
                  <div className="col-span-4 col-start-1 grid grid-cols-3 gap-x-8">
                    {category.featured.map((item) => (
                      <div onClick={() => close}
                      key={item.name}
                      className="group relative text-base sm:text-sm">
                        <p
                        className="mt-6 font-medium text-gray-800 block">
                          {item.name}
                        </p>
                        <Link href={item.href}
                        className="mt-1 hover:underline">
                          Shop now &rarr;
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            </div>


        )}
        </div>
    );
}

export default NavItem;