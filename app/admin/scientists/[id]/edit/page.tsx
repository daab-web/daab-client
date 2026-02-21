"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, X } from "lucide-react";
import { Scientist } from "@/types/scientist";

// Mock data for testing - synced with list page
const MOCK_SCIENTISTS: Scientist[] = [
  {
    id: "1",
    userId: "user1",
    slug: "john-smith",
    firstName: "John",
    lastName: "Smith",
    academicTitle: "Professor",
    description:
      "Renowned physicist specializing in quantum mechanics and particle physics. Published over 100 papers in leading journals.",
    institution: "MIT",
    countries: ["USA", "UK"],
    areas: ["Physics", "Quantum Mechanics"],
  },
  {
    id: "2",
    userId: "user2",
    slug: "maria-garcia",
    firstName: "Maria",
    lastName: "Garcia",
    academicTitle: "Dr.",
    description:
      "Leading research in artificial intelligence and machine learning applications in healthcare.",
    institution: "Stanford University",
    countries: ["USA", "Spain"],
    areas: ["Computer Science", "AI", "Healthcare"],
  },
  {
    id: "3",
    userId: "user3",
    slug: "ahmed-hassan",
    firstName: "Ahmed",
    lastName: "Hassan",
    academicTitle: "Associate Professor",
    description:
      "Expert in renewable energy systems and sustainable development.",
    institution: "Cairo University",
    countries: ["Egypt", "Germany"],
    areas: ["Engineering", "Renewable Energy", "Sustainability"],
  },
  {
    id: "4",
    userId: "user4",
    slug: "yuki-tanaka",
    firstName: "Yuki",
    lastName: "Tanaka",
    academicTitle: "Professor",
    institution: "Tokyo University",
    countries: ["Japan", "USA"],
    areas: ["Biotechnology", "Genetics"],
  },
  {
    id: "5",
    userId: "user5",
    slug: "sarah-johnson",
    firstName: "Sarah",
    lastName: "Johnson",
    academicTitle: "Dr.",
    description:
      "Pioneering research in climate change and environmental policy.",
    institution: "Oxford University",
    countries: ["UK", "Canada"],
    areas: ["Environmental Science", "Climate Change", "Policy"],
  },
];

const scientistSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  academicTitle: z.string().min(1, "Academic title is required"),
  institution: z.string().min(1, "Institution is required"),
  description: z.string().optional(),
  slug: z.string().min(1, "Slug is required"),
  countries: z.array(z.string()).min(1, "At least one country is required"),
  areas: z.array(z.string()).min(1, "At least one research area is required"),
});

type ScientistFormData = z.infer<typeof scientistSchema>;

interface TagInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

function TagInput({ value, onChange, placeholder, disabled }: TagInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      removeTag(value.length - 1);
    }
  };

  const addTag = () => {
    const trimmedValue = inputValue.trim().replace(/,$/, "");
    if (trimmedValue && !value.includes(trimmedValue)) {
      onChange([...value, trimmedValue]);
      setInputValue("");
    }
  };

  const removeTag = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="flex min-h-10 w-full flex-wrap items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
      {value.map((tag, index) => (
        <Badge
          key={index}
          variant="secondary"
          className="gap-1 pr-1.5 font-normal"
        >
          <span>{tag}</span>
          <button
            type="button"
            className="ml-1 rounded-full outline-none hover:bg-muted"
            onClick={() => removeTag(index)}
            disabled={disabled}
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addTag}
        placeholder={value.length === 0 ? placeholder : ""}
        disabled={disabled}
        className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 min-w-30"
      />
    </div>
  );
}

export default function EditScientistPage() {
  const router = useRouter();
  const params = useParams();
  const scientistId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const form = useForm<ScientistFormData>({
    resolver: zodResolver(scientistSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      academicTitle: "",
      institution: "",
      description: "",
      slug: "",
      countries: [],
      areas: [],
    },
  });

  useEffect(() => {
    fetchScientist();
  }, [scientistId]);

  const fetchScientist = async () => {
    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      const data = MOCK_SCIENTISTS.find((s) => s.id === scientistId);

      if (!data) {
        setError("Scientist not found");
        setIsLoading(false);
        return;
      }

      form.reset({
        firstName: data.firstName,
        lastName: data.lastName,
        academicTitle: data.academicTitle,
        institution: data.institution,
        description: data.description || "",
        slug: data.slug,
        countries: data.countries,
        areas: data.areas,
      });
      setIsLoading(false);
    }, 500);
  };

  const onSubmit = async (values: ScientistFormData) => {
    setError(null);
    setSuccess(null);
    setIsSaving(true);

    setTimeout(() => {
      console.log("Mock update:", values);
      setSuccess("Scientist updated successfully!");
      setIsSaving(false);

      setTimeout(() => {
        router.push("/admin/scientists");
      }, 1500);
    }, 500);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Spinner />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/admin/scientists")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Edit Scientist</h1>
      </div>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Scientist Data</CardTitle>
          <CardDescription>Update scientist information</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="mb-4 border-green-500 text-green-700 dark:text-green-400">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="First Name"
                          disabled={isSaving}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Last Name"
                          disabled={isSaving}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="academicTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Academic Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Prof., Dr., etc."
                        disabled={isSaving}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="institution"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Institution</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Institution name"
                        disabled={isSaving}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug (URL)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="john-doe"
                        disabled={isSaving}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="countries"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Countries</FormLabel>
                    <FormControl>
                      <TagInput
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Type and press Enter"
                        disabled={isSaving}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="areas"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Research Areas</FormLabel>
                    <FormControl>
                      <TagInput
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Type and press Enter"
                        disabled={isSaving}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief description..."
                        disabled={isSaving}
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Spinner data-icon="inline-start" />
                      Saving...
                    </>
                  ) : (
                    "Save"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/admin/scientists")}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
