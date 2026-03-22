import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { fetchScientistById } from "@/lib/api/scientists";
import Link from "next/link";
import ScientistsEditor from "../../_form";
import ScientistProfilePicture from "../../_profile-pic";

export default async function EditScientistPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // const { fields, append, remove } = useFieldArray({
  //   control: form.control,
  //   name: "publications",
  // });

  const { id } = await params;
  const scientist = await fetchScientistById(id);

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/scientists">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Edit Scientist</h1>
      </div>

      <div className="flex items-start justify-self-center gap-4">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Scientist Data</CardTitle>
            <CardDescription>Update scientist information</CardDescription>
          </CardHeader>
          <CardContent>
            <ScientistsEditor scientist={scientist} action="PUT" />
          </CardContent>
        </Card>
        <ScientistProfilePicture scientist={scientist} />
      </div>
    </div>
  );
}
