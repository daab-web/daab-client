"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import Link from "next/link"
import { UntranslatedScientistEntry } from "@/types/scientist"

export const scientistColumns: ColumnDef<UntranslatedScientistEntry>[] = [
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
    accessorKey: "scientistId",
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
        href={`scientists/${row.getValue("scientistId")}/edit`}
        className="font-medium text-primary hover:underline"
      >
        {row.getValue("scientistId")}
      </Link>
    ),
  },
  {
    accessorKey: "slug",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Slug
        <ArrowUpDown className="size-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="max-w-125 truncate">
        {row.original.slug}
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
]
