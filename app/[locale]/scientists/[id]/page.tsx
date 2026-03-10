import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Globe, Linkedin } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  fetchPublicationsByScientistId,
  fetchScientistById,
} from "@/lib/api/scientists";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export default async function ScientistDetailPage({ params }: Props) {
  const { locale, id } = await params;
  const t = await getTranslations({ locale, namespace: "Scientists" });

  const scientist = await fetchScientistById(id);
  if (!scientist) {
    notFound();
  }
  const publications = await fetchPublicationsByScientistId(scientist.id);

  const hasLinks =
    scientist.linkedInUrl || scientist.orcid || scientist.website;
  const hasPublications = publications.length > 0;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8">
      <div className="animate-in fade-in slide-in-from-top-4 duration-500">
        <Button variant="outline" asChild>
          <Link href="/scientists">{t("detail.back")}</Link>
        </Button>
      </div>

      {/* Hero: two-column */}
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        {/* Left column: photo + links */}
        <div className="flex shrink-0 flex-col items-center gap-4 lg:w-56 animate-in fade-in slide-in-from-left-6 duration-700 delay-150">
          <div className="relative h-52 w-52 overflow-hidden rounded-2xl border bg-muted shadow-sm">
            {scientist.photoUrl ? (
              <Image
                src={scientist.photoUrl}
                alt={`${scientist.firstName} ${scientist.lastName}`}
                fill
                sizes="208px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                {t("detail.noPhoto")}
              </div>
            )}
          </div>

          {hasLinks && (
            <div className="flex w-full flex-col gap-2">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {t("detail.links")}
              </p>
              <div className="flex flex-col gap-1.5">
                {scientist.linkedInUrl && (
                  <a
                    href={scientist.linkedInUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <Linkedin className="h-4 w-4 shrink-0" />
                    {t("detail.linkedIn")}
                  </a>
                )}
                {scientist.orcid && (
                  <a
                    href={`https://orcid.org/${scientist.orcid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-current text-[9px] font-bold leading-none">
                      iD
                    </span>
                    {t("detail.orcid")}
                  </a>
                )}
                {scientist.website && (
                  <a
                    href={scientist.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <Globe className="h-4 w-4 shrink-0" />
                    {t("detail.website")}
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right column: name, meta, description, areas */}
        <div className="flex flex-1 flex-col gap-6 animate-in fade-in slide-in-from-right-6 duration-700 delay-300">
          {/* Name & title */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
              {`${scientist.firstName} ${scientist.lastName}`}
            </h1>
            <p className="mt-1 text-base text-muted-foreground">
              {scientist.academicTitle}
            </p>
          </div>

          {/* Institution + Country */}
          <div className="flex flex-wrap gap-4">
            {scientist.institutions.length > 0 && (
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {t("detail.institution")}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {scientist.institutions.map((inst) => (
                    <Badge key={inst} variant="secondary">
                      {inst}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {scientist.countries.length > 0 && (
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {t("detail.country")}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {scientist.countries.map((c) => (
                    <Badge key={c} variant="outline">
                      {c}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Areas */}
          {scientist.areas.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {t("detail.areas")}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {scientist.areas.map((area) => (
                  <Badge key={area}>{area}</Badge>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {scientist.description && (
            <>
              <Separator />
              <div>
                <h2 className="mb-3 text-lg font-semibold">
                  {t("detail.profile")}
                </h2>
                <p className="leading-7 text-muted-foreground">
                  {scientist.description}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Publications */}
      {hasPublications && (
        <Card className="animate-in fade-in slide-in-from-bottom-6 duration-700 delay-500">
          <CardContent className="p-6">
            <h2 className="mb-4 text-lg font-semibold">
              {t("detail.publications")}
            </h2>
            <ol className="flex flex-col gap-3">
              {publications.map((pub, index) => (
                <li key={index} className="flex items-baseline gap-3">
                  <span className="shrink-0 text-sm tabular-nums text-muted-foreground">
                    {index + 1}.
                  </span>
                  {pub.url ? (
                    <a
                      href={pub.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      {pub.title}
                    </a>
                  ) : (
                    <span className="text-sm">{pub.title}</span>
                  )}
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
