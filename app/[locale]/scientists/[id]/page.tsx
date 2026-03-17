import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import {
  Building2,
  Calendar,
  Globe,
  Linkedin,
  MapPin,
  Sparkles,
} from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import NewsViewer from "@/components/news-viewer";
import { Separator } from "@/components/ui/separator";
import {
  fetchPublicationsByScientistId,
  fetchScientistById,
} from "@/lib/api/scientists";
import { parseScientistDescription } from "@/lib/scientist-description";

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
  const descriptionState = parseScientistDescription(scientist.description);

  return (
    <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-10 overflow-hidden px-4 py-8 md:py-10">
      <div className="animate-in fade-in slide-in-from-top-4 duration-500">
        <Button variant="outline" asChild>
          <Link href="/scientists">{t("detail.back")}</Link>
        </Button>
      </div>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_17.5rem] xl:items-start">
        <div className="order-2 min-w-0 xl:order-1 animate-in fade-in slide-in-from-left-6 duration-700 delay-300">
          <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-background/35 p-5 shadow-xl shadow-black/5 backdrop-blur-md sm:p-7 md:p-8">
            <div>
              <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/30 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5" />
                {t("detail.profile")}
              </p>
              <h1 className="text-4xl font-bold tracking-tight lg:text-6xl lg:leading-[1.05]">
                {`${scientist.firstName} ${scientist.lastName}`}
              </h1>
              <p className="mt-3 max-w-2xl text-base text-muted-foreground lg:text-lg">
                {scientist.academicTitle}
              </p>
            </div>

            <Separator className="my-6" />

            <div className="grid gap-4 md:grid-cols-2">
              {scientist.dateOfBirth && (
                <div className="rounded-2xl border border-border/70 bg-background/35 p-4 backdrop-blur-sm">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    {t("detail.dateOfBirth")}
                  </span>
                  <p className="mt-2 text-sm font-medium">
                    {new Date(scientist.dateOfBirth).toLocaleDateString(
                      locale,
                      { year: "numeric", month: "long", day: "numeric" },
                    )}
                  </p>
                </div>
              )}
              {scientist.institutions.length > 0 && (
                <div className="rounded-2xl border border-border/70 bg-background/35 p-4 backdrop-blur-sm">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    <Building2 className="h-3.5 w-3.5" />
                    {t("detail.institution")}
                  </span>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {scientist.institutions.map((inst) => (
                      <Badge key={inst} variant="secondary">
                        {inst}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {scientist.countries.length > 0 && (
                <div className="rounded-2xl border border-border/70 bg-background/30 p-4 backdrop-blur-sm">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    {t("detail.country")}
                  </span>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {scientist.countries.map((c) => (
                      <Badge key={c} variant="outline">
                        {c}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {scientist.areas.length > 0 && (
              <div className="mt-5 rounded-2xl border border-border/70 bg-background/30 p-4 backdrop-blur-sm">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {t("detail.areas")}
                </span>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {scientist.areas.map((area) => (
                    <Badge key={area}>{area}</Badge>
                  ))}
                </div>
              </div>
            )}

            {descriptionState && (
              <>
                <Separator className="my-6" />
                <div>
                  <h2 className="mb-3 text-lg font-semibold lg:text-xl">
                    {t("detail.profile")}
                  </h2>
                  <div className="max-w-3xl leading-8 text-muted-foreground">
                    <NewsViewer editorState={descriptionState} />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <aside className="order-1 xl:order-2 animate-in fade-in slide-in-from-right-6 duration-700 delay-150">
          <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-background/45 p-4 shadow-xl shadow-black/5 backdrop-blur-md xl:sticky xl:top-24">
            <div className="relative mx-auto h-72 w-full max-w-64 overflow-hidden rounded-2xl border border-border/70 bg-background/30 shadow-sm backdrop-blur-sm">
              {scientist.photoUrl ? (
                <Image
                  src={scientist.photoUrl}
                  alt={`${scientist.firstName} ${scientist.lastName}`}
                  fill
                  sizes="(min-width: 1280px) 248px, 320px"
                  className="object-cover transition duration-500 hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center px-4 text-center text-sm text-muted-foreground">
                  {t("detail.noPhoto")}
                </div>
              )}
            </div>

            {hasLinks && (
              <div className="mt-4 border-t border-border/70 pt-4">
                <p className="mb-3 text-center text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                  {t("detail.links")}
                </p>
                <div className="flex items-center justify-center gap-2.5">
                  {scientist.linkedInUrl && (
                    <a
                      href={scientist.linkedInUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={t("detail.linkedIn")}
                      title={t("detail.linkedIn")}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-background/80 text-primary transition hover:-translate-y-0.5 hover:border-primary/40 hover:bg-background"
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                  )}
                  {scientist.orcid && (
                    <a
                      href={`https://orcid.org/${scientist.orcid}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={t("detail.orcid")}
                      title={t("detail.orcid")}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-background/80 text-primary transition hover:-translate-y-0.5 hover:border-primary/40 hover:bg-background"
                    >
                      <span className="flex h-4 w-4 items-center justify-center rounded-full border border-current text-[9px] font-bold leading-none">
                        iD
                      </span>
                    </a>
                  )}
                  {scientist.website && (
                    <a
                      href={scientist.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={t("detail.website")}
                      title={t("detail.website")}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-background/80 text-primary transition hover:-translate-y-0.5 hover:border-primary/40 hover:bg-background"
                    >
                      <Globe className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>

      {hasPublications && (
        <Card className="animate-in fade-in slide-in-from-bottom-6 duration-700 delay-500 overflow-hidden border border-border/70 bg-background/45 shadow-xl shadow-black/5 backdrop-blur-md">
          <CardContent className="p-6">
            <h2 className="mb-5 text-lg font-semibold lg:text-xl">
              {t("detail.publications")}
            </h2>
            <ol className="grid gap-2.5">
              {publications.map((pub, index) => (
                <li
                  key={index}
                  className="group flex gap-3 rounded-xl border border-border/70 bg-background/30 p-3 backdrop-blur-sm transition hover:bg-background/45"
                >
                  <span className="mt-0.5 inline-flex h-6 min-w-6 shrink-0 items-center justify-center rounded-full bg-background/50 text-xs font-semibold tabular-nums text-muted-foreground">
                    {index + 1}
                  </span>
                  {pub.url ? (
                    <a
                      href={pub.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary underline-offset-4 group-hover:underline"
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
