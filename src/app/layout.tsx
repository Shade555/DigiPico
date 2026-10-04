import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { MobileNav } from "@/components/layout/MobileNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DigiPico - Your AI Tech Companion",
  description: "A friendly AI tutor to discover and learn technology.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#080b1a] text-slate-100 min-h-screen pb-16`}>
        {children}
        <MobileNav />
      </body>
    </html>
  );
}
