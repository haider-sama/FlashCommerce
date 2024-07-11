import MaxWidthWrapper from "@/components/MaxWidthWrappper";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Clock, ShieldCheck, Globe } from "lucide-react";
import ProductReel from "@/components/product/ProductReel";

const perks = [
  {
    name: 'Lightning-Fast Delivery',
    Icon: Clock,
    description:
      'Experience the thrill of having your purchases arrive at your doorstep in mere seconds.',
  },
  {
    name: 'Top-Tier Quality Assurance',
    Icon: ShieldCheck,
    description:
      'Our team meticulously verifies each product to uphold our premium quality standards. Unsatisfied? Enjoy a hassle-free 30-day refund policy.',
  },
  {
    name: 'Eco-Friendly Commitment',
    Icon: Globe,
    description:
      'We dedicate 1% of our sales to support environmental preservation and restoration efforts.',
  },
];


export default function Home() {
  return (
    <>
      <MaxWidthWrapper>
        <div className="flex flex-col text-center mx-auto py-24 items-center max-w-2xl">
        <h1 className='text-2xl font-bold text-gray-800 sm:text-4xl'>
            Flash
            <span className='text-yellow-400'>Commerce</span>
          </h1>
          <p className='mt-4 text-lg text-muted-foreground'>
          Discover effortless shopping and lightning-fast 
          delivery with FlashCommerce. Now available in your town!
          </p>
          <div className='flex flex-col sm:flex-row gap-4 mt-6'>
            <Link href="/products" className={buttonVariants()}>
              Start shopping &rarr;
            </Link>
          </div>
        </div>

        <ProductReel
          query={{ sort: "desc", limit: 4 }}
          href='/products?sort=recent'
          title='Most Popular'
        />

      </MaxWidthWrapper>
      
    <section className="border-t border-b border-gray-200 bg-gray-100">
    <MaxWidthWrapper>
    <div className='mb-8 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 
    lg:grid-cols-3 lg:gap-x-8 lg:gap-y-0'>

      {perks.map((perk) => (
        <div key={perk.name} 
        className="text-center md:flex md:items-start md:text-left lg:block lg:text-center">
          <div className="mt-4 flex justify-center md:flex-shrink-0">
            <div className="flex items-center justify-center rounded-full 
            bg-yellow-200 text-yellow-500 h-16 w-16">
              {<perk.Icon className="w-1/2 h-1/2"/>}
            </div>
          </div>

          <div className="mt-6 md:ml-4 md:mt-0 lg:ml-0 lg:mt-6">
            <h3 className='text-base font-medium text-gray-800'>
                    {perk.name}
            </h3>
                <p className='mt-3 text-sm text-muted-foreground'>
                    {perk.description}
                  </p>
          </div>
        </div>
      ))}

    </div>
    </MaxWidthWrapper>
    </section>
	</>
  );
}
