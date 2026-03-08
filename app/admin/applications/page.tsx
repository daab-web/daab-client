"use client";

import { useState, useEffect } from "react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  BookOpen,
  Briefcase,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Application } from "@/types/application";
import { fetchApplications, approveApplication } from "@/lib/api/applications";
import { PagedResponse } from "@/types/paged-response";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [actionDialog, setActionDialog] = useState<{
    open: boolean;
    application: Application | null;
    action: "approve" | "reject" | null;
  }>({
    open: false,
    application: null,
    action: null,
  });

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response: PagedResponse<Application> = await fetchApplications(
        1,
        100,
      );
      setApplications(response.items);
    } catch (err) {
      setError("Failed to load applications");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const openActionDialog = (
    application: Application,
    action: "approve" | "reject",
  ) => {
    setActionDialog({ open: true, application, action });
  };

  const closeActionDialog = () => {
    setActionDialog({ open: false, application: null, action: null });
  };

  const confirmAction = async () => {
    if (!actionDialog.application) return;

    const { application, action } = actionDialog;
    setProcessingId(application.id);
    closeActionDialog();

    try {
      if (action === "approve") {
        await approveApplication(application.id);
        setApplications((prev) => prev.filter((a) => a.id !== application.id));
      } else {
        setApplications((prev) => prev.filter((a) => a.id !== application.id));
      }
    } catch (err) {
      setError(`Failed to ${action} application`);
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          Membership Applications
        </h1>
        <Button
          onClick={loadApplications}
          variant="outline"
          disabled={isLoading}
        >
          {isLoading ? <Spinner data-icon="inline-start" /> : "Refresh"}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Pending Applications</CardTitle>
          <CardDescription>
            Review and approve or reject membership applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Spinner />
              <span className="ml-2">Loading...</span>
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No pending applications
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {applications.map((application) => (
                <AccordionItem key={application.id} value={application.id}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <span className="font-semibold">
                        {application.name} {application.surname}
                      </span>
                      <Badge variant="secondary">
                        {application.academicTitle}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
                          <Mail className="h-5 w-5 mt-0.5 text-primary" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                              Email
                            </p>
                            <p className="text-sm font-semibold break-all">
                              {application.email}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
                          <Phone className="h-5 w-5 mt-0.5 text-primary" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                              Phone
                            </p>
                            <p className="text-sm font-semibold">
                              {application.phoneNumber}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
                          <MapPin className="h-5 w-5 mt-0.5 text-primary" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                              Location
                            </p>
                            <p className="text-sm font-semibold">
                              {application.city}, {application.residence}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
                          <Building2 className="h-5 w-5 mt-0.5 text-primary" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                              University
                            </p>
                            <p className="text-sm font-semibold">
                              {application.universityName}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
                          <BookOpen className="h-5 w-5 mt-0.5 text-primary" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                              Field of Study
                            </p>
                            <p className="text-sm font-semibold">
                              {application.fieldOfStudy}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
                          <BookOpen className="h-5 w-5 mt-0.5 text-primary" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                              Academic Degree
                            </p>
                            <p className="text-sm font-semibold">
                              {application.academicDegree}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
                          <Building2 className="h-5 w-5 mt-0.5 text-primary" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                              Alma Mater
                            </p>
                            <p className="text-sm font-semibold">
                              {application.almaMater}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
                          <Building2 className="h-5 w-5 mt-0.5 text-primary" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                              Degree Institution
                            </p>
                            <p className="text-sm font-semibold">
                              {application.degreeInstitution}
                            </p>
                          </div>
                        </div>

                        {application.jobPosition && (
                          <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
                            <Briefcase className="h-5 w-5 mt-0.5 text-primary" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                                Current Position
                              </p>
                              <p className="text-sm font-semibold">
                                {application.jobPosition}
                              </p>
                            </div>
                          </div>
                        )}

                        {application.previousJob && (
                          <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
                            <Briefcase className="h-5 w-5 mt-0.5 text-primary" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                                Previous Position
                              </p>
                              <p className="text-sm font-semibold">
                                {application.previousJob}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="p-4 rounded-lg border bg-card">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                          Contributions to DAAB
                        </p>
                        <p className="text-sm leading-relaxed text-foreground">
                          {application.contributionsToDaab}
                        </p>
                      </div>

                      {application.engagedScientistFields && (
                        <div className="p-4 rounded-lg border bg-card">
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                            Engaged Scientist Fields
                          </p>
                          <p className="text-sm leading-relaxed text-foreground">
                            {application.engagedScientistFields}
                          </p>
                        </div>
                      )}

                      {application.additionalInformation && (
                        <div className="p-4 rounded-lg border bg-card">
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                            Additional Information
                          </p>
                          <p className="text-sm leading-relaxed text-foreground">
                            {application.additionalInformation}
                          </p>
                        </div>
                      )}

                      {application.additionalInformationToShare && (
                        <div className="p-4 rounded-lg border bg-card">
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                            Additional Information to Share
                          </p>
                          <p className="text-sm leading-relaxed text-foreground">
                            {application.additionalInformationToShare}
                          </p>
                        </div>
                      )}

                      <div className="flex gap-2 pt-2">
                        <Button
                          onClick={() =>
                            openActionDialog(application, "approve")
                          }
                          variant="default"
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          disabled={processingId === application.id}
                        >
                          {processingId === application.id ? (
                            <>
                              <Spinner data-icon="inline-start" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve
                            </>
                          )}
                        </Button>
                        <Button
                          onClick={() =>
                            openActionDialog(application, "reject")
                          }
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          disabled={processingId === application.id}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
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

      <Dialog open={actionDialog.open} onOpenChange={closeActionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionDialog.action === "approve" ? "Approve" : "Reject"}{" "}
              Application
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to{" "}
              {actionDialog.action === "approve" ? "approve" : "reject"} the
              application from{" "}
              <span className="font-semibold">
                {actionDialog.application?.name}{" "}
                {actionDialog.application?.surname}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={closeActionDialog}>
              Cancel
            </Button>
            <Button
              variant={
                actionDialog.action === "approve" ? "default" : "destructive"
              }
              onClick={confirmAction}
              className={
                actionDialog.action === "approve"
                  ? "bg-green-600 hover:bg-green-700"
                  : ""
              }
            >
              {actionDialog.action === "approve" ? "Approve" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
