"use client";

import { useAuthStore } from "@/lib/stores/auth-store";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const BYPASS_AUTH = true;

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (!BYPASS_AUTH && !isAuthenticated) {
      window.location.href = "/login";
    }
  }, [isAuthenticated]);

  if (!BYPASS_AUTH && !isAuthenticated) {
    return (
      <div className="flex flex-col gap-5">
        <Skeleton className="h-10 w-56" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-72 w-full" />
      </div>
    );
  }

  return <>{children}</>;
}
