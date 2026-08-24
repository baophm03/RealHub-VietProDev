"use client";

import { ability } from "@/config/casl/ability";
import { useEffect } from "react";
import { notFound } from "next/navigation";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const checkPermission = ability.can('READ', 'LEAD');

  useEffect(() => {
    if (!checkPermission) {
      return notFound();
    }
  }, [checkPermission]);

  return children;
}
