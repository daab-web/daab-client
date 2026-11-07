"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Check,
  Languages,
  Loader2,
  MessageSquare,
  Sparkles,
  Trash2,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useSession } from "@/hooks/use-session";
import { signInUrl } from "@/lib/api/auth";
import {
  addComment,
  deleteComment,
  fetchComments,
  suggestTranslation,
} from "@/lib/api/blog";
import { formatDateTime } from "@/lib/format";
import { routing } from "@/i18n/routing";
import { BlogComment } from "@/types/blog";
import { isAdmin } from "@/types/session";

const MAX_LENGTH = 2000;
const LOCALES = routing.locales as readonly string[];

/** The comment in the reader's language, falling back to the original. */
export function commentText(comment: BlogComment, locale: string) {
  return comment.texts[locale] ?? comment.texts[comment.sourceLocale] ?? "";
}

interface CommentsSectionProps {
  postId: string;
  postAuthorId: string;
}

export function CommentsSection({ postId, postAuthorId }: CommentsSectionProps) {
  const t = useTranslations("Blog.comments");
  const locale = useLocale();
  const { user, isLoading: sessionLoading } = useSession();
  const queryKey = ["blog", "comments", postId];

  const { data: comments, isLoading } = useQuery({
    queryKey,
    queryFn: () => fetchComments(postId),
  });

  return (
    <section className="space-y-6" aria-labelledby="comments-title">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-[#274380] dark:text-[#C9D6F0]" />
        <h2
          id="comments-title"
          className="text-xl font-semibold text-slate-950 dark:text-white"
        >
          {t("title")}
          {comments && comments.length > 0 && (
            <span className="ml-2 text-base font-normal text-muted-foreground">
              ({comments.length})
            </span>
          )}
        </h2>
      </div>

      {sessionLoading ? (
        <Skeleton className="h-24 w-full" />
      ) : user ? (
        <CommentForm postId={postId} queryKey={queryKey} />
      ) : (
        <SignInPrompt />
      )}

      <Separator />

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : !comments || comments.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("empty")}</p>
      ) : (
        <ul className="space-y-5">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              text={commentText(comment, locale)}
              canDelete={
                !!user &&
                (user.sub === comment.authorId ||
                  user.sub === postAuthorId ||
                  isAdmin(user))
              }
              queryKey={queryKey}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

function SignInPrompt() {
  const t = useTranslations("Blog.comments");
  const pathname = usePathname();

  return (
    <Alert>
      <UserRound className="h-4 w-4" />
      <AlertDescription className="flex flex-wrap items-center justify-between gap-3">
        <span>{t("signInPrompt")}</span>
        <Button asChild size="sm">
          <a href={signInUrl(pathname)}>{t("signIn")}</a>
        </Button>
      </AlertDescription>
    </Alert>
  );
}

/** How a translation got into its box; only "approved" and "own" may be posted. */
type TranslationState = "empty" | "suggested" | "approved" | "own";

function CommentForm({
  postId,
  queryKey,
}: {
  postId: string;
  queryKey: readonly unknown[];
}) {
  const t = useTranslations("Blog.comments");
  const tLanguages = useTranslations("Blog.languages");
  const appLocale = useLocale();
  const queryClient = useQueryClient();

  const [sourceLocale, setSourceLocale] = useState(
    LOCALES.includes(appLocale) ? appLocale : routing.defaultLocale,
  );
  const [texts, setTexts] = useState<Record<string, string>>({});
  const [states, setStates] = useState<Record<string, TranslationState>>({});

  const targets = LOCALES.filter((l) => l !== sourceLocale);
  const sourceText = texts[sourceLocale] ?? "";
  const tooLong = LOCALES.some((l) => (texts[l]?.length ?? 0) > MAX_LENGTH);
  const ready =
    sourceText.trim().length > 0 &&
    !tooLong &&
    targets.every(
      (l) =>
        (texts[l] ?? "").trim().length > 0 &&
        (states[l] === "approved" || states[l] === "own"),
    );

  const setText = (locale: string, value: string, state?: TranslationState) => {
    setTexts((prev) => ({ ...prev, [locale]: value }));
    if (state) setStates((prev) => ({ ...prev, [locale]: state }));
  };

  // The text already in a box stays the user's own when the original language changes.
  const changeSource = (next: string) => {
    if (!next || next === sourceLocale) return;
    setStates((prev) => {
      const updated = { ...prev };
      for (const l of LOCALES) {
        if (l !== next) updated[l] = texts[l]?.trim() ? "own" : "empty";
      }
      return updated;
    });
    setSourceLocale(next);
  };

  const suggest = useMutation({
    mutationFn: async (target: string) => {
      const [translation] = await suggestTranslation(sourceLocale, target, [
        sourceText.trim(),
      ]);
      return { target, translation };
    },
    onSuccess: ({ target, translation }) =>
      setText(target, translation, "suggested"),
    onError: () => toast.error(t("suggestionFailed")),
  });

  const post = useMutation({
    mutationFn: () =>
      addComment(
        postId,
        sourceLocale,
        Object.fromEntries(LOCALES.map((l) => [l, (texts[l] ?? "").trim()])),
      ),
    onSuccess: (comment) => {
      queryClient.setQueryData<BlogComment[]>(queryKey, (prev) => [
        ...(prev ?? []),
        comment,
      ]);
      setTexts({});
      setStates({});
      toast.success(t("posted"));
    },
    onError: (error) => toast.error(error.message),
  });

  const busy = post.isPending;

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (ready) post.mutate();
      }}
    >
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm text-muted-foreground">{t("writtenIn")}</span>
        <ToggleGroup
          type="single"
          variant="outline"
          size="sm"
          value={sourceLocale}
          onValueChange={changeSource}
          disabled={busy}
        >
          {LOCALES.map((l) => (
            <ToggleGroupItem key={l} value={l} className="px-3 uppercase">
              {l}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <Textarea
        value={sourceText}
        onChange={(e) => setText(sourceLocale, e.target.value)}
        placeholder={t("placeholder")}
        rows={3}
        aria-label={tLanguages(sourceLocale)}
        disabled={busy}
      />

      {targets.map((target) => {
        const state = states[target] ?? "empty";
        const language = tLanguages(target);
        const suggesting = suggest.isPending && suggest.variables === target;
        return (
          <div key={target} className="space-y-2 rounded-lg border p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Languages className="h-4 w-4" />
                {t("translationLabel", { language })}
                {state === "suggested" && (
                  <Badge variant="secondary">
                    <Sparkles />
                    AI
                  </Badge>
                )}
                {state === "approved" && (
                  <Badge variant="outline">
                    <Check />
                    {t("approved")}
                  </Badge>
                )}
                {state === "own" && (
                  <Badge variant="outline">{t("ownTranslation")}</Badge>
                )}
              </div>
              <div className="flex gap-2">
                {state === "suggested" && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      setStates((prev) => ({ ...prev, [target]: "approved" }))
                    }
                  >
                    <Check className="mr-1 h-4 w-4" />
                    {t("approve")}
                  </Button>
                )}
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  disabled={!sourceText.trim() || suggesting || busy}
                  onClick={() => suggest.mutate(target)}
                >
                  {suggesting ? (
                    <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-1 h-4 w-4" />
                  )}
                  {suggesting ? t("suggesting") : t("suggest")}
                </Button>
              </div>
            </div>
            <Textarea
              value={texts[target] ?? ""}
              onChange={(e) =>
                setText(target, e.target.value, e.target.value.trim() ? "own" : "empty")
              }
              placeholder={t("translationPlaceholder", { language })}
              rows={3}
              aria-label={language}
              disabled={busy || suggesting}
            />
            {state === "suggested" && (
              <p className="text-xs text-muted-foreground">{t("aiSuggestion")}</p>
            )}
          </div>
        );
      })}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <span
          className={`text-xs ${tooLong ? "text-destructive" : "text-muted-foreground"}`}
        >
          {tooLong
            ? t("tooLong")
            : !ready && sourceText.trim()
              ? t("needsTranslation")
              : `${sourceText.length}/${MAX_LENGTH}`}
        </span>
        <Button type="submit" size="sm" disabled={!ready || busy}>
          {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {busy ? t("posting") : t("submit")}
        </Button>
      </div>
    </form>
  );
}

function CommentItem({
  comment,
  text,
  canDelete,
  queryKey,
}: {
  comment: BlogComment;
  text: string;
  canDelete: boolean;
  queryKey: readonly unknown[];
}) {
  const t = useTranslations("Blog.comments");
  const locale = useLocale();
  const queryClient = useQueryClient();

  const remove = useMutation({
    mutationFn: () => deleteComment(comment.id),
    onSuccess: () => {
      queryClient.setQueryData<BlogComment[]>(queryKey, (prev) =>
        (prev ?? []).filter((c) => c.id !== comment.id),
      );
      toast.success(t("deleted"));
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <li className="rounded-xl border bg-card p-4">
      <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="text-sm font-semibold">{comment.authorName}</span>
        <time
          dateTime={comment.createdAt}
          className="text-xs text-muted-foreground"
        >
          {formatDateTime(comment.createdAt, locale)}
        </time>
        {canDelete && (
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto h-7 px-2 text-muted-foreground hover:text-destructive"
            onClick={() => remove.mutate()}
            disabled={remove.isPending}
            aria-label={t("delete")}
          >
            {remove.isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Trash2 className="h-3.5 w-3.5" />
            )}
          </Button>
        )}
      </div>

      <p className="whitespace-pre-wrap break-words text-sm leading-6">{text}</p>
    </li>
  );
}
