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
          className="fixed w-full top-0 z-50 py-4 flex gap-2 bg-white dark:bg-[var(--navbar-dark-bg)]
          justify-center transition-all duration-300 border-b shadow-xs"
        >
          <Navbar />
        </header>
        <main className="flex-1 flex flex-col w-full mt-15">
          {props.children}
        </main>
        <footer className="w-full border-t border-brand-accent/10">
          <Footer />
        </footer>
      </div>
    </NextIntlClientProvider>
  );
}
