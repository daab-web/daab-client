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
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { fetchScientists } from "@/lib/api";
import { PagedResponse } from "@/types/paged-response";
import { useState } from "react";

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

export type Scientist = {
  id: string;
  userId: string;
  slug: string;
  firstName: string;
  lastName: string;
  academicTitle: string;
  description?: string;
  institution: string;
  countries: string[];
  areas: string[];
};

export function ScientistsTable() {
  const t = useTranslations("Scientists");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error } = useQuery<
    PagedResponse<Scientist>
  >({
    queryKey: [page],
    queryFn: async () => await fetchScientists(page),
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

  return isLoading ? (<div>Some</div>) : (
    <div className="flex flex-col gap-6">
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
            {t("pagination.page", { page: data?.metadata.currentPage!, total: data?.metadata.totalPages! })}
          </TableCaption>
        </Table>
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => goToPage(page - 1)}
              className={cn(!data?.metadata.hasPrevious && "pointer-events-none opacity-50")}
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
              className={cn(!data?.metadata.hasNext && "pointer-events-none opacity-50")}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
