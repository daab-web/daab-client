"use client";

import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

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

type TranslationFormCardProps = {
  title: string;
  description: string;
  endpoint: string;
};

const defaultTranslation = { locale: "", name: "" };

function TranslationFormCard({
  title,
  description,
  endpoint,
}: TranslationFormCardProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<TranslationFormValues>({
    resolver: zodResolver(translationFormSchema),
    defaultValues: {
      nameEn: "",
      translations: [defaultTranslation],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "translations",
  });

  async function onSubmit(values: TranslationFormValues) {
    setIsSubmitting(true);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nameEn: values.nameEn.trim(),
          translations: values.translations.map((translation) => ({
            locale: translation.locale.trim(),
            name: translation.name.trim(),
          })),
        }),
      });

      const data = (await response.json().catch(() => null)) as
        | { title?: string }
        | null;

      if (!response.ok) {
        throw new Error(data?.title || `Failed to save ${title.toLowerCase()}.`);
      }

      toast.success(`${title} translation saved.`);
      form.reset({
        nameEn: "",
        translations: [defaultTranslation],
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : `Failed to save ${title.toLowerCase()}.`;
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
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
                      disabled={isSubmitting}
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
                  disabled={isSubmitting}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Locale
                </Button>
              </div>

              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid gap-3 rounded-lg border p-4 md:grid-cols-[120px_minmax(0,1fr)_auto]"
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
                            disabled={isSubmitting}
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
                            disabled={isSubmitting}
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
                      disabled={isSubmitting || fields.length === 1}
                      aria-label={`Remove translation ${index + 1}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner data-icon="inline-start" />
                  Saving...
                </>
              ) : (
                "Save Translation"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default function TranslationManagement() {
  return (
    <div className="grid items-start gap-4 xl:grid-cols-3">
      <TranslationFormCard
        title="Areas"
        description="Create localized research area names for the public site and admin tools."
        endpoint="/api/areas"
      />
      <TranslationFormCard
        title="Countries"
        description="Create localized country names with an English default and per-locale labels."
        endpoint="/api/countries"
      />
      <TranslationFormCard
        title="Institutions"
        description="Create localized institution names so scientist entries can stay consistent across locales."
        endpoint="/api/institutions"
      />
    </div>
  );
}
