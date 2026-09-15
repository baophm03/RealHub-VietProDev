"use client"

import { useEffect } from "react";
import Link from "next/link";
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
    <div className="relative grid min-h-[100dvh] w-full lg:grid-cols-[1.05fr_1fr] xl:grid-cols-[1.1fr_1fr]">
      {/* ── Brand panel (desktop) ── */}
      <aside className="relative hidden overflow-hidden bg-foreground lg:flex lg:flex-col lg:justify-between lg:px-14 lg:py-14 xl:px-20 xl:py-16">
        {/* Texture / gradient decoration */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.10]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 18% 22%, rgba(74,139,95,0.55) 0%, transparent 42%), radial-gradient(circle at 82% 78%, rgba(247,246,243,0.10) 0%, transparent 48%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />

        {/* Wordmark */}
        <div className="relative z-10">
          <Link
            href="/"
            className="font-serif text-2xl font-semibold tracking-tight text-background"
          >
            RealHub
          </Link>
        </div>

        {/* Editorial tagline */}
        <div className="relative z-10 max-w-md">
          <p className="font-serif text-[2rem] leading-[1.15] tracking-tight text-background/95 xl:text-[2.5rem]">
            Hệ sinh thái Bất động sản{" "}
            <span className="italic text-accent-green/80">đa tenant</span> — kết nối toàn vòng đời.
          </p>
          <p className="mt-6 text-sm leading-relaxed text-background/55">
            Sản phẩm · Khách hàng · Lịch hẹn · Giao dịch · Hoa hồng
          </p>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-[11px] uppercase tracking-[0.18em] text-background/40">
          © {new Date().getFullYear()} RealHub
        </div>
      </aside>

      {/* ── Form panel ── */}
      <main className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-background px-4 py-10 sm:px-6 lg:min-h-0 lg:px-14 lg:py-16 xl:px-20">
        {/* Soft radial decoration */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 25%, var(--surface-muted) 0%, transparent 45%), radial-gradient(circle at 85% 75%, var(--surface-muted) 0%, transparent 50%)",
          }}
        />

        {/* Mobile wordmark */}
        <Link
          href="/"
          className="relative z-10 mb-8 font-serif text-2xl font-semibold tracking-tight lg:hidden"
        >
          RealHub
        </Link>

        <div className="relative z-10 flex w-full justify-center animate-fade-up">
          {children}
        </div>
      </main>
    </div>
  );
}
