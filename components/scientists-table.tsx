"use client";

import * as React from "react";
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
import { SCIENTISTS } from "@/lib/scientists";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 10;

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

export function ScientistsTable() {
  const t = useTranslations("Scientists");
  const [page, setPage] = React.useState(1);

  const totalPages = Math.max(1, Math.ceil(SCIENTISTS.length / PAGE_SIZE));
  const firstItemIndex = (page - 1) * PAGE_SIZE;
  const pageData = React.useMemo(
    () => SCIENTISTS.slice(firstItemIndex, firstItemIndex + PAGE_SIZE),
    [firstItemIndex],
  );

  React.useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const goToPage = React.useCallback(
    (nextPage: number) => {
      setPage(Math.min(Math.max(nextPage, 1), totalPages));
    },
    [totalPages],
  );

  const pagesToRender = React.useMemo(
    () => getPageNumbers(page, totalPages),
    [page, totalPages],
  );

  const headerClass =
    "bg-muted/70 px-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground first:rounded-tl-2xl last:rounded-tr-2xl";
  const pillClass =
    "rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary";
  const tagClass =
    "rounded-md bg-muted/60 px-2 py-1 text-xs font-medium text-muted-foreground";

  return (
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
            {pageData.map((scientist) => {
              return (
                <TableRow key={scientist.id} className="divide-x divide-border">
                  <TableCell className="px-6">
                    <div className="flex flex-col gap-1">
                      <Link
                        href={`/scientists/${scientist.id}`}
                        className="text-base font-semibold text-primary transition-colors hover:text-primary/80 hover:underline"
                      >
                        {scientist.fullName}
                      </Link>
                      <span className="text-xs uppercase tracking-wide text-muted-foreground">
                        {scientist.academicTitle}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6">
                    <p className="text-sm text-muted-foreground">
                      {scientist.institution}
                    </p>
                  </TableCell>
                  <TableCell className="px-6">
                    <div className="flex flex-wrap gap-2">
                      {scientist.countries.map((country) => (
                        <span key={country} className={pillClass}>
                          {country}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="px-6">
                    <div className="flex flex-wrap gap-2">
                      {scientist.areas.map((area) => (
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
            {t("pagination.page", { page, total: totalPages })}
          </TableCaption>
        </Table>
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => goToPage(page - 1)}
              disabled={page === 1}
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
              disabled={page === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
