"use client";

import { Scientist } from "@/types/scientist";
import {
  useScientistCreateMutation,
  useScientistForm,
  useScientistUpdateMutation,
} from "./hooks";
import NewsEditor from "@/components/news-editor";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import router from "next/router";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { SerializedEditorState } from "lexical";
import { ComboboxMultiple } from "@/components/combobox-multiple";
import { Skeleton } from "@/components/ui/skeleton";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { ButtonGroup } from "@/components/ui/button-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchScientistById } from "@/lib/api/scientists";

export interface ScientistsEditorProps {
  scientist?: Scientist;
  action: "POST" | "PUT";
}

export default function ScientistsEditor({
  scientist,
  action,
}: ScientistsEditorProps) {
  const trpc = useTRPC();
  const form = useScientistForm(scientist);
  const [editorState, setEditorState] = useState<
    SerializedEditorState | undefined
  >(scientist?.description);
  const buttonText = action === "POST" ? "Create" : "Update";
  const processingText = action === "POST" ? "Creating..." : "Updating...";
  const [locale, setLocale] = useState<"en" | "az">("en");
  const [editorKey, setEditorKey] = useState(locale)
  const { mutate, isPending } =
    action === "POST"
      ? useScientistCreateMutation(locale)
      : useScientistUpdateMutation(scientist!.id, locale);

  const { data: areas, isLoading: areAreasLoading } = useQuery(
    trpc.areas.queryOptions({}),
  );
  const { data: countries, isLoading: areCountriesLoading } = useQuery(
    trpc.countries.queryOptions({}),
  );
  const { data: institutions, isLoading: areInstitutionsLoading } = useQuery(
    trpc.institutions.queryOptions({ locale: "en" }),
  );

  useEffect(() => {
    if (action !== "PUT" || !scientist) return;

    const loadLocaleData = async () => {
      const data = await fetchScientistById(scientist.id, locale);
      setEditorState(data.description);
      form.setValue("firstName", data.firstName)
      form.setValue("lastName", data.lastName)
      setEditorKey(locale)
    };

    loadLocaleData();
  }, [locale]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) =>
          mutate({
            ...data,
            description: editorState,
          }),
        )}
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
                {areInstitutionsLoading ? (
                  <Skeleton className="h-8" />
                ) : (
                  <ComboboxMultiple
                    items={institutions!}
                    onChange={field.onChange}
                    value={field.value}
                  />
                )}
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
                {areCountriesLoading ? (
                  <Skeleton className="h-8" />
                ) : (
                  <ComboboxMultiple
                    items={countries!}
                    onChange={field.onChange}
                    value={field.value}
                  />
                )}
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
                {areAreasLoading ? (
                  <Skeleton className="h-8" />
                ) : (
                  <ComboboxMultiple
                    items={areas!}
                    onChange={field.onChange}
                    value={field.value}
                  />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={() => (
            <FormItem>
              <FormLabel>Description (optional)</FormLabel>
              <FormControl>
                <NewsEditor
                  key={editorKey}
                  initialEditorState={editorState}
                  onContentChange={(state) => setEditorState(state)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email (optional)</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="email@example.com"
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
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number (optional)</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="+1234567890"
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
          name="linkedInUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>LinkedIn URL (optional)</FormLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder="https://linkedin.com/in/..."
                  disabled={isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="orcId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ORCID (optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="0000-0000-0000-0000"
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
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website (optional)</FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    placeholder="https://example.com"
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
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of Birth (optional)</FormLabel>
              <FormControl>
                <Input type="date" disabled={isPending} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2 pt-4">
          <ButtonGroup>
            <Select defaultValue={locale} onValueChange={v => setLocale(v as "en" | "az")}>
              <SelectTrigger>
                <SelectValue placeholder="Select locale" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">EN</SelectItem>
                <SelectItem value="az">AZ</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Spinner data-icon="inline-start" />
                  {processingText}
                </>
              ) : (
                buttonText
              )}
            </Button>
          </ButtonGroup>
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
  );
}
