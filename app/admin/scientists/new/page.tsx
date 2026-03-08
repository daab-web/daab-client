"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { ArrowLeft } from "lucide-react";
import TagInput from "./tag-input";
import { ScientistFormData, scientistSchema } from "./types";
import { useScientistMutation } from "./hooks";

export default function AddScientistPage() {
  const router = useRouter();

  const form = useForm<ScientistFormData>({
    resolver: zodResolver(scientistSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      academicTitle: "",
      description: "",
      slug: "",
      institutions: [],
      countries: [],
      areas: [],
    },
  });

  const { mutate, isPending } = useScientistMutation();

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
        <h1 className="text-3xl font-bold tracking-tight">Add Scientist</h1>
      </div>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Scientist Data</CardTitle>
          <CardDescription>Create a new scientist</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((data) => mutate(data))}
              className="space-y-4"
            >
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
                          disabled={isPending}
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
                          disabled={isPending}
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
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="institutions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Institutions</FormLabel>
                    <FormControl>
                      <TagInput
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Type and press Enter"
                        disabled={isPending}
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
                        disabled={isPending}
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
                        disabled={isPending}
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
                        disabled={isPending}
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
                        disabled={isPending}
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Spinner data-icon="inline-start" />
                      Creating...
                    </>
                  ) : (
                    "Create"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/admin/scientists")}
                  disabled={isPending}
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
