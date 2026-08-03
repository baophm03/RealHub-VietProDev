"use client";

import { useAuthStore } from "@/lib/stores/auth-store";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasHydrated = useAuthStore((s) => s._hasHydrated);

  useEffect(() => {
    if (!isAuthenticated && hasHydrated) {
      window.location.href = "/login";
    }
  }, [isAuthenticated, hasHydrated]);

  if (!isAuthenticated || !hasHydrated) {
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
