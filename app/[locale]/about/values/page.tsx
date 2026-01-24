const contentLoaders = {
  az: () => import("@/content/az/values.md"),
  en: () => import("@/content/en/values.md"),
} as const;

type LocaleKey = keyof typeof contentLoaders;

const isSupportedLocale = (locale: string): locale is LocaleKey =>
  Object.prototype.hasOwnProperty.call(contentLoaders, locale);

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Values({ params }: Props) {
  const { locale } = await params;
  const loader = isSupportedLocale(locale)
    ? contentLoaders[locale]
    : contentLoaders.en;
  const { default: Content } = await loader();

  return (
    <section
      id="values"
      data-section="values"
      className="w-full max-w-4xl mx-auto px-4"
    >
      <div className="space-y-6 [&_p]:text-center [&_p]:text-lg">
        <Content />
      </div>
    </section>
  );
}
