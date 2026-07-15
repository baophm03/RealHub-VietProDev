"use client";

import { useRouter } from "next/navigation";
import { Plus, Percent } from "@phosphor-icons/react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/shared/data-table";
import { useAuthStore } from "@/lib/stores/auth-store";
import type { ColumnDef } from "@tanstack/react-table";

interface PlanRow {
  id: string;
  name: string;
  calculationType: string;
  calculationBase: string;
  status: string;
  effectiveDate: string;
}

const mockPlans: PlanRow[] = [
  { id: "1", name: "Hoa hong ban nha dat - 2025", calculationType: "PERCENT", calculationBase: "ACTUAL_VALUE", status: "ACTIVE", effectiveDate: "2025-01-01" },
  { id: "2", name: "Hoa hong cho thue - Q3", calculationType: "PERCENT", calculationBase: "EXPECTED_VALUE", status: "PENDING_APPROVAL", effectiveDate: "2025-07-01" },
  { id: "3", name: "Hoa hong CTV - 2025", calculationType: "FIXED", calculationBase: "NET_VALUE", status: "ACTIVE", effectiveDate: "2025-01-01" },
  { id: "4", name: "Hoa hong cu nam 2024", calculationType: "PERCENT", calculationBase: "ACTUAL_VALUE", status: "ARCHIVED", effectiveDate: "2024-01-01" },
];

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
  { accessorKey: "calculationType", header: "Loai tinh", cell: ({ row }) => <span className="text-sm text-foreground-muted">{calcTypeLabel[row.original.calculationType]}</span> },
  { accessorKey: "calculationBase", header: "Co so tinh", cell: ({ row }) => <span className="text-sm text-foreground-muted">{calcBaseLabel[row.original.calculationBase]}</span> },
  { accessorKey: "status", header: "Trang thai", cell: ({ row }) => <Badge variant={statusVariant[row.original.status] ?? "default"}>{statusLabel[row.original.status] ?? row.original.status}</Badge> },
  { accessorKey: "effectiveDate", header: "Ngay hieu luc", cell: ({ row }) => <span className="tabular-nums text-xs text-foreground-muted">{row.original.effectiveDate}</span> },
];

export default function CommissionPlansPage() {
  const router = useRouter();
  const hasPermission = useAuthStore((s) => s.hasPermission);

  return (
          <div className="flex flex-col gap-6">
        <PageHeader
          eyebrow="Hoa hong"
          title="Ke hoach hoa hong"
          description="Quan ly ke hoach hoa hong, quy tac va phan chia"
          actions={
            hasPermission("commission:write") && (
              <Button onClick={() => router.push("/commission/plans/new")}>
                <Plus size={16} />
                Them ke hoach
              </Button>
            )
          }
        />

        <DataTable
          columns={columns}
          data={mockPlans}
          onRowClick={(row) => router.push(`/commission/plans/${row.id}`)}
        />
      </div>  );
}

void Percent;
