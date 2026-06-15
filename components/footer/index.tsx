import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, Globe, MapPin } from "lucide-react";
import { NAV_ITEMS } from "@/lib/navigation";

const linkClass =
  "text-sm text-[#274380]/85 transition-colors hover:text-[#274380] dark:text-[#C9D6F0]/85 dark:hover:text-[#C9D6F0]";

export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("Navigation");

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-[#274380] dark:text-[#C9D6F0]">
            {t("sitemap")}
          </h3>
          <ul className="space-y-2">
            {NAV_ITEMS.map(({ key, href }) => (
              <li key={key}>
                <Link href={href} className={linkClass}>
                  {tNav(key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4 md:col-span-2">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-[#274380] dark:text-[#C9D6F0]">
            {t("contact")}
          </h3>

          <p className="text-sm font-medium leading-snug text-[#274380] dark:text-[#C9D6F0]">
            {t("chairmanName")}
            <br />
            <span className="font-normal text-[#274380]/75 dark:text-[#C9D6F0]/75">
              {t("chairmanTitle")}
            </span>
          </p>

          <Separator className="my-3 bg-[#274380]/15 dark:bg-[#C9D6F0]/15" />

          <div className="space-y-2 text-sm text-[#274380]/85 dark:text-[#C9D6F0]/85">
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#274380]/70 dark:text-[#C9D6F0]/70" />
              <span>{t("address")}</span>
            </div>

            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-[#274380]/70 dark:text-[#C9D6F0]/70" />
              <a href="tel:+905551474674" className={linkClass}>
                +90 555 147 4674
              </a>
            </div>

            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-[#274380]/70 dark:text-[#C9D6F0]/70" />
              <a href="mailto:daad.waas2024@gmail.com" className={linkClass}>
                daad.waas2024@gmail.com
              </a>
            </div>

            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 shrink-0 text-[#274380]/70 dark:text-[#C9D6F0]/70" />
              <a
                href="https://daab-waas.org"
                target="_blank"
                rel="noopener noreferrer"
                className={`${linkClass} underline underline-offset-2`}
              >
                daab-waas.org
              </a>
            </div>
          </div>
        </div>
      </div>

      <Separator className="mt-10 mb-6 bg-[#274380]/15 dark:bg-[#C9D6F0]/15" />
      <p className="text-center text-xs text-[#274380]/60 md:text-left dark:text-[#C9D6F0]/60">
        © {new Date().getFullYear()} {t("copyright")}
      </p>
    </div>
  );
}
