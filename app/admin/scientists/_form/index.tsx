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
import TagInput from "./tag-input";
import { useState } from "react";
import { SerializedEditorState } from "lexical";
import { useAreas, useCoutnries, useInstitutions } from "@/hooks/use-scientists";
import { ComboboxMultiple } from "@/components/combobox-multiple";
import { Skeleton } from "@/components/ui/skeleton";

export interface ScientistsEditorProps {
  scientist?: Scientist;
  action: "POST" | "PUT";
}

export default function ScientistsEditor({
  scientist,
  action,
}: ScientistsEditorProps) {
  const form = useScientistForm(scientist);
  const { mutate, isPending } =
    action === "POST"
      ? useScientistCreateMutation()
      : useScientistUpdateMutation(scientist!.id);
  const [editorState, setEditorState] = useState<
    SerializedEditorState | undefined
  >();
  const buttonText = action === "POST" ? "Create" : "Update";
  const processingText = action === "POST" ? "Creating..." : "Updating...";

  const { data: areas, isLoading: areAreasLoading } = useAreas();
  const { data: countries, isLoading: areCountriesLoading } = useCoutnries();
  const { data: institutions, isLoading: areInstitutionsLoading } = useInstitutions();

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
                  initialEditorState={scientist?.description}
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
