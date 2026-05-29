"use client"

import { DataTable } from "@/components/ui/data-table";
import { fetchUntranslatedScientists, publishScientist } from "@/lib/api/scientists";
import { scientistColumns } from "./scientist-columns";
import { Button } from "@/components/ui/button";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Spinner } from "@/components/ui/spinner";
import ErrorDisplay from "@/components/error-display";
import { toast } from "sonner";

export default function ScientistsTranslationsTable() {
  const queryClient = useQueryClient()

  const { data, isLoading, refetch, isError, error } = useQuery({
    queryKey: ["untranslated-scientists"],
    queryFn: fetchUntranslatedScientists
  })

  const { mutate: publish, isPending } = useMutation({
    mutationFn: publishScientist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["untranslated-scientists"] });
      toast.success("Successfuly published")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  });

  if (isLoading) {
    return (<Spinner className="size-8" />)
  }

  if (isError) {
    return (
      <ErrorDisplay
        title={error.message}
        showBackButton={false}
        showHomeButton={false}
        customActions={(<Button onClick={() => refetch()}>Refetch</Button>)}
      />
    )
  }

  return (
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
          <Button
            disabled={selectedIds.length === 0 || isPending}
            onClick={() => publish({ scientistIds: selectedIds })}
          >
            {isPending
              ? (
                <>
                  <Spinner data-icon="inline-start" />
                  Processing
                </>
              )
              : "Publish selected"}
          </Button>
        )
      }}
    />
  )
}
