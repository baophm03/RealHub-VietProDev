"use client";

import { useEffect, type ReactNode } from "react";
import { notFound, useRouter } from "next/navigation";
import { AuthGuard } from "@/components/shared/auth-guard";
import { useUserStore } from "@/lib/stores/user-store";
import { canAccessPortal, isValidPortalSlug, portalEntries } from "@/config/portal-entry";
import { AbilityProvider } from "@casl/react";
import { ability } from "@/config/casl/ability";
import { useAuthStore } from "@/lib/stores/auth-store";
import { use } from "react";
import { DashboardLayout } from "@/components/layout/portal/dashboard";
import { SalesPortalLayout } from "@/components/layout/portal/sales";
import { CustomerPortalLayout } from "@/components/layout/portal/customer";
import { OwnerPortalLayout } from "@/components/layout/portal/owner";

export default function PortalLayout({ children, params }: {
  children: ReactNode;
  params: Promise<{ locale: string; portal: string }>;
}) {
  const { portal } = use(params);
  const router = useRouter();
  const user = useUserStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const isValidPortal = isValidPortalSlug(portal);
  const hasPermission = isValidPortal && canAccessPortal(portal, user?.role?.code);

  useEffect(() => {
    if (!isValidPortal) {
      notFound();
      return;
    }
    if (!hasPermission && isAuthenticated) {
      notFound();
      return;
    }
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isValidPortal, hasPermission, isAuthenticated, router]);

  if (!isValidPortal || !hasPermission) return null;

  return (
    <AuthGuard>
      <AbilityProvider value={ability}>
        {
          portal === portalEntries["dashboard"].slug &&
          <DashboardLayout>{children}</DashboardLayout>
        }
        {
          portal === portalEntries["sales-portal"].slug &&
          <SalesPortalLayout>{children}</SalesPortalLayout>
        }
        {
          portal === portalEntries["customer-portal"].slug &&
          <CustomerPortalLayout>{children}</CustomerPortalLayout>
        }
        {
          portal === portalEntries["owner-portal"].slug &&
          <OwnerPortalLayout>{children}</OwnerPortalLayout>
        }
      </AbilityProvider>
    </AuthGuard>
  );
}
