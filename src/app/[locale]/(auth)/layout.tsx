"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth-store";
import { Spinner } from "@/components/ui/spinner";
import { useUserStore } from "@/lib/stores/user-store";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const hasHydrated = useAuthStore((s) => s._hasHydrated);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasUser = useUserStore((s) => !!s.user);

  const shouldRedirect = isAuthenticated && hasUser;

  useEffect(() => {
    if (!hasHydrated) return;
    if (shouldRedirect) router.push("/");
  }, [hasHydrated, shouldRedirect, router]);

  if (!hasHydrated || shouldRedirect) {
    return (
      <div className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-background px-4 py-12">
        <Spinner className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-background px-4 py-12">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 25%, var(--surface-muted) 0%, transparent 45%), radial-gradient(circle at 85% 75%, var(--surface-muted) 0%, transparent 50%)",
        }}
      />
      <div className="relative z-10 w-full max-w-md animate-fade-up">
        {children}
      </div>
    </div>
  );
}
