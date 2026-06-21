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
        <header
          className="fixed w-full top-0 z-50 py-4 flex gap-2 bg-white dark:bg-[#14141e]
          justify-center transition-all duration-300 border-b shadow-xs"
        >
          <Navbar />
        </header>
        <main className="flex-1 flex flex-col w-full mt-30">
          {props.children}
        </main>
        <footer className="w-full border-t border-[#274380]/10 bg-[#EEF3FA] text-[#274380] dark:border-[#C9D6F0]/10 dark:text-[#C9D6F0]">
          <Footer />
        </footer>
      </div>
    </NextIntlClientProvider>
  );
}
