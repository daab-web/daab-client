"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Check, Copy, MailPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { inviteScientist, ScientistInvitation } from "@/lib/api/invitations";
import { Scientist } from "@/types/scientist";

/**
 * Creates the scientist's sign-in account and shows a one-time link to send them,
 * which lets them set their own password.
 */
export function InviteScientistButton({ scientist }: { scientist: Scientist }) {
  const [result, setResult] = useState<ScientistInvitation | null>(null);
  const [copied, setCopied] = useState(false);

  const invite = useMutation({
    mutationFn: () => inviteScientist(scientist.id),
    onSuccess: (data) => {
      setCopied(false);
      setResult(data);
    },
    onError: (error) => toast.error(error.message),
  });

  const copy = async () => {
    if (!result?.inviteUrl) return;
    await navigator.clipboard.writeText(result.inviteUrl);
    setCopied(true);
    toast.success("Invitation link copied");
  };

  const name = `${scientist.firstName} ${scientist.lastName}`.trim();

  return (
    <>
      <Button
        onClick={() => invite.mutate()}
        variant="outline"
        size="sm"
        disabled={invite.isPending}
      >
        {invite.isPending ? (
          <Spinner data-icon="inline-start" />
        ) : (
          <MailPlus className="h-4 w-4 mr-2" />
        )}
        Invite to sign in
      </Button>

      <Dialog open={!!result} onOpenChange={(open) => !open && setResult(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {result?.status === "active"
                ? "Account already active"
                : "Invitation created"}
            </DialogTitle>
            <DialogDescription>
              {result?.status === "active" ? (
                <>
                  <span className="font-semibold">{name}</span> already has an
                  account and can sign in as{" "}
                  <span className="font-semibold">{result?.email}</span>.
                </>
              ) : (
                <>
                  Send this link to <span className="font-semibold">{name}</span>{" "}
                  ({result?.email}). It lets them set a password and sign in
                  as a scientist.
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          {result?.inviteUrl && (
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input value={result.inviteUrl} readOnly className="font-mono text-xs" />
                <Button onClick={copy} variant="outline" size="icon" aria-label="Copy link">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <Alert>
                <AlertTitle>One-time link</AlertTitle>
                <AlertDescription>
                  It works once and expires on{" "}
                  {result.expiresAt
                    ? new Date(result.expiresAt).toLocaleString("en-GB")
                    : "—"}
                  . Inviting again replaces it.
                </AlertDescription>
              </Alert>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setResult(null)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
