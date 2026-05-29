"use client"

import { fetchUntranslatedNews, publishNews } from "@/lib/api/news";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { newsColumns } from "./news-columns";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Spinner } from "@/components/ui/spinner";
import ErrorDisplay from "@/components/error-display";
import { toast } from "sonner";

export default function NewsTranslationsTable() {
  const queryClient = useQueryClient()

  const { data, isLoading, refetch, isError, error } = useQuery({
    queryKey: ["untranslated-news"],
    queryFn: fetchUntranslatedNews,
  })

  const { mutate: publish, isPending } = useMutation({
    mutationFn: publishNews,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["untranslated-news"] });
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

  return isLoading
    ? <Spinner className="size-8" />
    : <DataTable
      columns={newsColumns}
      data={data!}
      searchKey="title"
      searchPlaceholder="Filter by title..."
      toolbar={(table) => {
        const selectedIds = table
          .getSelectedRowModel()
          .rows.map(r => r.original.newsId);

        return (
          <Button
            disabled={selectedIds.length === 0 || isPending}
            onClick={() => publish({ newsIds: selectedIds })}
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
        );
      }}
    />
}
