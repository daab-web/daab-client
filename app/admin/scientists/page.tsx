"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import {
  Pencil,
  Trash2,
  User,
  Building2,
  MapPin,
  BookOpen,
  Plus,
} from "lucide-react";
import { Scientist } from "@/types/scientist";
import { fetchScientists, deleteScientist } from "@/lib/api/scientists";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function ScientistsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [scientistToDelete, setScientistToDelete] = useState<Scientist | null>(
    null,
  );

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["scientists"],
    queryFn: async () => await fetchScientists(1, 100),
    staleTime: 0,
    refetchOnMount: "always",
  });
  const scientists = data?.items;

  const handleEdit = (scientistId: string) => {
    router.push(`/admin/scientists/${scientistId}/edit`);
  };

  const handleAdd = () => {
    router.push("/admin/scientists/new");
  };

  const openDeleteDialog = (scientist: Scientist) => {
    setScientistToDelete(scientist);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!scientistToDelete) return;

    setDeletingId(scientistToDelete.id);
    setDeleteDialogOpen(false);

    try {
      await deleteScientist(scientistToDelete.id);
      await queryClient.invalidateQueries({ queryKey: ["scientists"] });
    } catch (err) {
      console.error("Failed to delete scientist:", err);
    } finally {
      setDeletingId(null);
      setScientistToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setScientistToDelete(null);
  };

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Scientists List</h1>
        <div className="flex gap-2">
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add Scientist
          </Button>
          <Button
            onClick={() => refetch()}
            variant="outline"
            disabled={isLoading}
          >
            {isLoading ? <Spinner data-icon="inline-start" /> : "Refresh"}
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>{error.name}</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Scientists</CardTitle>
          <CardDescription>
            Manage scientists - edit and delete records
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Spinner />
              <span className="ml-2">Loading...</span>
            </div>
          ) : scientists?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No scientists found
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {scientists?.map((scientist) => (
                <AccordionItem key={scientist.id} value={scientist.id}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <span className="font-semibold">
                        {scientist.firstName} {scientist.lastName}
                      </span>
                      <Badge variant="secondary">
                        {scientist.academicTitle}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
                          <Building2 className="h-5 w-5 mt-0.5 text-primary" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                              Institution
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {scientist.institutions.map(
                                (institution, idx) => (
                                  <Badge key={idx} variant="secondary">
                                    {institution}
                                  </Badge>
                                ),
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
                          <User className="h-5 w-5 mt-0.5 text-primary" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                              Slug
                            </p>
                            <p className="text-sm font-mono font-semibold break-all">
                              {scientist.slug}
                            </p>
                          </div>
                        </div>

                        {scientist.countries.length > 0 && (
                          <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
                            <MapPin className="h-5 w-5 mt-0.5 text-primary" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                                Countries
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {scientist.countries.map((country, idx) => (
                                  <Badge key={idx} variant="secondary">
                                    {country}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {scientist.areas.length > 0 && (
                          <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
                            <BookOpen className="h-5 w-5 mt-0.5 text-primary" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                                Research Areas
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {scientist.areas.map((area, idx) => (
                                  <Badge key={idx} variant="secondary">
                                    {area}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button
                          onClick={() => handleEdit(scientist.id)}
                          variant="outline"
                          size="sm"
                        >
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          onClick={() => openDeleteDialog(scientist)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          disabled={deletingId === scientist.id}
                        >
                          {deletingId === scientist.id ? (
                            <>
                              <Spinner data-icon="inline-start" />
                              Deleting...
                            </>
                          ) : (
                            <>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Scientist</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold">
                {scientistToDelete?.firstName} {scientistToDelete?.lastName}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelDelete}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
