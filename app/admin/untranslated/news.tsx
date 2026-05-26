import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { fetchUntranslatedNews } from "@/lib/api/news";
import Link from "next/link";

export default async function NewsTranslationsTable() {
  const data = await fetchUntranslatedNews();

  return (
    <Table>
      <TableCaption>List of untranslated news entires</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-25">Id</TableHead>
          <TableHead>Locale</TableHead>
          <TableHead>Title</TableHead>
          <TableHead className="text-right">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map(r => (
          <TableRow key={r.newsId}>
            <TableCell>
              <Link href={`news/editor?editId=${r.newsId}`} className="contents">
                {r.newsId}
              </Link>
            </TableCell>
            <TableCell>{r.missingLocales.join(', ')}</TableCell>
            <TableCell>{r.title}</TableCell>
            <TableCell className="text-right">Untranslated</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
