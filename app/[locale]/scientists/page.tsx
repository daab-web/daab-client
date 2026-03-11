import { getTranslations } from "next-intl/server";

import { ScientistsTable } from "@/components/scientists-table";
import { ScrollReveal } from "@/components/scroll-reveal";

export default async function ScientistsPage() {
  const t = await getTranslations("Scientists");

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-8">
      <ScrollReveal />
      <section className="rounded-2xl border bg-muted/30 px-6 py-10 text-center lg:px-12 fade-in">
        <h1 className="text-3xl font-extrabold uppercase tracking-wide text-primary lg:text-4xl">
          {t("heroTitle")}
        </h1>
      </section>

      <div className="fade-in">
        <ScientistsTable />
      </div>
    </div>
  );
}
