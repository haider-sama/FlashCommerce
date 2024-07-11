import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import NavBar from "@/components/nav/NavBar";
import Providers from "@/components/Providers";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: {
    default: 'FlashCommerce | Store ',
    template: '%s | FlashCommerce'
  },
  description: {
    default: 'FlashCommerce is a premier eCommerce store offering a wide variety of high-quality products. Experience flash shopping with top-notch customer service and fast shipping at FlashCommerce.',
    template: '%s | DeconByte'
  },
  referrer: 'origin-when-cross-origin',
  keywords: ['Next.js', 'React', 'JavaScript', 'eCommerce', 'FlashCommerce'],
  authors: [
    { name: 'Haider', url: 'https://github.com/haider-sama' }
  ]
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={cn("relative h-full font-sans antialiased", inter.className)}>
        <main className="relative flex flex-col min-h-screen">
          <Providers>
          <NavBar />
          <div className="flex-grow flex-1">{children}</div>
          <Footer />
          </Providers>
        </main>

        <Toaster position='top-center' richColors />
        </body>
    </html>
  );
}
