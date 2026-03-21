import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";

import * as React from "react";
import Navbar from "@/components/navbar";
import { QueryProvider } from "@/components/providers/query-provider";
import { NavbarScrollEffect } from "@/components/navbar-scroll-effect";

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

  return (
    <NextIntlClientProvider locale={locale}>
      <QueryProvider>
        <NavbarScrollEffect />
        <div lang={locale} className="min-h-screen flex flex-col">
          <header className="sticky top-0 z-50 py-4 flex gap-2 justify-center transition-all duration-300">
            <Navbar />
          </header>
          <main className="flex-1 flex flex-col w-full">{props.children}</main>
        </div>
      </QueryProvider>
    </NextIntlClientProvider>
  );
}
