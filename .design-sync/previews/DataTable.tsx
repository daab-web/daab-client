import { DataTable, Badge } from "daab-client";

type Payment = {
  id: string;
  customer: string;
  email: string;
  status: "success" | "pending" | "failed";
  amount: string;
};

const data: Payment[] = [
  { id: "1", customer: "Ada Lovelace", email: "ada@example.com", status: "success", amount: "$250.00" },
  { id: "2", customer: "Alan Turing", email: "alan@example.com", status: "pending", amount: "$150.00" },
  { id: "3", customer: "Grace Hopper", email: "grace@example.com", status: "success", amount: "$350.00" },
  { id: "4", customer: "Linus Torvalds", email: "linus@example.com", status: "failed", amount: "$90.00" },
];

const columns = [
  { accessorKey: "customer", header: "Customer" },
  { accessorKey: "email", header: "Email" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }: { row: { original: Payment } }) => (
      <Badge variant={row.original.status === "failed" ? "destructive" : "secondary"}>
        {row.original.status}
      </Badge>
    ),
  },
  { accessorKey: "amount", header: "Amount" },
];

export function Default() {
  return (
    <div className="w-[40rem]">
      <DataTable columns={columns} data={data} searchKey="email" searchPlaceholder="Filter emails…" />
    </div>
  );
}
