"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { $getRoot, type EditorState, type SerializedEditorState } from "lexical";
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  Info,
  Languages,
  Loader2,
  Save,
  Send,
  Sparkles,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/hooks/use-session";
import {
  createPost,
  fetchPost,
  submitPost,
  suggestTranslation,
  updatePost,
} from "@/lib/api/blog";
import { approveTranslation, translateDraft } from "@/lib/api/translation-memory";
import { isScientist } from "@/types/session";
import { Post, PostInput, PostStatus } from "@/types/blog";
import { ContentType } from "@/types/translation-memory";
import { StatusBadge } from "../status-badge";

const Editor = dynamic(
  () => import("@/components/editor").then((m) => ({ default: m.Editor })),
  { ssr: false },
);

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "az", label: "Azerbaijani" },
] as const;
type Locale = (typeof LANGUAGES)[number]["value"];
const LOCALES = LANGUAGES.map((l) => l.value) as Locale[];
const labelOf = (locale: Locale) => LANGUAGES.find((l) => l.value === locale)!.label;

type Verdict = { status: PostStatus; feedback: string | null };

/** One language of the post as edited in the form. */
interface Draft {
  title: string;
  excerpt: string;
  /** Initial editor content; the live content is kept in a ref while typing. */
  initialState: SerializedEditorState | undefined;
  /** Bumped to remount the editor with new initial content (an AI suggestion). */
  editorKey: number;
  /** An AI suggestion the author has not approved yet. */
  pendingApproval: boolean;
  /** The author approved an AI suggestion (shown as a badge). */
  approved: boolean;
}

const emptyDraft = (): Draft => ({
  title: "",
  excerpt: "",
  initialState: undefined,
  editorKey: 0,
  pendingApproval: false,
  approved: false,
});

function parseState(json?: string): SerializedEditorState | undefined {
  if (!json) return undefined;
  try {
    return JSON.parse(json);
  } catch {
    return undefined;
  }
}

export function BlogPostEditor() {
  const { user, isLoading } = useSession();

  if (isLoading) return <EditorSkeleton />;

  if (!isScientist(user)) {
    return (
      <Alert className="max-w-2xl">
        <Info className="h-4 w-4" />
        <AlertTitle>Only scientists can write posts</AlertTitle>
        <AlertDescription>
          Give the account the scientist role in Users to let it write posts.
        </AlertDescription>
      </Alert>
    );
  }

  return <EditorLoader />;
}

function EditorSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-1/2" />
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-96 w-full" />
    </div>
  );
}

function EditorLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");

  // A post created by the form below is already in it: don't reload/remount it
  // when its id lands in the URL, or an in-flight publish would be lost.
  const [createdId, setCreatedId] = useState<string | null>(null);
  const loadId = editId && editId !== createdId ? editId : null;

  const { data: post, isLoading } = useQuery({
    queryKey: ["blog", "post", loadId],
    queryFn: () => fetchPost(loadId!),
    enabled: !!loadId,
  });

  if (loadId && isLoading) return <EditorSkeleton />;
  if (loadId && !post) {
    return (
      <Alert variant="destructive" className="max-w-2xl">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Post not found</AlertTitle>
        <AlertDescription>
          It may have been deleted, or it belongs to another author.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <PostForm
      key={loadId ?? "new"}
      initialId={loadId}
      post={post ?? null}
      onCreated={(id) => {
        setCreatedId(id);
        window.history.replaceState(null, "", `${pathname}?id=${id}`);
      }}
    />
  );
}

