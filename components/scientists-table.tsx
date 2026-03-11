"use client";

import { useTranslations } from "next-intl";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Skeleton } from "./ui/skeleton";
import { Search } from "lucide-react";
import { useAreas, useCoutnries, useScientists } from "@/hooks/use-scientists";
import { Badge } from "./ui/badge";

function ScientistsTableSkeleton() {
  return (
    <div className="flex w-full flex-col gap-2">
      {Array.from({ length: 10 }).map((_, index) => (
        <Skeleton className="h-16" key={index} />
      ))}
    </div>
  );
}

export function ScientistsTable() {
  const t = useTranslations("Scientists");
  const c = useTranslations("countries");
  const a = useTranslations("areas");
  const i = useTranslations("institutions");

  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedArea, setSelectedArea] = useState<string>("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: countries } = useCoutnries();
  const { data: areas } = useAreas();
  const {
    data: scientists,
    isLoading,
    isError,
    error,
  } = useScientists(page, debouncedSearch, selectedCountry, selectedArea);

  const headerClass =
    "bg-muted/70 px-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground first:rounded-tl-2xl last:rounded-tr-2xl";

  const handleCountryChange = (value: string) => {
    setSelectedCountry(value === "all" ? "" : value);
    setPage(1);
  };

  const handleAreaChange = (value: string) => {
    setSelectedArea(value === "all" ? "" : value);
    setPage(1);
  };

  return (
    <>
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t("search.placeholder") || "Search scientists..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex flex-1 items-center gap-2">
            <Select
              value={selectedCountry || "all"}
              onValueChange={handleCountryChange}
            >
              <SelectTrigger className="flex-1 sm:w-50">
                <SelectValue
                  placeholder={t("filter.allCountries") || "All Countries"}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("filter.allCountries") || "All Countries"}
                </SelectItem>
                {countries?.map((country: string) => (
                  <SelectItem key={country} value={country}>
                    {c(country)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-1 items-center gap-2">
            <Select
              value={selectedArea || "all"}
              onValueChange={handleAreaChange}
            >
              <SelectTrigger className="flex-1 sm:w-50">
                <SelectValue
                  placeholder={t("filter.allAreas") || "All Areas"}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("filter.allAreas") || "All Areas"}
                </SelectItem>
                {areas?.map((area: string) => (
                  <SelectItem key={area} value={area}>
                    {a(area)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <ScientistsTableSkeleton />
      ) : (
        <div
          key={`${debouncedSearch}-${selectedCountry}-${selectedArea}-${page}`}
          className="flex flex-col gap-6 animate-in fade-in-50 duration-500"
        >
          <div className="overflow-x-auto rounded-2xl border bg-card shadow-sm">
            <Table className="table-auto">
              <TableHeader className="[&_tr]:bg-muted/40 [&_tr]:backdrop-blur">
                <TableRow className="divide-x divide-border">
                  <TableHead className={cn(headerClass, "w-1/4")}>
                    {t("tableHeaders.fullname")}
                  </TableHead>
                  <TableHead className={cn(headerClass, "w-1/4")}>
                    {t("tableHeaders.institution")}
                  </TableHead>
                  <TableHead className={cn(headerClass, "w-1/4")}>
                    {t("tableHeaders.country")}
                  </TableHead>
                  <TableHead className={cn(headerClass, "w-1/4")}>
                    {t("tableHeaders.areas")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scientists?.items.map((s) => {
                  return (
                    <TableRow key={s.id} className="divide-x divide-border">
                      <TableCell className="px-6">
                        <div className="flex flex-col gap-1">
                          <Link
                            href={`/scientists/${s.id}`}
                            className="text-base font-semibold text-primary transition-colors hover:text-primary/80 hover:underline"
                          >
                            {`${s.firstName} ${s.lastName}`}
                          </Link>
                          <span className="text-xs uppercase tracking-wide text-muted-foreground">
                            {s.academicTitle}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="px-6">
                        <div className="flex flex-wrap gap-2">
                          {s.institutions.map((inst) => {
                            return (
                              <Badge
                                variant="secondary"
                                className="wrap-break-word"
                              >
                                {i(inst)}
                              </Badge>
                            );
                          })}
                        </div>
                      </TableCell>
                      <TableCell className="px-6">
                        <div className="flex flex-wrap gap-2">
                          {s.countries.map((country) => (
                            <Badge variant="secondary">{c(country)}</Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="px-6">
                        <div className="flex flex-wrap gap-2">
                          {s.areas.map((area) => (
                            <Badge variant="secondary">{a(area)}</Badge>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </>
  );
}
