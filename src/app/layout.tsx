import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";

import "./globals.css";
import Providers from "@/components/providers";
import { Header } from "@/components/header";
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
  title: "Рулетка для двох",
  description: "Рулетка для двох — сервіс випадкових рішень для пар.",
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
            <div className="grid min-h-screen grid-rows-[auto_1fr_auto] bg-grid-glow">
              <Header />
              <main className="grid">{children}</main>
            </div>
          </ToastRootProvider>
        </Providers>
      </body>
    </html>
  );
}
