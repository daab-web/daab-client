"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import * as z from "zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2, AlertCircle } from "lucide-react";

import { submitApplication } from "@/lib/api";

type FormData = z.infer<ReturnType<typeof createFormSchema>>;

interface ScientificField {
  title: string;
  fields: string[];
}

interface SelectOption {
  value: string;
  label: string;
}

const createFormSchema = (t: any) =>
  z.object({
    email: z
      .string()
      .min(1, t("errors.emailRequired"))
      .email(t("errors.emailInvalid")),
    name: z.string().min(1, t("errors.nameRequired")),
    surname: z.string().min(1, t("errors.surnameRequired")),
    residence: z.string().optional(),
    city: z.string().min(1, t("errors.cityRequired")),
    phoneNumber: z.string().min(1, t("errors.phoneRequired")),
    universityName: z.string().optional(),
    fieldOfStudy: z.string().optional(),
    academicDegree: z.string().min(1, t("errors.degreeRequired")),
    academicDegreeOther: z.string().optional(),
    almaMater: z.string().optional(),
    academicTitle: z.string().min(1, t("errors.titleRequired")),
    academicTitleOther: z.string().optional(),
    degreeInstitution: z.string().optional(),
    jobPosition: z.string().optional(),
    previousJob: z.string().optional(),
    contributionsToDaab: z.string().min(1, t("errors.contributionsRequired")),
    engagedScientistFields: z
      .array(z.string())
      .min(1, t("errors.fieldsRequired")),
    engagedScientistFieldsOther: z.string().optional(),
    additionalInformation: z.string().optional(),
    additionalInformationToShare: z.string().optional(),
  });

