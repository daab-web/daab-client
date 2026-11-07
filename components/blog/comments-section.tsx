"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Languages, Loader2, MessageSquare, Trash2, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useSession } from "@/hooks/use-session";
import { signInUrl } from "@/lib/api/auth";
import {
  addComment,
  deleteComment,
  fetchComments,
  translateComment,
} from "@/lib/api/blog";
import { formatDateTime, languageName } from "@/lib/format";
import { BlogComment } from "@/types/blog";
import { isAdmin } from "@/types/session";

const MAX_LENGTH = 2000;

/**
 * A comment offers translation when it is written in a language other than
 * the app language the reader is using. Comments whose language could not be
 * detected (null) offer it too; "und" means there is nothing to translate.
 */
export function needsTranslation(comment: BlogComment, appLocale: string) {
  return comment.language !== appLocale && comment.language !== "und";
}

interface CommentsSectionProps {
  postId: string;
  postAuthorId: string;
}

export function CommentsSection({ postId, postAuthorId }: CommentsSectionProps) {
  const t = useTranslations("Blog.comments");
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

function CommentForm({
  postId,
  queryKey,
}: {
  postId: string;
  queryKey: readonly unknown[];
}) {
  const t = useTranslations("Blog.comments");
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");

  const mutation = useMutation({
    mutationFn: () => addComment(postId, content.trim()),
    onSuccess: (comment) => {
      queryClient.setQueryData<BlogComment[]>(queryKey, (prev) => [
        ...(prev ?? []),
        comment,
      ]);
      setContent("");
      toast.success(t("posted"));
    },
    onError: (error) => toast.error(error.message),
  });

  const tooLong = content.length > MAX_LENGTH;

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        if (content.trim() && !tooLong) mutation.mutate();
      }}
    >
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={t("placeholder")}
        rows={3}
        aria-invalid={tooLong}
        disabled={mutation.isPending}
      />
      <div className="flex items-center justify-between gap-3">
        <span
          className={`text-xs ${tooLong ? "text-destructive" : "text-muted-foreground"}`}
        >
          {tooLong ? t("tooLong") : `${content.length}/${MAX_LENGTH}`}
        </span>
        <Button
          type="submit"
          size="sm"
          disabled={!content.trim() || tooLong || mutation.isPending}
        >
          {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mutation.isPending ? t("posting") : t("submit")}
        </Button>
      </div>
    </form>
  );
}

function CommentItem({
  comment,
  canDelete,
  queryKey,
}: {
  comment: BlogComment;
  canDelete: boolean;
  queryKey: readonly unknown[];
}) {
  const t = useTranslations("Blog.comments");
  const tLanguages = useTranslations("Blog.languages");
  const locale = useLocale();
  const queryClient = useQueryClient();
  const [translation, setTranslation] = useState<string | null>(null);
  const [showTranslation, setShowTranslation] = useState(false);

  const translate = useMutation({
    mutationFn: () => translateComment(comment.id, locale),
    onSuccess: (result) => {
      setTranslation(result.content);
      setShowTranslation(true);
    },
    onError: () => toast.error(t("translationFailed")),
  });

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

  const canTranslate = needsTranslation(comment, locale);
  const showingTranslation = showTranslation && translation !== null;

  const onTranslateClick = () => {
    if (showingTranslation) setShowTranslation(false);
    else if (translation !== null) setShowTranslation(true);
    else translate.mutate();
  };

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

      <p className="whitespace-pre-wrap break-words text-sm leading-6">
        {showingTranslation ? translation : comment.content}
      </p>

      {canTranslate && (
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Button
            variant="link"
            size="sm"
            className="h-auto px-0 text-xs"
            onClick={onTranslateClick}
            disabled={translate.isPending}
          >
            {translate.isPending ? (
              <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
            ) : (
              <Languages className="mr-1 h-3.5 w-3.5" />
            )}
            {translate.isPending
              ? t("translating")
              : showingTranslation
                ? t("showOriginal")
                : t("translate")}
          </Button>
          {showingTranslation && comment.language && (
            <span className="text-xs text-muted-foreground">
              {t("translatedFrom", {
                language: tLanguages.has(comment.language)
                  ? tLanguages(comment.language)
                  : languageName(comment.language, locale),
              })}
            </span>
          )}
        </div>
      )}
    </li>
  );
}
