"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AlertCircle, Plus, RefreshCw, Trash2, UserRound } from "lucide-react";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import {
  createDirector,
  deleteDirector,
  fetchDirectors,
} from "@/lib/api/directors";
import { fetchScientists } from "@/lib/api/scientists";
import { Director } from "@/types/director";

export default function DirectorsPage() {
  const queryClient = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Director | null>(null);
  const [selectedScientistId, setSelectedScientistId] = useState("");
  const [scientistInputValue, setScientistInputValue] = useState("");
  const [enRole, setEnRole] = useState("");

  const {
    data: directors = [],
    isLoading: directorsLoading,
    error: directorsError,
    refetch: refetchDirectors,
    isRefetching: directorsRefetching,
  } = useQuery({
    queryKey: ["directors"],
    queryFn: () => fetchDirectors("en"),
  });

  const {
    data: scientistsResponse,
    isLoading: scientistsLoading,
    error: scientistsError,
  } = useQuery({
    queryKey: ["scientists", "director-assignment"],
    queryFn: async () => fetchScientists("en", 1, 1000),
  });

  const assignedScientistIds = useMemo(
    () =>
      new Set(
        directors
          .map((director) => director.scientistId)
          .filter((scientistId): scientistId is string => Boolean(scientistId)),
      ),
    [directors],
  );

  const availableScientists = useMemo(() => {
    const scientists = scientistsResponse?.items ?? [];

    return scientists.filter(
      (scientist) => !assignedScientistIds.has(scientist.id),
    );
  }, [assignedScientistIds, scientistsResponse?.items]);

  const createMutation = useMutation({
    mutationFn: createDirector,
    onSuccess: async () => {
      toast.success("Director assigned successfully");
      setCreateOpen(false);
      setSelectedScientistId("");
      setScientistInputValue("");
      setEnRole("");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["directors"] }),
        queryClient.invalidateQueries({
          queryKey: ["scientists", "director-assignment"],
        }),
      ]);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Could not assign director");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDirector,
    onSuccess: async () => {
      toast.success("Director removed");
      setDeleteTarget(null);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["directors"] }),
        queryClient.invalidateQueries({
          queryKey: ["scientists", "director-assignment"],
        }),
      ]);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Could not remove director");
    },
  });

  const handleCreate = async () => {
    if (!selectedScientistId || !enRole.trim()) {
      toast.error("Choose a scientist and enter English role");
      return;
    }

    await createMutation.mutateAsync({
      scientistId: selectedScientistId,
      enRole: enRole.trim(),
    });
  };

  const resetCreateDialog = (open: boolean) => {
    setCreateOpen(open);

    if (!open && !createMutation.isPending) {
      setSelectedScientistId("");
      setScientistInputValue("");
      setEnRole("");
    }
  };

  const selectedScientist = availableScientists.find(
    (scientist) => scientist.id === selectedScientistId,
  );

  const getScientistLabel = (scientist: {
    id: string;
    academicTitle?: string | null;
    firstName: string;
    lastName: string;
  }) => {
    return [scientist.academicTitle, scientist.firstName, scientist.lastName]
      .filter(Boolean)
      .join(" ");
  };

  return (
    <div className="flex-1 space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Directors</h1>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => resetCreateDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Assign Director
          </Button>
          <Button
            variant="outline"
            onClick={() => refetchDirectors()}
            disabled={directorsLoading || directorsRefetching}
          >
            {directorsLoading || directorsRefetching ? (
              <Spinner data-icon="inline-start" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Refresh
          </Button>
        </div>
      </div>

      {(directorsError || scientistsError) && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Could not load data</AlertTitle>
          <AlertDescription>
            {directorsError instanceof Error
              ? directorsError.message
              : scientistsError instanceof Error
                ? scientistsError.message
                : "Something went wrong while loading directors."}
          </AlertDescription>
        </Alert>
      )}

      <CardContent>
        {directorsLoading ? (
          <div className="flex items-center justify-center py-8">
            <Spinner />
            <span className="ml-2">Loading directors...</span>
          </div>
        ) : directors.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            No directors found
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Director</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Academic Title</TableHead>
                  <TableHead>Countries</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {directors.map((director) => {
                  const isDeleting =
                    deleteMutation.isPending &&
                    deleteMutation.variables === director.id;

                  return (
                    <TableRow key={director.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <DirectorAvatar director={director} />
                          <div className="min-w-0">
                            <div className="font-medium">
                              {director.firstName} {director.lastName}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {director.scientistId ?? "No linked scientist id"}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{director.role}</Badge>
                      </TableCell>
                      <TableCell>{director.academicTitle || "-"}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {director.countries.length > 0 ? (
                            director.countries.map((country) => (
                              <Badge
                                key={`${director.id}-${country}`}
                                variant="outline"
                              >
                                {country}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              -
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => setDeleteTarget(director)}
                          disabled={isDeleting}
                        >
                          {isDeleting ? (
                            <>
                              <Spinner data-icon="inline-start" />
                              Removing...
                            </>
                          ) : (
                            <>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Remove
                            </>
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      <Dialog open={createOpen} onOpenChange={resetCreateDialog}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Assign Director</DialogTitle>
            <DialogDescription>
              Select a scientist from the current list and assign a director
              role.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="director-scientist">Scientist</Label>
              <Combobox
                items={availableScientists}
                value={selectedScientist ?? null}
                inputValue={scientistInputValue}
                itemToStringLabel={getScientistLabel}
                itemToStringValue={(scientist) => scientist.id}
                onValueChange={(scientist) => {
                  setSelectedScientistId(scientist?.id ?? "");
                  setScientistInputValue(
                    scientist ? getScientistLabel(scientist) : "",
                  );
                }}
                onInputValueChange={(value, eventDetails) => {
                  setScientistInputValue(value);

                  if (eventDetails.reason === "input-clear") {
                    setSelectedScientistId("");
                  }
                }}
                disabled={scientistsLoading || createMutation.isPending}
              >
                <ComboboxInput
                  id="director-scientist"
                  className="w-full"
                  placeholder={
                    scientistsLoading
                      ? "Loading scientists..."
                      : availableScientists.length === 0
                        ? "No available scientists"
                        : "Type a name or academic title"
                  }
                  showClear
                  disabled={scientistsLoading || createMutation.isPending}
                />
                <ComboboxContent portalled={false}>
                  <ComboboxEmpty>No available scientists</ComboboxEmpty>
                  <ComboboxList>
                    {(scientist) => (
                      <ComboboxItem key={scientist.id} value={scientist}>
                        {getScientistLabel(scientist)}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
              {selectedScientist && (
                <p className="text-xs text-muted-foreground">
                  Selected: {getScientistLabel(selectedScientist)}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="director-en-role">
                Role (English) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="director-en-role"
                placeholder="Enter director role in English"
                value={enRole}
                onChange={(event) => setEnRole(event.target.value)}
                disabled={createMutation.isPending}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => resetCreateDialog(false)}
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={createMutation.isPending}>
              {createMutation.isPending ? (
                <>
                  <Spinner data-icon="inline-start" />
                  Assigning...
                </>
              ) : (
                "Assign Director"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open && !deleteMutation.isPending) {
            setDeleteTarget(null);
          }
        }}
      >
        <DialogContent
          className="sm:max-w-md"
          showCloseButton={!deleteMutation.isPending}
        >
          <DialogHeader>
            <DialogTitle>Remove Director</DialogTitle>
            <DialogDescription>
              {deleteTarget ? (
                <>
                  Remove{" "}
                  <span className="font-semibold">
                    {deleteTarget.firstName} {deleteTarget.lastName}
                  </span>{" "}
                  from directors? This will delete the director assignment.
                </>
              ) : (
                "This will delete the director assignment."
              )}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                deleteTarget && deleteMutation.mutate(deleteTarget.id)
              }
              disabled={deleteMutation.isPending || !deleteTarget}
            >
              {deleteMutation.isPending ? (
                <>
                  <Spinner data-icon="inline-start" />
                  Removing...
                </>
              ) : (
                "Remove"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DirectorAvatar({ director }: { director: Director }) {
  const fullName = `${director.firstName} ${director.lastName}`.trim();
  const initials =
    `${director.firstName?.[0] ?? ""}${director.lastName?.[0] ?? ""}`.toUpperCase();

  if (director.profilePictureUrl) {
    return (
      <div className="relative h-10 w-10 overflow-hidden rounded-full border bg-muted">
        <img
          src={director.profilePictureUrl}
          alt={fullName}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-muted text-xs font-semibold text-muted-foreground">
      {initials || <UserRound className="h-4 w-4" />}
    </div>
  );
}
