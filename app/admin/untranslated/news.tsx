import { fetchUntranslatedNews } from "@/lib/api/news";
import { DataTable } from "@/components/ui/data-table";
import { newsColumns } from "./news-columns";

export default async function NewsTranslationsTable() {
  const data = await fetchUntranslatedNews();

  return (
    <DataTable
      columns={newsColumns}
      data={data}
      searchKey="title"
      searchPlaceholder="Filter by title..."
    />
  );
}