export default function ApplicationForm() {
  const t = useTranslations("Membership");

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDegreeOther, setShowDegreeOther] = useState(false);
  const [showTitleOther, setShowTitleOther] = useState(false);

  const formSchema = useMemo(() => createFormSchema(t), [t]);

  const academicDegreeOptions = useMemo<SelectOption[]>(
    () => [
      { value: "bakalavr", label: t("academicDegrees.bakalavr") },
      { value: "magistr", label: t("academicDegrees.magistr") },
      { value: "phd", label: t("academicDegrees.phd") },
      { value: "dsc", label: t("academicDegrees.dsc") },
      { value: "md", label: t("academicDegrees.md") },
      { value: "jd", label: t("academicDegrees.jd") },
      { value: "other", label: t("academicDegrees.other") },
    ],
    [t],
  );

  const academicTitleOptions = useMemo<SelectOption[]>(
    () => [
      { value: "dosent", label: t("academicTitles.dosent") },
      { value: "professor", label: t("academicTitles.professor") },
      { value: "fexri", label: t("academicTitles.fexri") },
      { value: "other", label: t("academicTitles.other") },
    ],
    [t],
  );

  const scientificFields = useMemo<Record<string, ScientificField>>(
    () => ({
      "1": {
        title: t("scientificFields.1.title"),
        fields: t.raw("scientificFields.1.fields") as string[],
      },
      "2": {
        title: t("scientificFields.2.title"),
        fields: t.raw("scientificFields.2.fields") as string[],
      },
      "3": {
        title: t("scientificFields.3.title"),
        fields: t.raw("scientificFields.3.fields") as string[],
      },
      "4": {
        title: t("scientificFields.4.title"),
        fields: t.raw("scientificFields.4.fields") as string[],
      },
      "5": {
        title: t("scientificFields.5.title"),
        fields: t.raw("scientificFields.5.fields") as string[],
      },
      "6": {
        title: t("scientificFields.6.title"),
        fields: t.raw("scientificFields.6.fields") as string[],
      },
    }),
    [t],
  );

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name: "",
      surname: "",
      residence: "",
      city: "",
      phoneNumber: "",
      universityName: "",
      fieldOfStudy: "",
      academicDegree: "",
      academicDegreeOther: "",
      almaMater: "",
      academicTitle: "",
      academicTitleOther: "",
      degreeInstitution: "",
      jobPosition: "",
      previousJob: "",
      contributionsToDaab: "",
      engagedScientistFields: [],
      engagedScientistFieldsOther: "",
      additionalInformation: "",
      additionalInformationToShare: "",
    },
  });

  const watchDegree = watch("academicDegree");
  const watchTitle = watch("academicTitle");

  useEffect(() => {
    setShowDegreeOther(watchDegree === "other");
  }, [watchDegree]);

  useEffect(() => {
    setShowTitleOther(watchTitle === "other");
  }, [watchTitle]);

  const onSubmit = useCallback(
    async (data: FormData) => {
      setError(null);
      setSubmitted(false);

      const scientistFields = [...data.engagedScientistFields];
      if (data.engagedScientistFieldsOther) {
        scientistFields.push(data.engagedScientistFieldsOther);
      }

      const submissionData = {
        email: data.email,
        name: data.name,
        surname: data.surname,
        residence: data.residence || "",
        city: data.city,
        phoneNumber: data.phoneNumber,
        universityName: data.universityName || "",
        fieldOfStudy: data.fieldOfStudy || "",
        academicDegree:
          data.academicDegree === "other" && data.academicDegreeOther
            ? data.academicDegreeOther
            : data.academicDegree,
        almaMater: data.almaMater || "",
        academicTitle:
          data.academicTitle === "other" && data.academicTitleOther
            ? data.academicTitleOther
            : data.academicTitle,
        degreeInstitution: data.degreeInstitution || "",
        jobPosition: data.jobPosition || null,
        previousJob: data.previousJob || null,
        contributionsToDaab: data.contributionsToDaab,
        engagedScientistFields: scientistFields.join(", ") || null,
        additionalInformation: data.additionalInformation || null,
        additionalInformationToShare: data.additionalInformationToShare || null,
      };

      try {
        await submitApplication(submissionData);

        setSubmitted(true);
        reset();

        toast.success(t("successMessage"), {
          description:
            t("successDescription") || "Your application is now under review.",
          duration: 5000,
        });

        setTimeout(() => {
          setSubmitted(false);
        }, 5000);
      } catch (err) {
        console.error("Failed to submit application:", err);

        const errorMsg =
          t("errorMessage") ||
          "Failed to submit application. Please try again.";

        setError(errorMsg);

        toast.error("Submission Failed", {
          description: errorMsg,
          duration: 5000,
        });
      }
    },
    [reset, t],
  );

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="space-y-1 rounded-t-lg bg-[#274380] text-white dark:bg-[#274380]">
            <CardTitle className="text-3xl font-bold">{t("title")}</CardTitle>
            <CardDescription className="text-white/90">
              {t("description")}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            {submitted && (
              <Alert className="mb-6 border-green-600 bg-green-50 dark:bg-green-950 dark:border-green-800">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertDescription className="text-green-800 dark:text-green-300">
                  {t("successMessage")}
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold border-b pb-2 text-[#274380] border-[#274380] dark:text-[#C9D6F0] dark:border-[#C9D6F0]">
                  {t("sections.personal")}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      {t("fields.email")}{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">
                      {t("fields.phoneNumber")}{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      {...register("phoneNumber")}
                      className={errors.phoneNumber ? "border-red-500" : ""}
                    />
                    {errors.phoneNumber && (
                      <p className="text-sm text-red-500">
                        {errors.phoneNumber.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">
                      {t("fields.name")} <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      {...register("name")}
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="surname">
                      {t("fields.surname")}{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="surname"
                      {...register("surname")}
                      className={errors.surname ? "border-red-500" : ""}
                    />
                    {errors.surname && (
                      <p className="text-sm text-red-500">
                        {errors.surname.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">
                      {t("fields.city")} <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="city"
                      {...register("city")}
                      className={errors.city ? "border-red-500" : ""}
                    />
                    {errors.city && (
                      <p className="text-sm text-red-500">
                        {errors.city.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="residence">{t("fields.residence")}</Label>
                    <Input id="residence" {...register("residence")} />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold border-b pb-2 text-[#274380] border-[#274380] dark:text-[#C9D6F0] dark:border-[#C9D6F0]">
                  {t("sections.academic")}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="universityName">
                      {t("fields.universityName")}
                    </Label>
                    <Input
                      id="universityName"
                      {...register("universityName")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fieldOfStudy">
                      {t("fields.fieldOfStudy")}
                    </Label>
                    <Input id="fieldOfStudy" {...register("fieldOfStudy")} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="almaMater">{t("fields.almaMater")}</Label>
                    <Input id="almaMater" {...register("almaMater")} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="degreeInstitution">
                      {t("fields.degreeInstitution")}
                    </Label>
                    <Input
                      id="degreeInstitution"
                      {...register("degreeInstitution")}
                    />
                  </div>
                </div>

                <div className="space-y-4 p-6 rounded-lg border bg-card">
                  <Label className="text-base font-semibold">
                    {t("fields.academicDegree")}{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    name="academicDegree"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="space-y-3"
                      >
                        {academicDegreeOptions.map((option) => (
                          <div
                            key={option.value}
                            className="flex items-start space-x-3 p-2 rounded hover:bg-accent/50 transition-colors"
                          >
                            <RadioGroupItem
                              value={option.value}
                              id={`degree-${option.value}`}
                              className="mt-1"
                            />
                            <Label
                              htmlFor={`degree-${option.value}`}
                              className="font-normal cursor-pointer leading-relaxed flex-1"
                            >
                              {option.label}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    )}
                  />
                  {showDegreeOther && (
                    <Input
                      placeholder={t("placeholders.specifyDegree")}
                      {...register("academicDegreeOther")}
                      className="mt-2"
                    />
                  )}
                  {errors.academicDegree && (
                    <p className="text-sm text-red-500">
                      {errors.academicDegree.message}
                    </p>
                  )}
                </div>

                <div className="space-y-4 p-6 rounded-lg border bg-card">
                  <Label className="text-base font-semibold">
                    {t("fields.academicTitle")}{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    name="academicTitle"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="space-y-3"
                      >
                        {academicTitleOptions.map((option) => (
                          <div
                            key={option.value}
                            className="flex items-start space-x-3 p-2 rounded hover:bg-accent/50 transition-colors"
                          >
                            <RadioGroupItem
                              value={option.value}
                              id={`title-${option.value}`}
                              className="mt-1"
                            />
                            <Label
                              htmlFor={`title-${option.value}`}
                              className="font-normal cursor-pointer leading-relaxed flex-1"
                            >
                              {option.label}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    )}
                  />
                  {showTitleOther && (
                    <Input
                      placeholder={t("placeholders.specifyTitle")}
                      {...register("academicTitleOther")}
                      className="mt-2"
                    />
                  )}
                  {errors.academicTitle && (
                    <p className="text-sm text-red-500">
                      {errors.academicTitle.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold border-b pb-2 text-[#274380] border-[#274380] dark:text-[#C9D6F0] dark:border-[#C9D6F0]">
                  {t("sections.professional")}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="jobPosition">
                      {t("fields.jobPosition")}
                    </Label>
                    <Input id="jobPosition" {...register("jobPosition")} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="previousJob">
                      {t("fields.previousJob")}
                    </Label>
                    <Input id="previousJob" {...register("previousJob")} />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold border-b pb-2 text-[#274380] border-[#274380] dark:text-[#C9D6F0] dark:border-[#C9D6F0]">
                  {t("sections.scientificFields")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t("fields.scientificFieldsSelect")}{" "}
                  <span className="text-red-500">*</span>
                </p>

                <Controller
                  name="engagedScientistFields"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-6">
                      {Object.entries(scientificFields).map(
                        ([key, category]) => (
                          <div
                            key={key}
                            className="space-y-3 p-5 rounded-lg border bg-card"
                          >
                            <h4 className="font-semibold text-foreground">
                              {category.title}
                            </h4>
                            <div className="space-y-2 pl-2">
                              {category.fields.map((fieldName) => (
                                <div
                                  key={fieldName}
                                  className="flex items-start space-x-3 p-1.5 rounded hover:bg-accent/50 transition-colors"
                                >
                                  <Checkbox
                                    id={fieldName}
                                    checked={field.value?.includes(fieldName)}
                                    onCheckedChange={(checked) => {
                                      const updatedValue = checked
                                        ? [...(field.value || []), fieldName]
                                        : field.value?.filter(
                                            (v) => v !== fieldName,
                                          ) || [];
                                      field.onChange(updatedValue);
                                    }}
                                  />
                                  <Label
                                    htmlFor={fieldName}
                                    className="font-normal cursor-pointer leading-relaxed flex-1"
                                  >
                                    {fieldName}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </div>
                        ),
                      )}
                      <div className="space-y-2">
                        <Label htmlFor="engagedScientistFieldsOther">
                          {t("fields.otherFields")}
                        </Label>
                        <Input
                          id="engagedScientistFieldsOther"
                          {...register("engagedScientistFieldsOther")}
                          placeholder={t("placeholders.otherFields")}
                        />
                      </div>
                    </div>
                  )}
                />
                {errors.engagedScientistFields && (
                  <p className="text-sm text-red-500">
                    {errors.engagedScientistFields.message}
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold border-b pb-2 text-[#274380] border-[#274380] dark:text-[#C9D6F0] dark:border-[#C9D6F0]">
                  {t("sections.additional")}
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="contributionsToDaab">
                    {t("fields.contributionsToDaab")}{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="contributionsToDaab"
                    {...register("contributionsToDaab")}
                    rows={4}
                    placeholder={t("placeholders.contributions")}
                    className={
                      errors.contributionsToDaab ? "border-red-500" : ""
                    }
                  />
                  {errors.contributionsToDaab && (
                    <p className="text-sm text-red-500">
                      {errors.contributionsToDaab.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additionalInformation">
                    {t("fields.additionalInformation")}
                  </Label>
                  <Textarea
                    id="additionalInformation"
                    {...register("additionalInformation")}
                    rows={4}
                    placeholder={t("placeholders.additionalInfo")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additionalInformationToShare">
                    {t("fields.additionalInformationToShare")}
                  </Label>
                  <Textarea
                    id="additionalInformationToShare"
                    {...register("additionalInformationToShare")}
                    rows={4}
                    placeholder={t("placeholders.additionalShare")}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  onClick={handleSubmit(onSubmit)}
                  size="lg"
                  className="px-8"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t("submitting") : t("submitButton")}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
