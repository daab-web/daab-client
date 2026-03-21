import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ScientistsEditor from "../_form";

export default async function AddScientistPage() {
  // const { fields, append, remove } = useFieldArray({
  //   control: form.control,
  //   name: "publications",
  // });

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/scientists">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Add Scientist</h1>
      </div>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Scientist Data</CardTitle>
          <CardDescription>Create a new scientist</CardDescription>
        </CardHeader>
        <CardContent>
          <ScientistsEditor action="POST" />
        </CardContent>
      </Card>
    </div>
  );
}
