import { getTranslations } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function About({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "AboutPage" });

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-8">
      <div className="text-center max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-extrabold mb-4">{t("title")}</h1>
        <p className="text-muted-foreground text-lg">{t("intro")}</p>
      </div>
    </div>
  );
}
