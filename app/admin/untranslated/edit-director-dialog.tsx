"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupButton,
} from "@/components/ui/input-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { toast } from "sonner";
import { updateDirector } from "@/lib/api/directors";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GlobeIcon } from "lucide-react";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";

export interface EditDirectorDialogProps {
  directorId: string;
  slug: string;
}

export default function EditDirectorDialog({ directorId, slug }: EditDirectorDialogProps) {
  const queryClient = useQueryClient();

  const [locale, setLocale] = useState<string>("en");
  const [editOpen, setEditOpen] = useState<boolean>(false)
  const [role, setRole] = useState("");

  const updateMutation = useMutation({
    mutationFn: updateDirector,
    onSuccess: async () => {
      toast.success("Director updated");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["directors"] }),
        queryClient.invalidateQueries({
          queryKey: ["scientists", "director-assignment"],
        }),
      ]);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Could not update director");
    },
  });

  const handleUpdate = async () => {
    if (!directorId || !role.trim()) {
      toast.error("Choose a director and enter a role");
      return;
    }

    await updateMutation.mutateAsync({
      directorId: directorId,
      locale: locale,
      role: role,
    });
  };

  return (
    <>
      <span
        className="font-medium text-primary hover:underline cursor-default"
        onClick={() => setEditOpen(true)}
      >
        {directorId}
      </span>
      <Dialog open={editOpen} onOpenChange={() => setEditOpen(false)}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>
              Editing Director:{" "}
              {slug}
            </DialogTitle>
            <DialogDescription>
              Update director's role for selected locale
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="director-role">Enter role</Label>
              <InputGroup>
                <InputGroupInput
                  id="director-role"
                  placeholder="Role"
                  value={role}
                  onChange={(event) => setRole(event.target.value)}
                  disabled={updateMutation.isPending}
                />
                <InputGroupAddon align="inline-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <InputGroupButton
                        variant="ghost"
                        className="pr-1.5! text-xs"
                      >
                        {locale} <GlobeIcon className="size-3" />
                      </InputGroupButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="[--radius:0.95rem]"
                    >
                      <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => setLocale("en")}>
                          EN
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setLocale("az")}>
                          AZ
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </InputGroupAddon>
              </InputGroup>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditOpen(false)}
              disabled={updateMutation.isPending}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? (
                <>
                  <Spinner data-icon="inline-start" />
                  Updating...
                </>
              ) : (
                "Update Director"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
