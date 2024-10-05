"use client";
import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className={inter.className}>
        <main>
          <QueryClientProvider client={queryClient}>
            <div className="w-full">{children}</div>
          </QueryClientProvider>
        </main>
        <Toaster />
      </body>
    </html>
  );
}
