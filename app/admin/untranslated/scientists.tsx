"use client"

import { DataTable } from "@/components/ui/data-table";
import { fetchUntranslatedScientists, publishScientist } from "@/lib/api/scientists";
import { scientistColumns } from "./scientist-columns";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@/components/ui/spinner";

export default function ScientistsTranslationsTable() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["untranslated-scientists"],
    queryFn: fetchUntranslatedScientists
  })

  const handlePublish = (ids: string[]) => {
    publishScientist({ scientistIds: ids })
    refetch();
  }

  return isLoading ? (<Spinner className="size-8" />) :
    <DataTable
      columns={scientistColumns}
      data={data!}
      searchKey="slug"
      searchPlaceholder="Filter by slug"
      toolbar={(table) => {
        const selectedIds = table
          .getSelectedRowModel()
          .rows.map(r => r.original.scientistId);

        return (
          <Button disabled={selectedIds.length <= 0} onClick={() => handlePublish(selectedIds)}>
            Publish selected
          </Button>
        )
      }}
    />
}
