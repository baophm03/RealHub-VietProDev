"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Percent } from "@phosphor-icons/react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/shared/data-table";
import { useUserStore } from "@/lib/stores/user-store";
import { useGetApiCommissionPlans } from "@/lib/api/endpoints/commission";
import type { ColumnDef } from "@tanstack/react-table";

interface PlanRow {
  id: string;
  name: string;
  status: string;
  effectiveFrom: string;
  effectiveTo?: string;
  priority?: number;
}

const statusVariant: Record<string, "green" | "yellow" | "default" | "red"> = {
  ACTIVE: "green",
  PENDING_APPROVAL: "yellow",
  DRAFT: "default",
  ARCHIVED: "default",
};

const statusLabel: Record<string, string> = {
  ACTIVE: "Hoat dong",
  PENDING_APPROVAL: "Cho duyet",
  DRAFT: "Ban nhap",
  ARCHIVED: "Luu tru",
};

const calcTypeLabel: Record<string, string> = {
  PERCENT: "Theo %",
  FIXED: "Co dinh",
};

const calcBaseLabel: Record<string, string> = {
  EXPECTED_VALUE: "Gia tri du kien",
  ACTUAL_VALUE: "Gia tri thuc te",
  NET_VALUE: "Gia tri rong",
};

const columns: ColumnDef<PlanRow>[] = [
  { accessorKey: "name", header: "Ten ke hoach", cell: ({ row }) => <span className="font-medium">{row.original.name}</span> },
  { accessorKey: "priority", header: "Do uu tien", cell: ({ row }) => <span className="tabular-nums text-sm text-foreground-muted">{row.original.priority ?? "-"}</span> },
  { accessorKey: "status", header: "Trang thai", cell: ({ row }) => <Badge variant={statusVariant[row.original.status] ?? "default"}>{statusLabel[row.original.status] ?? row.original.status}</Badge> },
  { accessorKey: "effectiveFrom", header: "Ngay hieu luc", cell: ({ row }) => <span className="tabular-nums text-xs text-foreground-muted">{row.original.effectiveFrom ? new Date(row.original.effectiveFrom).toLocaleDateString("vi-VN") : "-"}</span> },
];

export default function CommissionPlansPage() {
  const router = useRouter();
  const hasPermission = useUserStore((s) => s.hasPermission);
  const [mounted, setMounted] = useState(false);

  const { data: plansData, isLoading } = useGetApiCommissionPlans({ status: "" });
  const plans = ((plansData as unknown as { data: PlanRow[] })?.data) || [];

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Hoa hong"
        title="Ke hoach hoa hong"
        description="Quan ly ke hoach hoa hong, quy tac va phan chia"
        actions={
          mounted && hasPermission("commission:write") && (
            <Button onClick={() => router.push("/commission/plans/new")}>
              <Plus size={16} />
              Them ke hoach
            </Button>
          )
        }
      />

      {isLoading ? (
        <div className="h-96 animate-pulse rounded-lg bg-surface-muted" />
      ) : (
        <DataTable
          columns={columns}
          data={plans}
          onRowClick={(row) => router.push(`/commission/plans/${row.id}`)}
        />
      )}
    </div>);
}

void Percent;
