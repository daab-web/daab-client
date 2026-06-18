import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import { QueryProvider } from "@/components/query-provider";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DAAB",
  description: "DAAB Client Application",
};

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased w-full`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            {children}
            <Toaster position="top-center" />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
