"use client";

import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const translationFormSchema = z.object({
  nameEn: z.string().trim().min(1, "English name is required"),
  translations: z.array(
    z.object({
      locale: z.string().trim().min(1, "Locale is required").max(3, "Max 3 characters"),
      name: z.string().trim().min(1, "Translated name is required"),
    }),
  ),
});

type TranslationFormValues = z.infer<typeof translationFormSchema>;
type TranslationNamespace = "areas" | "countries" | "institutions";

type TranslationRecord = {
  nameEn: string;
  translations: { locale: string; name: string }[];
};

type TranslationSectionConfig = {
  title: string;
  description: string;
  endpoint: string;
  namespace: TranslationNamespace;
};

type TranslationFormCardProps = TranslationSectionConfig;
type TranslationManagementTabProps = TranslationSectionConfig & {
  isActive: boolean;
};

const defaultTranslation = { locale: "", name: "" };

const translationSections: TranslationSectionConfig[] = [
  {
    title: "Areas",
    description: "Create localized research area names for the public site and admin tools.",
    endpoint: "/api/areas",
    namespace: "areas",
  },
  {
    title: "Countries",
    description: "Create localized country names with an English default and per-locale labels.",
    endpoint: "/api/countries",
    namespace: "countries",
  },
  {
    title: "Institutions",
    description:
      "Create localized institution names so scientist entries can stay consistent across locales.",
    endpoint: "/api/institutions",
    namespace: "institutions",
  },
];

function getDefaultFormValues(): TranslationFormValues {
  return {
    nameEn: "",
    translations: [{ ...defaultTranslation }],
  };
}

async function parseResponse(response: Response) {
  return (await response.json().catch(() => null)) as
    | Record<string, unknown>
    | { title?: string }
    | null;
}

function getNamespaceValues(
  data: Record<string, unknown> | null,
  namespace: TranslationNamespace,
) {
  if (!data) {
    return [];
  }

  const nestedNamespace = data[namespace];
  if (nestedNamespace && typeof nestedNamespace === "object") {
    return Object.values(nestedNamespace as Record<string, unknown>).filter(
      (value): value is string => typeof value === "string" && value.trim().length > 0,
    );
  }

  const prefix = `${namespace}.`;
  return Object.entries(data)
    .filter(([key, value]) => key.startsWith(prefix) && typeof value === "string")
    .map(([, value]) => value as string)
    .filter((value) => value.trim().length > 0);
}

