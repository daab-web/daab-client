"use client";

import { useDeferredValue, useState } from "react";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ChevronLeft,
  ChevronRight,
  FlaskConical,
  Loader2,
  RefreshCw,
  Search,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AppUser, fetchUsers, setUserRole } from "@/lib/api/users";

const SCIENTIST = "scientist";
const PAGE_SIZE = 20;

export default function UsersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const deferredSearch = useDeferredValue(search);

  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ["users", deferredSearch, page],
    queryFn: () => fetchUsers(deferredSearch, page, PAGE_SIZE),
    placeholderData: keepPreviousData,
  });

  const toggle = useMutation({
    mutationFn: (user: AppUser) =>
      setUserRole(user.id, SCIENTIST, !user.roles.includes(SCIENTIST)),
    onSuccess: (result, user) => {
      const granted = result.roles.includes(SCIENTIST);
      toast.success(
        granted
          ? `${user.name} is now a scientist`
          : `${user.name} is no longer a scientist`,
        { description: "It applies from their next sign-in." },
      );
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (e) => toast.error(e.message),
  });

  const users = data?.items ?? [];
  const meta = data?.metadata;

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">
            Accounts created by Google sign-in, invitations or the register API.
          </p>
        </div>
        <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All users</CardTitle>
          <CardDescription>
            Scientists can write blog posts and see only the Blogs tab in this panel.
          </CardDescription>
          <InputGroup className="mt-2 max-w-sm">
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Search by name or e-mail"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </InputGroup>
        </CardHeader>
        <CardContent>
          {error ? (
            <Alert variant="destructive">
              <AlertTitle>Could not load users</AlertTitle>
              <AlertDescription>
                {error.message} — sign in with an admin account.
              </AlertDescription>
            </Alert>
          ) : isLoading ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading…
            </div>
          ) : users.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">No users found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Sign-in</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Scientist</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => {
                  const scientist = user.roles.includes(SCIENTIST);
                  const pending = toggle.isPending && toggle.variables?.id === user.id;
                  return (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {user.pictureUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element -- remote avatar from Google
                            <img
                              src={user.pictureUrl}
                              alt=""
                              className="h-8 w-8 rounded-full"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                              <UserRound className="h-4 w-4 text-muted-foreground" />
                            </span>
                          )}
                          <div className="min-w-0">
                            <div className="truncate font-medium">{user.name}</div>
                            <div className="truncate text-xs text-muted-foreground">
                              {user.email ?? user.username}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {user.providers.includes("google") && (
                            <Badge variant="outline">Google</Badge>
                          )}
                          {user.hasPassword && <Badge variant="outline">Password</Badge>}
                          {!user.hasPassword && user.providers.length === 0 && (
                            <Badge variant="secondary">Invite pending</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {user.roles.map((role) => (
                            <Badge key={role} variant={role === "admin" ? "default" : "secondary"}>
                              {role}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(user.createdAt).toLocaleDateString("en-GB", {
                          dateStyle: "medium",
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant={scientist ? "outline" : "default"}
                          disabled={pending}
                          onClick={() => toggle.mutate(user)}
                        >
                          {pending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <FlaskConical className="mr-2 h-4 w-4" />
                          )}
                          {scientist ? "Remove scientist" : "Make scientist"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}

          {meta && meta.totalPages > 1 && (
            <div className="mt-4 flex items-center justify-end gap-2">
              <span className="text-sm text-muted-foreground">
                Page {meta.currentPage} of {meta.totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                disabled={!meta.hasPreviousPage}
                onClick={() => setPage((p) => p - 1)}
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                disabled={!meta.hasNextPage}
                onClick={() => setPage((p) => p + 1)}
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
