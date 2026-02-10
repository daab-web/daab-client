"use client"

import * as React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRouter, usePathname } from "@/i18n/navigation";
import { useLocale } from "next-intl"
import { Skeleton } from "@/components/ui/skeleton"

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const handleLanguageChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  if (!mounted) {
    return <Skeleton className="h-9 w-20" />
  }

  return (
    <Select value={locale} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-20">
        <SelectValue placeholder={locale.toUpperCase()} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="az">AZ</SelectItem>
        <SelectItem value="en">EN</SelectItem>
      </SelectContent>
    </Select>
  )
}