function TranslationFormCard({
  title,
  description,
  endpoint,
  namespace,
  isActive,
}: TranslationManagementTabProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isListLoading, setIsListLoading] = useState(true);
  const [entries, setEntries] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingName, setEditingName] = useState<string | null>(null);
  const [loadingEntryName, setLoadingEntryName] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deletingName, setDeletingName] = useState<string | null>(null);
  const form = useForm<TranslationFormValues>({
    resolver: zodResolver(translationFormSchema),
    defaultValues: getDefaultFormValues(),
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "translations",
  });

  const filteredEntries = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return entries;
    }

    return entries.filter((entry) => entry.toLowerCase().includes(query));
  }, [entries, searchQuery]);

  const resetForm = () => {
    form.reset(getDefaultFormValues());
    setEditingName(null);
  };

  const loadEntries = async () => {
    setIsListLoading(true);

    try {
      const response = await fetch(`${endpoint}?locale=en`, {
        cache: "no-store",
      });
      const data = await parseResponse(response);

      if (!response.ok) {
        throw new Error(
          (data && "title" in data && typeof data.title === "string" && data.title) ||
            `Failed to load ${title.toLowerCase()}.`,
        );
      }

      const values =
        data && typeof data === "object"
          ? getNamespaceValues(data as Record<string, unknown>, namespace)
          : [];

      setEntries(values.sort((a, b) => a.localeCompare(b)));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : `Failed to load ${title.toLowerCase()}.`;
      toast.error(message);
    } finally {
      setIsListLoading(false);
    }
  };

  useEffect(() => {
    if (!isActive) {
      return;
    }

    void loadEntries();
  }, [endpoint, isActive]);

  async function onSubmit(values: TranslationFormValues) {
    setIsSubmitting(true);

    const payload = {
      nameEn: values.nameEn.trim(),
      translations: values.translations.map((translation) => ({
        locale: translation.locale.trim(),
        name: translation.name.trim(),
      })),
      ...(editingName ? { previousNameEn: editingName } : {}),
    };

    try {
      const response = await fetch(endpoint, {
        method: editingName ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await parseResponse(response);

      if (!response.ok) {
        throw new Error(
          (data && "title" in data && typeof data.title === "string" && data.title) ||
            `Failed to save ${title.toLowerCase()}.`,
        );
      }

      toast.success(
        editingName ? `${title} translation updated.` : `${title} translation saved.`,
      );
      resetForm();
      await loadEntries();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : `Failed to save ${title.toLowerCase()}.`;
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleEdit = async (nameEn: string) => {
    setLoadingEntryName(nameEn);

    try {
      const response = await fetch(`${endpoint}?nameEn=${encodeURIComponent(nameEn)}`, {
        cache: "no-store",
      });
      const data = (await parseResponse(response)) as TranslationRecord | { title?: string } | null;

      if (!response.ok || !data || !("nameEn" in data) || !Array.isArray(data.translations)) {
        throw new Error(
          (data && "title" in data && typeof data.title === "string" && data.title) ||
            `Failed to load ${title.toLowerCase()} translation.`,
        );
      }

      form.reset({
        nameEn: data.nameEn,
        translations:
          data.translations.length > 0
            ? data.translations.map((translation) => ({
                locale: translation.locale,
                name: translation.name,
              }))
            : [{ ...defaultTranslation }],
      });
      setEditingName(data.nameEn);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : `Failed to load ${title.toLowerCase()} translation.`;
      toast.error(message);
    } finally {
      setLoadingEntryName(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    setDeletingName(deleteTarget);

    try {
      const response = await fetch(endpoint, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nameEn: deleteTarget }),
      });
      const data = await parseResponse(response);

      if (!response.ok) {
        throw new Error(
          (data && "title" in data && typeof data.title === "string" && data.title) ||
            `Failed to delete ${title.toLowerCase()} translation.`,
        );
      }

      if (editingName === deleteTarget) {
        resetForm();
      }

      toast.success(`${title} translation deleted.`);
      setDeleteTarget(null);
      await loadEntries();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : `Failed to delete ${title.toLowerCase()} translation.`;
      toast.error(message);
    } finally {
      setDeletingName(null);
    }
  };

  const isBusy = isSubmitting || Boolean(loadingEntryName);

  return (
    <>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-1">
                <CardTitle>{editingName ? `Edit ${title}` : `Create ${title}`}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </div>
              <Badge variant="outline">{editingName ? "Edit Mode" : "New Entry"}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="nameEn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Default English Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter the English name"
                          disabled={isBusy}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        This value is used as the base entry key for translations.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-medium">Locale Translations</h3>
                      <p className="text-sm text-muted-foreground">
                        Add one row for each locale-specific translation.
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => append({ ...defaultTranslation })}
                      disabled={isBusy}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Locale
                    </Button>
                  </div>

                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="grid gap-3 rounded-lg border p-4 md:grid-cols-[110px_minmax(0,1fr)_auto]"
                    >
                      <FormField
                        control={form.control}
                        name={`translations.${index}.locale`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Locale</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="az"
                                maxLength={3}
                                disabled={isBusy}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`translations.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Translated Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter translated name"
                                disabled={isBusy}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex items-end">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(index)}
                          disabled={isBusy || fields.length === 1}
                          aria-label={`Remove translation ${index + 1}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button type="submit" disabled={isBusy}>
                    {isSubmitting ? (
                      <>
                        <Spinner data-icon="inline-start" />
                        Saving...
                      </>
                    ) : editingName ? (
                      "Update Translation"
                    ) : (
                      "Save Translation"
                    )}
                  </Button>
                  {editingName ? (
                    <Button type="button" variant="outline" onClick={resetForm} disabled={isBusy}>
                      <X className="mr-2 h-4 w-4" />
                      Cancel Edit
                    </Button>
                  ) : null}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="xl:sticky xl:top-4">
          <CardHeader className="space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <CardTitle>Existing {title}</CardTitle>
                <CardDescription>
                  Search, inspect, edit, or remove saved entries without stretching the page.
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{entries.length}</Badge>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => void loadEntries()}
                  disabled={isListLoading || isBusy || Boolean(deletingName)}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
              </div>
            </div>

            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={`Search ${title.toLowerCase()}...`}
                className="pl-9"
                disabled={isListLoading}
              />
            </div>
          </CardHeader>
          <CardContent>
            {isListLoading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading translations...
              </div>
            ) : filteredEntries.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {searchQuery.trim()
                  ? `No ${title.toLowerCase()} matched your search.`
                  : `No saved ${title.toLowerCase()} translations yet.`}
              </p>
            ) : (
              <div className="max-h-128 space-y-2 overflow-y-auto pr-1">
                {filteredEntries.map((entryName) => (
                  <div
                    key={entryName}
                    className="flex items-center justify-between gap-3 rounded-lg border px-3 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{entryName}</p>
                      {editingName === entryName ? (
                        <p className="text-xs text-muted-foreground">Currently editing</p>
                      ) : null}
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => void handleEdit(entryName)}
                        disabled={isBusy || deletingName === entryName}
                      >
                        {loadingEntryName === entryName ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Pencil className="h-4 w-4" />
                        )}
                        Edit
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={() => setDeleteTarget(entryName)}
                        disabled={isBusy || deletingName === entryName}
                      >
                        {deletingName === entryName ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open && !deletingName) {
            setDeleteTarget(null);
          }
        }}
      >
        <DialogContent className="max-w-md" showCloseButton={!deletingName}>
          <DialogHeader>
            <DialogTitle>Delete translation?</DialogTitle>
            <DialogDescription>
              {deleteTarget
                ? `This will permanently delete "${deleteTarget}" from ${title.toLowerCase()}.`
                : "This action cannot be undone."}
            </DialogDescription>
          </DialogHeader>

          <p className="text-sm text-muted-foreground">
            This removes the entry across all saved locales.
          </p>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              disabled={Boolean(deletingName)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => void handleDelete()}
              disabled={Boolean(deletingName)}
            >
              {deletingName ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function TranslationManagement() {
  const [activeTab, setActiveTab] = useState<TranslationNamespace>(
    translationSections[0].namespace,
  );

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => setActiveTab(value as TranslationNamespace)}
      className="space-y-4"
    >
      <div className="overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <TabsList variant="line" className="h-auto w-full min-w-max justify-start gap-2">
          {translationSections.map((section) => (
            <TabsTrigger key={section.namespace} value={section.namespace} className="px-4 py-2">
              {section.title}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {translationSections.map((section) => (
        <TabsContent key={section.namespace} value={section.namespace} className="mt-0">
          <TranslationFormCard {...section} isActive={activeTab === section.namespace} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
