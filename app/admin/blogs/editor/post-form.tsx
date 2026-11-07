"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as z from "zod";
import { $getRoot, type EditorState, type SerializedEditorState } from "lexical";
import { AlertTriangle, ArrowLeft, Info, Loader2, Save, Send } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/hooks/use-session";
import { createPost, fetchPost, submitPost, updatePost } from "@/lib/api/blog";
import { isScientist } from "@/types/session";
import { Post, PostInput, PostStatus } from "@/types/blog";
import { StatusBadge } from "../status-badge";

const Editor = dynamic(
  () => import("@/components/editor").then((m) => ({ default: m.Editor })),
  { ssr: false },
);

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "az", label: "Azerbaijani" },
] as const;

const schema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  excerpt: z.string().max(500),
  locale: z.enum(["en", "az"]),
});

type FormData = z.infer<typeof schema>;

type Verdict = { status: PostStatus; feedback: string | null };

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
        <AlertDescription>It may have been deleted, or it belongs to another author.</AlertDescription>
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

function parseState(json?: string): SerializedEditorState | undefined {
  if (!json) return undefined;
  try {
    return JSON.parse(json);
  } catch {
    return undefined;
  }
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

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: post
      ? {
          title: post.title,
          excerpt: post.excerpt,
          locale: post.locale as FormData["locale"],
        }
      : { title: "", excerpt: "", locale: "en" },
  });

  const editorStateRef = useRef<EditorState | undefined>(undefined);
  const [initialState] = useState(() => parseState(post?.editorState));
  const [postId, setPostId] = useState(initialId);
  const [busy, setBusy] = useState<"save" | "publish" | null>(null);
  const [verdict, setVerdict] = useState<Verdict | null>(() =>
    post ? { status: post.status, feedback: post.verificationFeedback } : null,
  );

  const currentEditorJson = () => {
    const state = editorStateRef.current;
    if (state) {
      const text = state.read(() => $getRoot().getTextContent()).trim();
      return text ? JSON.stringify(state.toJSON()) : null;
    }
    return initialState ? JSON.stringify(initialState) : null;
  };

  // Saves the draft; returns the post id (creating the post on first save).
  const save = async (data: FormData): Promise<string | null> => {
    const editorState = currentEditorJson();
    if (!editorState) {
      toast.error("Write some content first");
      return null;
    }

    const input: PostInput = { ...data, editorState };

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

  const doSave = async (data: FormData) => {
    setBusy("save");
    try {
      if (await save(data)) {
        setVerdict({ status: "Draft", feedback: null });
        queryClient.invalidateQueries({ queryKey: ["blog", "my-posts"] });
        toast.success("Draft saved");
      }
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setBusy(null);
    }
  };

  const doPublish = async (data: FormData) => {
    setBusy("publish");
    try {
      const id = await save(data);
      if (!id) return;

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

  // handleSubmit is invoked per click so the editor ref is only read in events.
  const onSave = () => handleSubmit(doSave)();
  const onPublish = () => handleSubmit(doPublish)();

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
            Posts are published only after they pass automatic content verification.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link href="/admin/blogs">
              <ArrowLeft className="mr-2 h-4 w-4" />
              All posts
            </Link>
          </Button>
          <Button variant="outline" onClick={onSave} disabled={!!busy}>
            {busy === "save" ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {busy === "save" ? "Saving…" : "Save draft"}
          </Button>
          <Button onClick={onPublish} disabled={!!busy}>
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
        <CardHeader>
          <CardTitle>Post details</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field data-invalid={!!errors.title}>
              <FieldLabel htmlFor="title">Title</FieldLabel>
              <Input
                id="title"
                placeholder="Give your article a title"
                aria-invalid={!!errors.title}
                {...register("title")}
              />
              <FieldError errors={[errors.title]} />
            </Field>
            <Field data-invalid={!!errors.excerpt}>
              <FieldLabel htmlFor="excerpt">Summary</FieldLabel>
              <Textarea
                id="excerpt"
                rows={2}
                placeholder="One or two sentences shown in the article list"
                {...register("excerpt")}
              />
              <FieldError errors={[errors.excerpt]} />
            </Field>
            <Field className="max-w-xs">
              <FieldLabel>Language of the post</FieldLabel>
              <Controller
                control={control}
                name="locale"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
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
                )}
              />
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Content</CardTitle>
          <CardDescription>Write the article using the rich text editor</CardDescription>
        </CardHeader>
        <CardContent>
          <Editor
            editorSerializedState={initialState}
            onChange={(state) => {
              editorStateRef.current = state;
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
