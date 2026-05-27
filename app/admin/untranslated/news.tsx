"use client"

import { fetchUntranslatedNews, publishNews } from "@/lib/api/news";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { newsColumns } from "./news-columns";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@/components/ui/spinner";

export default function NewsTranslationsTable() {
  const { data, isLoading } = useQuery({
    queryKey: ["untranslated-news"],
    queryFn: fetchUntranslatedNews,
  })

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
            disabled={selectedIds.length <= 0}
            onClick={() => publishNews({ newsIds: selectedIds })}
          >
            Publish selected
          </Button>
        );
      }}
    />
}
