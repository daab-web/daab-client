import type { Metadata } from "next";
import { getMessages, getTranslations } from "next-intl/server";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";

import * as React from "react";
import Navbar from "@/components/navbar";
import { Footer } from "@/components/footer";

type Props = {
  params: Promise<{ locale: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Global" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function LocaleLayout(props: Props) {
  const { locale } = await props.params;
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div lang={locale} className="min-h-screen flex flex-col">
        <header className="fixed top-0 z-50 flex w-full justify-center border-b border-slate-200/70 bg-white/95 py-3 shadow-sm backdrop-blur-md transition-all duration-300 dark:border-black/80 dark:bg-black/95 dark:shadow-[0_1px_0_rgba(255,255,255,0.04)]">
          <Navbar />
        </header>
        <main className="flex w-full flex-1 flex-col pt-24 md:pt-28">
          {props.children}
        </main>
        <footer className="w-full border-t border-slate-200/70 bg-[#f5f8fe] text-[#274380] dark:border-white/10 dark:bg-[#19191A] dark:text-[#C9D6F0]">
          <Footer />
        </footer>
      </div>
    </NextIntlClientProvider>
  );
}
