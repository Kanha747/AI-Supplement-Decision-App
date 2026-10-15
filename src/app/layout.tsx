import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Fraunces, Outfit } from "next/font/google";
import { CompareTray } from "@/components/compare-controls";
import { Footer } from "@/components/footer";
import { Header, MobileNav } from "@/components/header";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: {
    default: "Evidra — evidence before the capsule",
    template: "%s · Evidra",
  },
  description:
    "Scan a supplement barcode, read ingredient evidence, and get a health-goals note grounded in dose, safety, and trial context.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${fraunces.variable} ${outfit.variable} antialiased`}>
        <Header />
        <div className="min-h-screen pb-20 md:pb-0">{children}</div>
        <Footer />
        <CompareTray />
        <MobileNav />
      </body>
    </html>
  );
}
