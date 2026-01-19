import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import necessity1 from "@/public/about/necessity.jpg";
import necessity2 from "@/public/about/necessity2.jpg";

export default async function About() {
  const navTranslation = await getTranslations("Navigation");
  const aboutTranslation = await getTranslations("About");

  return (
    <Accordion
      type="single"
      collapsible
      className="mx-auto w-full max-w-3xl"
      defaultValue=""
    >
      <AccordionItem value="necessity">
        <AccordionTrigger>{navTranslation("about.necessity")}</AccordionTrigger>
        <AccordionContent className="flex flex-col items-center gap-4 text-balance text-lg text-center">
          <div className="w-full text-center">
            <h1 className="font-extrabold text-2xl">
              {aboutTranslation("necessity.title")}
            </h1>
          </div>
          <Image src={necessity1} alt="necessity1" className="self-center" />
          <p>{aboutTranslation("necessity.part1")}</p>
          <Image src={necessity2} alt="necessity2" className="self-center" />
          <p>{aboutTranslation("necessity.part2")}</p>
          <p>{aboutTranslation("necessity.part3")}</p>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="mission">
        <AccordionTrigger>{navTranslation("about.mission")}</AccordionTrigger>
        <AccordionContent className="flex flex-col items-center gap-4 text-balance text-lg text-center">
          <div className="w-full text-center">
            <h1 className="font-extrabold text-2xl">
              {aboutTranslation("mission.title")}
            </h1>
          </div>
          <p>{aboutTranslation("mission.text")}</p>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="vision">
        <AccordionTrigger>{navTranslation("about.vision")}</AccordionTrigger>
        <AccordionContent className="flex flex-col items-center gap-4 text-balance text-lg text-center">
          <div className="w-full text-center">
            <h1 className="font-extrabold text-2xl">
              {aboutTranslation("vision.title")}
            </h1>
          </div>
          <p>{aboutTranslation("vision.text")}</p>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="values">
        <AccordionTrigger>{navTranslation("about.values")}</AccordionTrigger>
        <AccordionContent className="flex flex-col items-center gap-4 text-balance text-lg text-center">
          <div className="w-full text-center">
            <h1 className="font-extrabold text-2xl">
              {aboutTranslation("values.title")}
            </h1>
            <p>{aboutTranslation("values.text")}</p>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="charter">
        <AccordionTrigger>{navTranslation("about.charter")}</AccordionTrigger>
        <AccordionContent className="flex flex-col items-center gap-4 text-balance text-lg text-center">
          <div className="w-full text-center">
            <h1 className="font-extrabold text-2xl">
              {aboutTranslation("charter.title")}
            </h1>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
