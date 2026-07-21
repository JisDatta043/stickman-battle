import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Stickman Battle - 2D Online Multiplayer Game",
  description: "Minimalist, fast-paced 2D stickman fighting game. Play vs Bot or online Player vs Player.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${outfit.variable}`}>
      <body className="min-h-screen bg-[#0a0c14] text-slate-100 antialiased flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
