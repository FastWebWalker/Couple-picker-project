import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";

import "./globals.css";
import Providers from "@/components/providers";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ToastRootProvider } from "@/components/ui/toaster";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
});

const playfair = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Date Roulette",
  description: "Випадкові побачення та ідеї для пар і друзів.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk" suppressHydrationWarning>
      <body className={`${manrope.variable} ${playfair.variable} font-sans`}>
        <Providers>
          <ToastRootProvider>
            <div className="min-h-screen bg-grid-glow">
              <Header />
              <main>{children}</main>
              <Footer />
            </div>
          </ToastRootProvider>
        </Providers>
      </body>
    </html>
  );
}
