import { DirectorCard } from "@/components/director-card";
import { getTranslations } from "next-intl/server";

const directorKeys = [
  "masud",
  "baxtiyar",
  "seymur",
  "emil",
  "nigar",
  "sevinc",
  "saadat",
  "teymur",
  "togrulIsmayil",
  "togrulKerimov",
  "yulduz",
] as const;

const directorImages: Record<(typeof directorKeys)[number], string> = {
  masud: "/directors/masud.jpg",
  baxtiyar: "/directors/baxtiyar.jpg",
  seymur: "/directors/seymur.jpg",
  emil: "/directors/emil.jpg",
  nigar: "/directors/nigar.jpg",
  sevinc: "/directors/sevinc.jpg",
  saadat: "/directors/saadat.jpg",
  teymur: "/directors/teymur.jpg",
  togrulIsmayil: "/directors/togrulIsmayil.jpg",
  togrulKerimov: "/directors/togrulKerimov.png",
  yulduz: "/directors/yulduz.jpg",
};

export default async function DirectorsPage() {
  const navigation = await getTranslations("Navigation");
  const directorsT = await getTranslations("Directors");

  const directors = directorKeys.map((key) => {
    const profileUrl = directorsT(`members.${key}.profileUrl`);
    const subtitle = directorsT(`members.${key}.subtitle`);

    return {
      key,
      name: directorsT(`members.${key}.name`),
      role: directorsT(`members.${key}.role`),
      subtitle: subtitle.trim() === "" ? undefined : subtitle,
      country: directorsT(`members.${key}.country`),
      imageSrc: directorImages[key],
      profileUrl: profileUrl === "#" ? undefined : profileUrl,
    };
  });

  return (
    <section className="mx-auto pt-12 flex w-full max-w-6xl flex-col items-center gap-8 text-center">
      <div className="text-center mb-12 md:mb-16">
        <h1 className="text-[30px] md:text-4xl lg:text-5xl font-extrabold text-foreground mb-3">
          {navigation("boardOfDirectors")}
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
          {directorsT("intro")}
        </p>
      </div>
      <div className="grid w-full gap-8 sm:grid-cols-2 xl:grid-cols-4">
        {directors.map((director) => (
          <DirectorCard
            key={director.key}
            name={director.name}
            role={director.role}
            subtitle={director.subtitle}
            country={director.country}
            imageSrc={director.imageSrc}
            profileUrl={director.profileUrl}
          />
        ))}
      </div>
    </section>
  );
}
