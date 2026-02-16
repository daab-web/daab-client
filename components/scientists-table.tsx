"use client";

import { useTranslations } from "next-intl";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
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
import { useQuery } from "@tanstack/react-query";
import { fetchScientists, fetchCountries, fetchAreas } from "@/lib/api";
import { PagedResponse } from "@/types/paged-response";
import { useState, useEffect } from "react";
import { Skeleton } from "./ui/skeleton";
import { Search } from "lucide-react";
import { Scientist } from "@/types/scientist";

function getPageNumbers(current: number, total: number) {
  if (total <= 1) {
    return [1];
  }

  const delta = 1;
  const range: number[] = [];
  const rangeWithDots: (number | "...")[] = [];

  for (
    let i = Math.max(2, current - delta);
    i <= Math.min(total - 1, current + delta);
    i += 1
  ) {
    range.push(i);
  }

  if (current - delta > 2) {
    rangeWithDots.push("...");
  }

  rangeWithDots.push(...range);

  if (current + delta < total - 1) {
    rangeWithDots.push("...");
  }

  return [1, ...rangeWithDots, total].filter((value, index, array) => {
    if (value === "..." && array[index - 1] === "...") {
      return false;
    }
    if (typeof value === "number" && array.indexOf(value) !== index) {
      return false;
    }
    return true;
  });
}

function ScientistsTableSkeleton() {
  return (
    <div className="flex w-full flex-col gap-2">
      {Array.from({ length: 10 }).map((_, index) => (
        <Skeleton className="h-8" key={index} />
      ))}
    </div>
  );
}

export function ScientistsTable() {
  const t = useTranslations("Scientists");
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedArea, setSelectedArea] = useState<string>("");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // Reset to first page when search changes
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch countries
  const { data: countriesData } = useQuery<{ countries: string[] } | string[]>({
    queryKey: ["countries"],
    queryFn: fetchCountries,
  });

  // Fetch areas
  const { data: areasData } = useQuery<{ areas: string[] } | string[]>({
    queryKey: ["areas"],
    queryFn: fetchAreas,
  });

  // Handle different response formats
  const countries = Array.isArray(countriesData)
    ? countriesData
    : countriesData?.countries || [];

  const areas = Array.isArray(areasData) ? areasData : areasData?.areas || [];

  const { data, isLoading, isError, error } = useQuery<
    PagedResponse<Scientist>
  >({
    queryKey: [page, debouncedSearch, selectedCountry, selectedArea],
    queryFn: async () =>
      await fetchScientists(
        page,
        20,
        debouncedSearch || undefined,
        selectedCountry || undefined,
        selectedArea || undefined,
      ),
  });

  const headerClass =
    "bg-muted/70 px-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground first:rounded-tl-2xl last:rounded-tr-2xl";
  const pillClass =
    "rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary";
  const tagClass =
    "rounded-md bg-muted/60 px-2 py-1 text-xs font-medium text-muted-foreground";

  const totalPages = data?.metadata.totalPages ?? 1;
  const pagesToRender = getPageNumbers(page, totalPages);

  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

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
      <div className="flex gap-4">
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
                    {country}
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
                    {area}
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
        <div className="flex flex-col gap-6">
          {/* Search and Filter Controls */}

          <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
            <Table>
              <TableHeader className="[&_tr]:bg-muted/40 [&_tr]:backdrop-blur">
                <TableRow className="divide-x divide-border">
                  <TableHead className={cn(headerClass, "min-w-55")}>
                    {t("tableHeaders.fullname")}
                  </TableHead>
                  <TableHead className={cn(headerClass, "min-w-50")}>
                    {t("tableHeaders.institution")}
                  </TableHead>
                  <TableHead className={cn(headerClass, "min-w-45")}>
                    {t("tableHeaders.country")}
                  </TableHead>
                  <TableHead className={cn(headerClass, "min-w-55")}>
                    {t("tableHeaders.areas")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.items.map((s) => {
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
                        <p className="text-sm text-muted-foreground">
                          {s.institution}
                        </p>
                      </TableCell>
                      <TableCell className="px-6">
                        <div className="flex flex-wrap gap-2">
                          {s.countries.map((country) => (
                            <span key={country} className={pillClass}>
                              {country}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="px-6">
                        <div className="flex flex-wrap gap-2">
                          {s.areas.map((area) => (
                            <span key={area} className={tagClass}>
                              {area}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
              <TableCaption>
                {t("pagination.page", {
                  page: data?.metadata.currentPage!,
                  total: data?.metadata.totalPages!,
                })}
              </TableCaption>
            </Table>
          </div>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => goToPage(page - 1)}
                  className={cn(
                    !data?.metadata.hasPreviousPage &&
                      "pointer-events-none opacity-50",
                  )}
                />
              </PaginationItem>

              {pagesToRender.map((value, index) => (
                <PaginationItem key={`${value}-${index}`}>
                  {value === "..." ? (
                    <PaginationEllipsis className="text-muted-foreground" />
                  ) : (
                    <PaginationLink
                      isActive={value === page}
                      onClick={() => goToPage(value)}
                    >
                      {value}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => goToPage(page + 1)}
                  className={cn(
                    !data?.metadata.hasNextPage && "pointer-events-none opacity-50",
                  )}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </>
  );
}
