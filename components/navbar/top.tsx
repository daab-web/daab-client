import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { LanguageSwitcher } from "../language-switcher";
import { ModeToggle } from "../mode-toggle";
import Link from "next/link";
import { MobileMenu } from "./mobile-menu";

export async function LogoSection() {
  const t = await getTranslations("Global");

  return (
    <Link
      href="/"
      className="flex items-center gap-2 text-[#274380] dark:text-[#C9D6F0] font-bold shrink-0"
    >
      <Image src="/daab-logo.png" alt="logo" width={80} height={80} />
      <h1 className="hidden lg:block whitespace-nowrap">{t("title")}</h1>
    </Link>
  );
}

export function ControlsSection() {
  return (
    <div className="flex items-center gap-2 shrink-0">
      <ModeToggle />
      <LanguageSwitcher />
      <MobileMenu />
    </div>
  );
}

export async function TopNavigation() {
  const t = await getTranslations("Global");

  return (
    <div className="flex items-center gap-8">
      <Link
        href="/"
        className="flex items-center gap-2 text-[#274380] dark:text-[#C9D6F0] font-bold shrink-0"
      >
        <Image src="/daab-logo.png" alt="logo" width={80} height={80} />
        <h1 className="hidden lg:block whitespace-nowrap">{t("title")}</h1>
      </Link>
      <div className="flex items-center gap-2 shrink-0">
        <ModeToggle />
        <LanguageSwitcher />
        <MobileMenu />
      </div>
    </div>
  );
}
