import { DirectorCard } from "@/components/director-card";
import { fetchDirectors } from "@/lib/api/directors";
import { getTranslations } from "next-intl/server";

export default async function DirectorsPage() {
  const navigation = await getTranslations("Navigation");
  const directorsT = await getTranslations("Directors");
  const directors = await fetchDirectors();

  const directorCards = directors.map((director) => ({
    key: director.id,
    name: `${director.firstName} ${director.lastName}`.trim(),
    role: director.role,
    subtitle: director.academicTitle || undefined,
    country: director.countries.join(", ") || "-",
    imageSrc: director.profilePictureUrl || undefined,
    profileUrl: director.scientistId
      ? `/scientists/${director.scientistId}`
      : undefined,
  }));

  return (
    <section className="mx-auto pt-12 flex w-full max-w-6xl flex-col items-center gap-8 text-center px-4">
      <div className="text-center mb-12 md:mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="text-[30px] md:text-4xl lg:text-5xl font-extrabold text-foreground mb-3">
          {navigation("boardOfDirectors")}
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
          {directorsT("intro")}
        </p>
      </div>
      <div className="grid w-full gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {directorCards.map((director, index) => (
          <div
            key={director.key}
            className="animate-in fade-in slide-in-from-bottom-8 duration-700"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <DirectorCard
              name={director.name}
              role={director.role}
              subtitle={director.subtitle}
              country={director.country}
              imageSrc={director.imageSrc}
              profileUrl={director.profileUrl}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
