import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { fetchUntranslatedScientists } from "@/lib/api/scientists";
import Link from "next/link";

export default async function ScientistsTranslationsTable() {
  const data = await fetchUntranslatedScientists();

  return (
    <Table>
      <TableCaption>List of untranslated scientists entires</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-25">Id</TableHead>
          <TableHead>Locale</TableHead>
          <TableHead>Name</TableHead>
          <TableHead className="text-right">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map(r => (
          <TableRow key={r.scientistId}>
            <TableCell>
              <Link href={`scientists/${r.scientistId}/edit`} className="contents">
                {r.scientistId}
              </Link>
            </TableCell>
            <TableCell>{r.missingLocales}</TableCell>
            <TableCell>name</TableCell>
            <TableCell className="text-right">Untranslated</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
