"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import * as z from "zod";
import { ScrollReveal } from "@/components/scroll-reveal";

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

import { submitApplication } from "@/lib/api/applications";

type FormData = z.infer<ReturnType<typeof createFormSchema>>;

interface ScientificField {
  title: string;
  fields: string[];
}

interface SelectOption {
  value: string;
  label: string;
}

interface StepConfig {
  key: string;
  label: string;
  description: string;
  fields: Array<keyof FormData>;
}

const createFormSchema = (t: any) =>
  z.object({
    email: z.email("errors.emailInvalid"),
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
  const [activeStep, setActiveStep] = useState(0);
  const [furthestStep, setFurthestStep] = useState(0);
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

  const steps = useMemo<StepConfig[]>(
    () => [
      {
        key: "personal",
        label: t("sections.personal"),
        description: t("stepDescriptions.personal"),
        fields: [
          "email",
          "phoneNumber",
          "name",
          "surname",
          "city",
          "residence",
        ],
      },
      {
        key: "academic",
        label: t("sections.academic"),
        description: t("stepDescriptions.academic"),
        fields: [
          "universityName",
          "fieldOfStudy",
          "almaMater",
          "degreeInstitution",
          "academicDegree",
          "academicDegreeOther",
          "academicTitle",
          "academicTitleOther",
        ],
      },
      {
        key: "professional",
        label: t("sections.professionalScientific"),
        description: t("stepDescriptions.professional"),
        fields: [
          "jobPosition",
          "previousJob",
          "engagedScientistFields",
          "engagedScientistFieldsOther",
        ],
      },
      {
        key: "additional",
        label: t("sections.additional"),
        description: t("stepDescriptions.additional"),
        fields: [
          "contributionsToDaab",
          "additionalInformation",
          "additionalInformationToShare",
        ],
      },
    ],
    [t],
  );

  const {
    register,
    handleSubmit,
    control,
    watch,
    trigger,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    shouldUnregister: false,
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
  const isLastStep = activeStep === steps.length - 1;
  const activeStepConfig = steps[activeStep];

  useEffect(() => {
    setShowDegreeOther(watchDegree === "other");
  }, [watchDegree]);

  useEffect(() => {
    setShowTitleOther(watchTitle === "other");
  }, [watchTitle]);

  const goToStep = useCallback(
    (step: number) => {
      if (step <= furthestStep) {
        setActiveStep(step);
      }
    },
    [furthestStep],
  );

  const goBack = useCallback(() => {
    setActiveStep((currentStep) => Math.max(currentStep - 1, 0));
  }, []);

  const goNext = useCallback(async () => {
    const valid = await trigger(activeStepConfig.fields);
    if (!valid) {
      return;
    }

    setFurthestStep((currentStep) => Math.max(currentStep, activeStep + 1));
    setActiveStep((currentStep) => Math.min(currentStep + 1, steps.length - 1));
  }, [activeStep, activeStepConfig.fields, steps.length, trigger]);

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
        setActiveStep(0);
        setFurthestStep(0);

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

  const renderStepContent = (stepIndex: number) => {
    switch (stepIndex) {
      case 0:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold border-b pb-2 text-[#274380] border-[#274380] dark:text-[#8fb0ff] dark:border-[#3557aa]">
              {t("sections.personal")}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">
                  {t("fields.email")} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
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
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="surname">
                  {t("fields.surname")} <span className="text-red-500">*</span>
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
                  <p className="text-sm text-red-500">{errors.city.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="residence">{t("fields.residence")}</Label>
                <Input id="residence" {...register("residence")} />
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold border-b pb-2 text-[#274380] border-[#274380] dark:text-[#8fb0ff] dark:border-[#3557aa]">
              {t("sections.academic")}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="universityName">
                  {t("fields.universityName")}
                </Label>
                <Input id="universityName" {...register("universityName")} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fieldOfStudy">{t("fields.fieldOfStudy")}</Label>
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

            <div className="space-y-4 rounded-lg border bg-card p-6">
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
                        className="flex items-start space-x-3 rounded p-2 transition-colors hover:bg-accent/50"
                      >
                        <RadioGroupItem
                          value={option.value}
                          id={`degree-${option.value}`}
                          className="mt-1"
                        />
                        <Label
                          htmlFor={`degree-${option.value}`}
                          className="flex-1 cursor-pointer font-normal leading-relaxed"
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

            <div className="space-y-4 rounded-lg border bg-card p-6">
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
                        className="flex items-start space-x-3 rounded p-2 transition-colors hover:bg-accent/50"
                      >
                        <RadioGroupItem
                          value={option.value}
                          id={`title-${option.value}`}
                          className="mt-1"
                        />
                        <Label
                          htmlFor={`title-${option.value}`}
                          className="flex-1 cursor-pointer font-normal leading-relaxed"
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
        );

      case 2:
        return (
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold border-b pb-2 text-[#274380] border-[#274380] dark:text-[#8fb0ff] dark:border-[#3557aa]">
                {t("sections.professional")}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="jobPosition">{t("fields.jobPosition")}</Label>
                  <Input id="jobPosition" {...register("jobPosition")} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="previousJob">{t("fields.previousJob")}</Label>
                  <Input id="previousJob" {...register("previousJob")} />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold border-b pb-2 text-[#274380] border-[#274380] dark:text-[#8fb0ff] dark:border-[#3557aa]">
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
                    {Object.entries(scientificFields).map(([key, category]) => (
                      <div
                        key={key}
                        className="space-y-3 rounded-lg border bg-card p-5"
                      >
                        <h4 className="font-semibold text-foreground">
                          {category.title}
                        </h4>
                        <div className="space-y-2 pl-2">
                          {category.fields.map((fieldName) => (
                            <div
                              key={fieldName}
                              className="flex items-start space-x-3 rounded p-1.5 transition-colors hover:bg-accent/50"
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
                                className="flex-1 cursor-pointer font-normal leading-relaxed"
                              >
                                {fieldName}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}

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
          </div>
        );

      case 3:
        return (
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
                className={errors.contributionsToDaab ? "border-red-500" : ""}
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
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(39,67,128,0.12),transparent_34%),linear-gradient(to_bottom,#f8fafc,#ffffff_45%,#eef2ff)] px-4 py-10 sm:py-12 dark:bg-[radial-gradient(circle_at_top,rgba(39,67,128,0.24),transparent_32%),linear-gradient(to_bottom,#050505,#0b0b0b_42%,#111111)]">
      <ScrollReveal />
      <div className="reveal mx-auto max-w-6xl space-y-8">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#274380]">
            {t("eyebrow")}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-5xl dark:text-white">
            {t("title")}
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-base dark:text-slate-300">
            {t("description")}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <Card className="h-fit border-white/70 bg-white/90 shadow-xl shadow-slate-200/60 backdrop-blur dark:border-white/10 dark:bg-[#171717] dark:shadow-black/40">
            <CardHeader className="space-y-3 border-b bg-slate-50/80 pb-4 dark:border-white/10 dark:bg-transparent">
              <CardTitle className="inline-flex w-fit items-center rounded-full bg-slate-100 px-3 py-1 text-lg font-semibold text-slate-950 dark:bg-[#1f1f1f] dark:text-[#b5c8ff]">
                {t("applicationSteps")}
              </CardTitle>
              <CardDescription className="dark:text-slate-400">
                {t("applicationStepsDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-2">
                {steps.map((step, index) => {
                  const isCompleted = index < activeStep;
                  const isCurrent = index === activeStep;

                  return (
                    <button
                      key={step.key}
                      type="button"
                      onClick={() => goToStep(index)}
                      className={`flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition-colors ${
                        isCurrent
                          ? "bg-[#274380] text-white shadow-sm"
                          : isCompleted
                            ? "bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-white/8 dark:text-slate-100 dark:hover:bg-white/12"
                            : "cursor-not-allowed bg-transparent text-slate-400 dark:text-slate-500"
                      }`}
                      disabled={!isCurrent && !isCompleted}
                    >
                      <span
                        className={`mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold leading-none ${
                          isCurrent
                            ? "border-white/60 bg-white/15 text-white"
                            : isCompleted
                              ? "border-emerald-600 bg-emerald-600 text-white"
                              : "border-slate-300 bg-white text-slate-500 dark:border-white/15 dark:bg-white/5 dark:text-slate-400"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="h-4 w-4 shrink-0" />
                        ) : (
                          index + 1
                        )}
                      </span>
                      <span className="min-w-0">
                        <span className="block font-medium leading-5">
                          {step.label}
                        </span>
                        <span
                          className={`mt-1 block text-sm leading-5 ${
                            isCurrent ? "text-white/80" : "text-slate-500"
                          }`}
                        >
                          {step.description}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/70 bg-white/95 shadow-xl shadow-slate-200/60 dark:border-white/10 dark:bg-[#171717] dark:shadow-black/40">
            <CardHeader className="space-y-3 border-b bg-slate-50/70 dark:border-white/10 dark:bg-transparent">
              <CardTitle className="text-2xl text-slate-950 sm:text-3xl dark:text-white">
                {activeStepConfig.label}
              </CardTitle>
              <CardDescription className="max-w-2xl text-slate-600 dark:text-slate-400">
                {activeStepConfig.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
              {submitted && (
                <Alert className="mb-6 border-green-600 bg-green-50 dark:border-green-800 dark:bg-green-950">
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

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-8">
                  {steps.map((step, index) => (
                    <div
                      key={step.key}
                      className={index === activeStep ? "block" : "hidden"}
                      aria-hidden={index !== activeStep}
                    >
                      {renderStepContent(index)}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={goBack}
                    disabled={activeStep === 0}
                    className="dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                  >
                    {t("back")}
                  </Button>

                  {isLastStep ? (
                    <Button
                      type="submit"
                      size="lg"
                      className="px-8"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? t("submitting") : t("submitButton")}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      size="lg"
                      className="px-8"
                      onClick={goNext}
                    >
                      {t("continue")}
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