function PostForm({
  initialId,
  post,
  onCreated,
}: {
  initialId: string | null;
  post: Post | null;
  onCreated: (id: string) => void;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [sourceLocale, setSourceLocale] = useState<Locale>(
    (post?.sourceLocale as Locale) ?? "en",
  );
  const [drafts, setDrafts] = useState<Record<Locale, Draft>>(() => {
    const initial = Object.fromEntries(LOCALES.map((l) => [l, emptyDraft()])) as Record<
      Locale,
      Draft
    >;
    for (const t of post?.translations ?? []) {
      if (LOCALES.includes(t.locale as Locale)) {
        initial[t.locale as Locale] = {
          ...emptyDraft(),
          title: t.title,
          excerpt: t.excerpt,
          initialState: parseState(t.editorState),
        };
      }
    }
    return initial;
  });
  const [tab, setTab] = useState<Locale>((post?.sourceLocale as Locale) ?? "en");
  const [postId, setPostId] = useState(initialId);
  const [busy, setBusy] = useState<"save" | "publish" | null>(null);
  const [suggesting, setSuggesting] = useState<Locale | null>(null);
  const [replaceTarget, setReplaceTarget] = useState<Locale | null>(null);
  const [verdict, setVerdict] = useState<Verdict | null>(() =>
    post ? { status: post.status, feedback: post.verificationFeedback } : null,
  );

  // Live editor content per language (kept out of state so typing does not re-render).
  const editorStates = useRef<Partial<Record<Locale, EditorState>>>({});

  const update = (locale: Locale, patch: Partial<Draft>) =>
    setDrafts((prev) => ({ ...prev, [locale]: { ...prev[locale], ...patch } }));

  /** The body as JSON, or null when it has no text. Only called from event handlers. */
  const bodyJson = (locale: Locale): string | null => {
    const live = editorStates.current[locale];
    if (live) {
      const text = live.read(() => $getRoot().getTextContent()).trim();
      return text ? JSON.stringify(live.toJSON()) : null;
    }
    const initial = drafts[locale].initialState;
    return initial ? JSON.stringify(initial) : null;
  };

  const targets = LOCALES.filter((l) => l !== sourceLocale);

  const changeSource = (next: Locale) => {
    setSourceLocale(next);
    // The original language is the author's own text by definition.
    update(next, { pendingApproval: false, approved: false });
  };

  /** Checks both languages are complete and approved; switches to the first problem. */
  const validate = (): PostInput | null => {
    for (const locale of [sourceLocale, ...targets]) {
      const draft = drafts[locale];
      const body = bodyJson(locale);
      if (!draft.title.trim() || !body) {
        setTab(locale);
        toast.error(`Complete the ${labelOf(locale)} version`, {
          description: "Every post needs a title and content in both languages.",
        });
        return null;
      }
      if (locale !== sourceLocale && draft.pendingApproval) {
        setTab(locale);
        toast.error(`Approve the ${labelOf(locale)} translation`, {
          description: "Review the AI suggestion, edit it if needed, then approve it.",
        });
        return null;
      }
    }

    return {
      sourceLocale,
      translations: LOCALES.map((locale) => ({
        locale,
        title: drafts[locale].title.trim(),
        excerpt: drafts[locale].excerpt.trim(),
        editorState: bodyJson(locale)!,
      })),
    };
  };

  // Saves the post; returns its id (creating it on first save).
  const save = async (input: PostInput): Promise<string> => {
    if (postId) {
      const updated = await updatePost(postId, input);
      queryClient.setQueryData(["blog", "post", postId], updated);
      return postId;
    }

    const created = await createPost(input);
    setPostId(created.id);
    onCreated(created.id);
    return created.id;
  };

  const onSave = async () => {
    const input = validate();
    if (!input) return;
    setBusy("save");
    try {
      await save(input);
      setVerdict({ status: "Draft", feedback: null });
      queryClient.invalidateQueries({ queryKey: ["blog", "my-posts"] });
      toast.success("Draft saved");
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setBusy(null);
    }
  };

  const onPublish = async () => {
    const input = validate();
    if (!input) return;
    setBusy("publish");
    try {
      const id = await save(input);
      const result = await submitPost(id);
      queryClient.invalidateQueries({ queryKey: ["blog", "my-posts"] });
      setVerdict({ status: result.status, feedback: result.verificationFeedback });

      if (result.status === "Published") {
        toast.success("Post published");
        router.push("/admin/blogs");
      } else {
        toast.error("The post did not pass content verification");
      }
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setBusy(null);
    }
  };

  /** Fills the target language with an AI translation of the original. */
  const suggest = async (target: Locale) => {
    const source = drafts[sourceLocale];
    const sourceBody = bodyJson(sourceLocale);
    if (!source.title.trim() || !sourceBody) {
      setTab(sourceLocale);
      toast.error(`Write the ${labelOf(sourceLocale)} version first`);
      return;
    }

    setSuggesting(target);
    try {
      const [[title, excerpt], body] = await Promise.all([
        suggestTranslation(sourceLocale, target, [source.title.trim(), source.excerpt.trim()]),
        translateDraft({
          editorStateJson: sourceBody,
          contentType: ContentType.Article,
          sourceLocale,
          targetLocale: target,
        }),
      ]);

      delete editorStates.current[target];
      setDrafts((prev) => ({
        ...prev,
        [target]: {
          title,
          excerpt,
          initialState: parseState(body.translatedJson),
          editorKey: prev[target].editorKey + 1,
          pendingApproval: true,
          approved: false,
        },
      }));
      toast.success(`${labelOf(target)} suggestion ready`, {
        description: "Review it, edit it if needed, then approve it.",
      });
    } catch (error) {
      toast.error("Translation suggestion failed", {
        description: (error as Error).message,
      });
    } finally {
      setSuggesting(null);
    }
  };

  const requestSuggestion = (target: Locale) => {
    const hasContent = !!drafts[target].title.trim() || !!bodyJson(target);
    if (hasContent) setReplaceTarget(target);
    else void suggest(target);
  };

  const approve = (target: Locale) => {
    update(target, { pendingApproval: false, approved: true });

    // Feed the approved pair into the translation memory to improve later suggestions.
    const sourceBody = bodyJson(sourceLocale);
    const targetBody = bodyJson(target);
    if (sourceBody && targetBody) {
      approveTranslation({
        sourceEditorStateJson: sourceBody,
        targetEditorStateJson: targetBody,
        contentType: ContentType.Article,
        sourceLocale,
        targetLocale: target,
      }).catch(() => {
        // Edited translations may no longer align block by block; that is fine.
      });
    }
  };

  const tabStatus = (locale: Locale) => {
    if (locale === sourceLocale) return <Badge variant="secondary">Original</Badge>;
    const draft = drafts[locale];
    if (draft.pendingApproval)
      return (
        <Badge variant="destructive">
          <Sparkles />
          Needs approval
        </Badge>
      );
    if (draft.approved)
      return (
        <Badge variant="outline">
          <Check />
          Approved
        </Badge>
      );
    if (draft.title.trim()) return <Badge variant="outline">Your translation</Badge>;
    return <Badge variant="outline">Missing</Badge>;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">
              {postId ? "Edit post" : "New post"}
            </h1>
            {verdict && <StatusBadge status={verdict.status} />}
          </div>
          <p className="text-muted-foreground">
            Posts are saved in English and Azerbaijani, and both are verified before
            publishing.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link href="/admin/blogs">
              <ArrowLeft className="mr-2 h-4 w-4" />
              All posts
            </Link>
          </Button>
          <Button variant="outline" onClick={onSave} disabled={!!busy || !!suggesting}>
            {busy === "save" ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {busy === "save" ? "Saving…" : "Save draft"}
          </Button>
          <Button onClick={onPublish} disabled={!!busy || !!suggesting}>
            {busy === "publish" ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            {busy === "publish" ? "Verifying content…" : "Publish"}
          </Button>
        </div>
      </div>

      {verdict?.status === "Rejected" && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>The post did not pass content verification</AlertTitle>
          <AlertDescription>
            <p>Edit the post to address the points below, then publish again.</p>
            {verdict.feedback && (
              <ul className="mt-2 list-disc space-y-1 pl-4">
                {verdict.feedback.split("\n").map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            )}
          </AlertDescription>
        </Alert>
      )}

      {verdict?.status === "Published" && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            This post is published. Saving changes takes it offline until it passes
            verification again.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4">
          <div className="space-y-1.5">
            <CardTitle>Content</CardTitle>
            <CardDescription>
              Write the post in one language, then add the other: get an AI suggestion
              and approve it, or write your own translation.
            </CardDescription>
          </div>
          <Field orientation="horizontal" className="w-auto">
            <FieldLabel className="whitespace-nowrap">Written in</FieldLabel>
            <Select value={sourceLocale} onValueChange={(v) => changeSource(v as Locale)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((l) => (
                  <SelectItem key={l.value} value={l.value}>
                    {l.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </CardHeader>
        <CardContent>
          <Tabs value={tab} onValueChange={(v) => setTab(v as Locale)}>
            <TabsList>
              {[sourceLocale, ...targets].map((locale) => (
                <TabsTrigger key={locale} value={locale} className="gap-2">
                  {labelOf(locale)}
                  {tabStatus(locale)}
                </TabsTrigger>
              ))}
            </TabsList>

            {LOCALES.map((locale) => {
              const draft = drafts[locale];
              const isTarget = locale !== sourceLocale;
              return (
                // Every editor stays mounted so switching tabs keeps unsaved text.
                <TabsContent
                  key={locale}
                  value={locale}
                  forceMount
                  className="mt-4 space-y-4 data-[state=inactive]:hidden"
                >
                  {isTarget && (
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Languages className="h-4 w-4" />
                        {draft.pendingApproval
                          ? "AI suggestion. Review it and edit it if needed, then approve it."
                          : `Translate from ${labelOf(sourceLocale)}, or write the ${labelOf(locale)} version yourself.`}
                      </div>
                      <div className="flex gap-2">
                        {draft.pendingApproval && (
                          <Button size="sm" onClick={() => approve(locale)}>
                            <Check className="mr-2 h-4 w-4" />
                            Approve translation
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={!!suggesting || !!busy}
                          onClick={() => requestSuggestion(locale)}
                        >
                          {suggesting === locale ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Sparkles className="mr-2 h-4 w-4" />
                          )}
                          {suggesting === locale ? "Translating…" : "Suggest AI translation"}
                        </Button>
                      </div>
                    </div>
                  )}

                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor={`title-${locale}`}>Title</FieldLabel>
                      <Input
                        id={`title-${locale}`}
                        value={draft.title}
                        onChange={(e) => update(locale, { title: e.target.value })}
                        placeholder="Give your article a title"
                        maxLength={200}
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor={`excerpt-${locale}`}>Summary</FieldLabel>
                      <Textarea
                        id={`excerpt-${locale}`}
                        rows={2}
                        value={draft.excerpt}
                        onChange={(e) => update(locale, { excerpt: e.target.value })}
                        placeholder="One or two sentences shown in the article list"
                        maxLength={500}
                      />
                    </Field>
                  </FieldGroup>

                  <Editor
                    key={`${locale}-${draft.editorKey}`}
                    editorSerializedState={draft.initialState}
                    onChange={(state) => {
                      editorStates.current[locale] = state;
                    }}
                  />
                </TabsContent>
              );
            })}
          </Tabs>
        </CardContent>
      </Card>

      <Dialog
        open={!!replaceTarget}
        onOpenChange={(open) => !open && setReplaceTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Replace the {replaceTarget && labelOf(replaceTarget)} version?</DialogTitle>
            <DialogDescription>
              The AI suggestion replaces the title, summary and content you have in this
              language.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReplaceTarget(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                const target = replaceTarget;
                setReplaceTarget(null);
                if (target) void suggest(target);
              }}
            >
              Replace
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
