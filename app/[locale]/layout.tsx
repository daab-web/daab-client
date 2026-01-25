import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getTranslations } from "next-intl/server";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";

import * as React from "react";
import Navbar from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";

import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

type Props = {
  params: Promise<{ locale: string }>;
  children: React.ReactNode;
  session: Session;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Global" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function RootLayout(props: Props) {
  const { locale } = await props.params;

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} justify-self-center antialiased w-full`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider session={props.session}>
            <NextIntlClientProvider>
              {/* <div className="fixed inset-0 -z-10 bg-transparent from-background to-muted backdrop-blur-xs" /> */}
              <header className="py-4 flex gap-2 justify-center">
                <Navbar />
              </header>
              <main className="w-full h-screen">{props.children}</main>
            </NextIntlClientProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
