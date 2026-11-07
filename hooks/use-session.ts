"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchSession } from "@/lib/api/auth";

export const sessionQueryKey = ["session"] as const;

export function useSession() {
  const { data, isLoading } = useQuery({
    queryKey: sessionQueryKey,
    queryFn: fetchSession,
    staleTime: 60 * 1000,
    retry: false,
  });

  return { user: data ?? null, isLoading };
}

export function useSignOut() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.setQueryData(sessionQueryKey, null);
    // Clears the app cookies, then the backend sign-in session, then returns here.
    const here = window.location.pathname + window.location.search;
    window.location.assign(
      `/api/auth/logout?redirect=${encodeURIComponent(here)}`,
    );
  };
}
