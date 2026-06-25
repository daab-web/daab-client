import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, Globe, MapPin } from "lucide-react";
import { NAV_ITEMS } from "@/lib/navigation";

const linkClass =
  "text-sm text-brand-accent/85 transition-colors hover:text-brand-accent";

export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("Navigation");

  return (
    <div className="container  mx-auto px-6 py-10">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-brand-accent">
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
          <h3 className="text-sm font-semibold uppercase tracking-widest text-brand-accent">
            {t("contact")}
          </h3>

          <p className="text-sm font-medium leading-snug text-brand-accent">
            {t("chairmanName")}
            <br />
            <span className="font-normal text-brand-accent/75">
              {t("chairmanTitle")}
            </span>
          </p>

          <Separator className="my-3 bg-brand-accent/15" />

          <div className="space-y-2 text-sm text-brand-accent/85">
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-accent/70" />
              <span>{t("address")}</span>
            </div>

            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-brand-accent/70" />
              <a href="tel:+905551474674" className={linkClass}>
                +90 555 147 4674
              </a>
            </div>

            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-brand-accent/70" />
              <a href="mailto:daad.waas2024@gmail.com" className={linkClass}>
                daad.waas2024@gmail.com
              </a>
            </div>

            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 shrink-0 text-brand-accent/70" />
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

      <Separator className="mt-10 mb-6 bg-brand-accent/15" />
      <p className="text-center text-xs text-brand-accent/60 md:text-left">
        © {new Date().getFullYear()} {t("copyright")}
      </p>
    </div>
  );
}
