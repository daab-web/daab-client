import { DataTable } from "@/components/ui/data-table";
import { fetchUntranslatedScientists } from "@/lib/api/scientists";
import { scientistColumns } from "./scientist-columns";

export default async function ScientistsTranslationsTable() {
  const data = await fetchUntranslatedScientists();

  return (
    <DataTable
      columns={scientistColumns}
      data={data}
      searchKey="slug"
      searchPlaceholder="Filter by slug"
    />
  );
}
