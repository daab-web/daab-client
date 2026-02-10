"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import {
  ShieldAlert,
  ShieldX,
  FileQuestion,
  ServerCrash,
  AlertTriangle,
  Home,
  ArrowLeft,
} from "lucide-react";

export type ErrorType = "403" | "401" | "404" | "500" | "custom";

interface ErrorDisplayProps {
  type?: ErrorType;
  title?: string;
  message?: string;
  description?: string;
  showHomeButton?: boolean;
  showBackButton?: boolean;
  customActions?: React.ReactNode;
}

const ERROR_CONFIGS = {
  "403": {
    icon: ShieldX,
    title: "Access Forbidden",
    message: "You don't have permission to access this resource",
    description:
      "You are not authorized to view this page. Please contact your administrator if you believe this is an error.",
    variant: "destructive" as const,
  },
  "401": {
    icon: ShieldAlert,
    title: "Unauthorized",
    message: "Authentication required",
    description:
      "You need to sign in to access this page. Please log in with your credentials.",
    variant: "destructive" as const,
  },
  "404": {
    icon: FileQuestion,
    title: "Page Not Found",
    message: "The page you're looking for doesn't exist",
    description:
      "The page you are trying to access could not be found. It may have been moved or deleted.",
    variant: "default" as const,
  },
  "500": {
    icon: ServerCrash,
    title: "Server Error",
    message: "Something went wrong on our end",
    description:
      "An unexpected error occurred. Our team has been notified and is working to fix the issue.",
    variant: "destructive" as const,
  },
  custom: {
    icon: AlertTriangle,
    title: "Error",
    message: "An error occurred",
    description: "Please try again or contact support if the problem persists.",
    variant: "destructive" as const,
  },
};

export default function ErrorDisplay({
  type = "custom",
  title,
  message,
  description,
  showHomeButton = true,
  showBackButton = true,
  customActions,
}: ErrorDisplayProps) {
  const router = useRouter();
  const config = ERROR_CONFIGS[type];
  const Icon = config.icon;

  const finalTitle = title || config.title;
  const finalMessage = message || config.message;
  const finalDescription = description || config.description;

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <Icon className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-bold">{finalTitle}</CardTitle>
          <CardDescription className="text-base">
            {finalMessage}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant={config.variant}>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Details</AlertTitle>
            <AlertDescription>{finalDescription}</AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          {customActions ? (
            customActions
          ) : (
            <>
              {showBackButton && (
                <Button
                  variant="outline"
                  onClick={() => router.back()}
                  className="w-full sm:w-auto"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Go Back
                </Button>
              )}
              {showHomeButton && (
                <Button
                  onClick={() => router.push("/")}
                  className="w-full sm:w-auto"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Go Home
                </Button>
              )}
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
