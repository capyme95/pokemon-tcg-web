import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pokemon TCG Cards",
  description: "Pokemon Trading Card Game Database",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased min-h-screen`}>
        <nav className="border-b border-[#333] px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <a href="/" className="text-xl font-bold tracking-tight">
              POKEMON TCG
            </a>
            <div className="flex gap-6">
              <a href="/" className="text-sm text-gray-400 hover:text-white transition">
                Cards
              </a>
              <a href="/sets" className="text-sm text-gray-400 hover:text-white transition">
                Sets
              </a>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
