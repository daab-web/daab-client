"use client"

import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Spinner } from "@/components/ui/spinner";
import ErrorDisplay from "@/components/error-display";
import { fetchUntranslatedDirectors, publishDirector } from "@/lib/api/directors";
import { directorColumns } from "./director-columns";
import { toast } from "sonner";

export default function DirectorsTranslationsTable() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["untranslated-directors"],
    queryFn: fetchUntranslatedDirectors,
  });

  const { mutate: publish, isPending } = useMutation({
    mutationFn: publishDirector,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["untranslated-directors"] });
      toast.success("Successfuly published")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  });

  if (isLoading) return <Spinner className="size-8" />;

  if (isError) return (
    <ErrorDisplay
      title={error.message}
      showBackButton={false}
      showHomeButton={false}
      customActions={<Button onClick={() => refetch()}>Refetch</Button>}
    />
  );

  return (
    <DataTable
      columns={directorColumns}
      data={data!}
      searchKey="slug"
      searchPlaceholder="Filter by slug..."
      toolbar={(table) => {
        const selectedIds = table
          .getSelectedRowModel()
          .rows.map(r => r.original.directorId);

        return (
          <Button
            disabled={selectedIds.length === 0 || isPending}
            onClick={() => publish({ directorIds: selectedIds })}
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
  );
}
