"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { type UntranslateNewsEntry } from "@/types/news";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import Link from "next/link";

export const newsColumns: ColumnDef<UntranslateNewsEntry>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "newsId",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Id
        <ArrowUpDown className="size-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <Link
        href={`news/editor?editId=${row.getValue("newsId")}`}
        className="font-medium text-primary hover:underline"
      >
        {row.getValue("newsId")}
      </Link>
    ),
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Title
        <ArrowUpDown className="size-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="max-w-125 truncate">
        {row.getValue("title")}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Status
        <ArrowUpDown className="size-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div>{row.getValue("status")}</div>
    ),
  },
  {
    accessorKey: "missingLocales",
    header: () => <div className="text-right">Missing locales</div>,
    cell: ({ row }) => {
      const locales = row.getValue("missingLocales") as string[];
      return <div className="text-right">{locales.join(", ")}</div>;
    },
    filterFn: (row, id, value: string) => {
      const locales = row.getValue(id) as string[];
      return locales.some((l) =>
        l.toLowerCase().includes(value.toLowerCase())
      );
    },
  },
];
