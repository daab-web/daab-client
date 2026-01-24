import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { findScientistById } from "@/lib/scientists";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export default async function ScientistDetailPage({ params }: Props) {
  const { locale, id } = await params;
  const t = await getTranslations({ locale, namespace: "Scientists" });

  const scientistId = Number(id);
  const scientist = Number.isInteger(scientistId)
    ? findScientistById(scientistId)
    : undefined;

  if (!scientist) {
    notFound();
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
            {scientist.fullName}
          </h1>
          <p className="mt-2 text-base text-muted-foreground">
            {scientist.academicTitle} · {scientist.institution}
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/scientists">{t("detail.back")}</Link>
        </Button>
      </div>

      <section className="rounded-2xl border bg-muted/30 p-6 shadow-sm lg:p-8">
        <dl className="grid gap-6 lg:grid-cols-2">
          <div className="flex flex-col gap-2">
            <dt className="text-sm font-medium text-muted-foreground">
              {t("detail.country")}
            </dt>
            <dd className="text-lg font-semibold text-foreground">
              {scientist.countries.join(", ")}
            </dd>
          </div>
          <div className="flex flex-col gap-2">
            <dt className="text-sm font-medium text-muted-foreground">
              {t("detail.areas")}
            </dt>
            <dd className="text-lg text-foreground">
              <ul className="list-disc space-y-1 pl-5 text-base">
                {scientist.areas.map((area) => (
                  <li key={area}>{area}</li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>
      </section>

      <section className="rounded-2xl border bg-card p-6 shadow-sm lg:p-8">
        <h2 className="text-2xl font-semibold">{t("detail.profile")}</h2>
        <p className="mt-4 leading-7 text-muted-foreground">
          {scientist.description}
        </p>
      </section>
    </div>
  );
}
