import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation"; // adjust to your next-intl routing setup
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, Globe, MapPin } from "lucide-react";
import { NAV_ITEMS } from "@/lib/navigation";

export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("Navigation");

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* ── Sitemap ── */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm uppercase tracking-widest">
            {t("sitemap")}
          </h3>
          <ul className="space-y-2">
            {NAV_ITEMS.map(({ key, href }) => (
              <li key={key}>
                <Link
                  href={href}
                  className="text-sm transition-colors"
                >
                  {tNav(key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Contact ── */}
        <div className="md:col-span-2 space-y-4">
          <h3 className="font-semibold text-sm uppercase tracking-widest">
            {t("contact")}
          </h3>

          {/* Chairman */}
          <p className="font-medium leading-snug text-sm">
            {t("chairmanName")}
            <br />
            <span className="font-normal">
              {t("chairmanTitle")}
            </span>
          </p>

          <Separator className="my-3" />

          {/* Contact details */}
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{t("address")}</span>
            </div>

            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 shrink-0" />
              <a
                href="tel:+905551474674"
                className="transition-colors"
              >
                +90 555 147 4674
              </a>
            </div>

            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 shrink-0" />
              <a
                href="mailto:daad.waas2024@gmail.com"
                className="transition-colors"
              >
                daad.waas2024@gmail.com
              </a>
            </div>

            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 shrink-0" />
              <a
                href="https://daab-waas.org"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors underline underline-offset-2"
              >
                daab-waas.org
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <Separator className="mt-10 mb-6" />
      <p className="text-xs text-center md:text-left">
        © {new Date().getFullYear()} {t("copyright")}
      </p>
    </div>
  );
}
