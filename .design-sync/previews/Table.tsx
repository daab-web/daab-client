import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
  Badge,
} from "daab-client";

const invoices = [
  { id: "INV-001", status: "Paid", method: "Card", amount: "$250.00" },
  { id: "INV-002", status: "Pending", method: "Transfer", amount: "$150.00" },
  { id: "INV-003", status: "Paid", method: "Card", amount: "$350.00" },
];

export function Default() {
  return (
    <div className="w-[28rem]">
      <Table>
        <TableCaption>Recent invoices</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((i) => (
            <TableRow key={i.id}>
              <TableCell className="font-medium">{i.id}</TableCell>
              <TableCell>
                <Badge variant={i.status === "Paid" ? "default" : "secondary"}>
                  {i.status}
                </Badge>
              </TableCell>
              <TableCell>{i.method}</TableCell>
              <TableCell className="text-right">{i.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
