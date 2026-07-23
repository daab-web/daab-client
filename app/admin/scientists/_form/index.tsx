"use client";

import { Scientist } from "@/types/scientist";
import {
  useScientistCreateMutation,
  useScientistForm,
  useScientistUpdateMutation,
} from "./hooks";
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
import { useRef, useState } from "react";
import { EditorState, SerializedEditorState } from "lexical";
import { ComboboxMultiple } from "@/components/combobox-multiple";
import { Skeleton } from "@/components/ui/skeleton";
import { getTranslationNames } from "@/lib/api/translations";
import { useQuery } from "@tanstack/react-query";
import { ButtonGroup } from "@/components/ui/button-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchScientistById } from "@/lib/api/scientists";
import dynamic from "next/dynamic";
import { TranslateDraftPanel } from "@/components/translate-draft-panel";
import { ApproveTranslationDialog } from "@/components/approve-translation-dialog";
import { ContentType } from "@/types/translation-memory";

const Editor = dynamic(
  () => import("@/components/editor").then((m) => ({ default: m.Editor })),
  { ssr: false }
);

interface LocaleDraft {
  firstName: string;
  lastName: string;
  description: SerializedEditorState | undefined;
}

export interface ScientistsEditorProps {
  scientist?: Scientist;
  action: "POST" | "PUT";
}

export default function ScientistsEditor({
  scientist,
  action,
}: ScientistsEditorProps) {
  const form = useScientistForm(scientist);
  const [editorState, setEditorState] = useState<
    SerializedEditorState | undefined
  >(scientist?.description);
  const buttonText = action === "POST" ? "Create" : "Update";
  const processingText = action === "POST" ? "Creating..." : "Updating...";
  const [locale, setLocale] = useState<"en" | "az">("en");
  const [localeDrafts, setLocaleDrafts] = useState<
    Partial<Record<"en" | "az", LocaleDraft>>
  >(() =>
    action === "PUT" && scientist
      ? {
          en: {
            firstName: scientist.firstName,
            lastName: scientist.lastName,
            description: scientist.description,
          },
        }
      : {},
  );
  const [editorKey, setEditorKey] = useState(0)
  const editorStateRef = useRef<EditorState | undefined>(undefined);
  const createMutation = useScientistCreateMutation(locale);
  const updateMutation = useScientistUpdateMutation(scientist?.id ?? "");
  const { mutate, isPending } =
    action === "POST" ? createMutation : updateMutation;

  const { data: areas, isLoading: areAreasLoading } = useQuery({
    queryKey: ["translation-names", "areas"],
    queryFn: () => getTranslationNames("areas").then((n) => n.map((e) => e.key)),
  });
  const { data: countries, isLoading: areCountriesLoading } = useQuery({
    queryKey: ["translation-names", "countries"],
    queryFn: () => getTranslationNames("countries").then((n) => n.map((e) => e.key)),
  });
  const { data: institutions, isLoading: areInstitutionsLoading } = useQuery({
    queryKey: ["translation-names", "institutions"],
    queryFn: () => getTranslationNames("institutions").then((n) => n.map((e) => e.key)),
  });

  const loadLocaleDraft = (draft: LocaleDraft | undefined) => {
    form.setValue("firstName", draft?.firstName ?? "");
    form.setValue("lastName", draft?.lastName ?? "");
    setEditorState(draft?.description);
    editorStateRef.current = undefined;
    setEditorKey((k) => k + 1);
  };

  const applyTranslatedDescription = (
    state: SerializedEditorState,
    targetLocale: string,
  ) => {
    if (targetLocale === locale) {
      setEditorState(state);
      editorStateRef.current = undefined;
      setEditorKey((k) => k + 1);
    } else {
      setLocaleDrafts((prev) => ({
        ...prev,
        [targetLocale]: {
          firstName: prev[targetLocale as "en" | "az"]?.firstName ?? "",
          lastName: prev[targetLocale as "en" | "az"]?.lastName ?? "",
          description: state,
        },
      }));
    }
  };

  const handleLocaleChange = (value: string) => {
    const next = value as "en" | "az";
    if (next === locale) return;

    const currentDraft: LocaleDraft = {
      firstName: form.getValues("firstName"),
      lastName: form.getValues("lastName"),
      description: editorStateRef.current?.toJSON() ?? editorState,
    };
    setLocaleDrafts((prev) => ({ ...prev, [locale]: currentDraft }));

    const cached = localeDrafts[next];
    if (cached) {
      loadLocaleDraft(cached);
    } else if (action === "PUT" && scientist) {
      loadLocaleDraft(undefined);
      fetchScientistById(scientist.id, next).then((data) => {
        const draft: LocaleDraft = {
          firstName: data.firstName,
          lastName: data.lastName,
          description: data.description,
        };
        setLocaleDrafts((prev) => ({ ...prev, [next]: draft }));
        loadLocaleDraft(draft);
      });
    } else {
      loadLocaleDraft(undefined);
    }

    setLocale(next);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          const translations: Record<string, LocaleDraft> = {
            ...localeDrafts,
            [locale]: {
              firstName: data.firstName,
              lastName: data.lastName,
              description: editorStateRef.current?.toJSON() ?? editorState,
            },
          };

          mutate({ data, translations });
        })}
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
              <TranslateDraftPanel
                contentType={ContentType.Scientist}
                sourceLocale={locale}
                getSourceStateJson={() => {
                  const state = editorStateRef.current?.toJSON() ?? editorState;
                  return state ? JSON.stringify(state) : undefined;
                }}
                onApply={applyTranslatedDescription}
                disabled={isPending}
              />
              <FormControl>
                <Editor
                  key={editorKey}
                  editorSerializedState={editorState}
                  onChange={(state) => {
                    editorStateRef.current = state;
                  }}
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
            name="orcid"
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
            <Select value={locale} onValueChange={handleLocaleChange}>
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
          <ApproveTranslationDialog
            contentType={ContentType.Scientist}
            getLocaleEditorStateJson={(loc) => {
              if (loc === locale) {
                const state = editorStateRef.current?.toJSON() ?? editorState;
                return state ? JSON.stringify(state) : undefined;
              }
              const draft = localeDrafts[loc as "en" | "az"];
              return draft?.description ? JSON.stringify(draft.description) : undefined;
            }}
            disabled={isPending}
          />
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
