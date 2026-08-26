"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";

/**
 * Returns the current portal slug from the URL path.
 * URL structure: /[locale]/[portal]/...
 * Example: /vi/dashboard/properties → "dashboard"
 */
export function usePortalSlug(): string {
  const pathname = usePathname();
  return useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    // segments[0] = locale, segments[1] = portal
    return segments[1] ?? "dashboard";
  }, [pathname]);
}

/**
 * Returns a function that builds paths prefixed with the current portal slug.
 * Example: portalPath("/properties") → "/dashboard/properties"
 */
export function usePortalPath(): (path: string) => string {
  const slug = usePortalSlug();
  return useMemo(() => {
    return (path: string) => {
      if (!path.startsWith("/")) path = `/${path}`;
      return `/${slug}${path}`;
    };
  }, [slug]);
}
