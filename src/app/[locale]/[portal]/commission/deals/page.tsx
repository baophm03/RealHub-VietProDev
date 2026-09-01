"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, MoreVertical, Eye, Trash2, Loader2 } from "lucide-react";
import { Can } from "@casl/react";
import { ability } from "@/config/casl/ability";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import {
  useGetApiDealCommissions,
  useDeleteApiDealCommissionId,
  getGetApiDealCommissionsQueryKey,
} from "@/lib/api/endpoints/commission";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogPortal,
  DialogOverlay,
} from "@/components/ui/dialog";
import { usePortalPath } from "@/lib/hooks/use-portal";
import type { ColumnDef } from "@tanstack/react-table";

interface DealCommissionRow {
  id: string;
  status: string;
  transactionValueEstimated: string | null;
  transactionValueConfirmed: string | null;
  totalCommissionEstimated: string | null;
  totalCommissionConfirmed: string | null;
  createdAt: string;
  plan?: { id: string; name: string };
  deal?: {
    id: string;
    dealCode: string;
    status: string;
    transactionType: string;
    expectedValue: string | null;
    finalValue: string | null;
    customer?: { id: string; fullName: string; phone: string };
    salesUser?: { id: string; fullName: string };
  };
  property?: {
    id: string;
    propertyCode: string;
    title: string;
    price: string | null;
    transactionType: string;
  };
}

const statusVariant: Record<string, "default" | "green" | "yellow" | "blue" | "red"> = {
  DRAFT: "default",
  ESTIMATED: "blue",
  CONFIRMED: "yellow",
  APPROVED: "green",
  PAID: "green",
  DISPUTED: "red",
  CANCELLED: "default",
};

const statusLabel: Record<string, string> = {
  DRAFT: "Nháp",
  ESTIMATED: "Đã ước tính",
  CONFIRMED: "Đã xác nhận",
  APPROVED: "Đã duyệt",
  PAID: "Đã thanh toán",
  DISPUTED: "Tranh chấp",
  CANCELLED: "Đã hủy",
};

const formatVnd = (v: string | null | undefined) => {
  if (!v) return "—";
  const n = Number(v);
  if (isNaN(n)) return v;
  return n.toLocaleString("vi-VN") + " ₫";
};

export default function DealCommissionsPage() {
  const router = useRouter();
  const portalPath = usePortalPath();
  const queryClient = useQueryClient();
  const [deleteTarget, setDeleteTarget] = useState<DealCommissionRow | null>(null);

  const canApprove = ability.can("APPROVE", "COMMISSION");

  const { data: dcsData, isLoading } = useGetApiDealCommissions({
    dealId: undefined,
    status: undefined,
  });
  const dcs = ((dcsData as unknown as { data: DealCommissionRow[] })?.data) || [];

  const { mutateAsync: deleteDc, isPending: isDeleting } = useDeleteApiDealCommissionId({
    mutation: {
      onSuccess: () => {
        toast.success("Đã xóa hoa hồng");
        queryClient.invalidateQueries({ queryKey: getGetApiDealCommissionsQueryKey() });
        setDeleteTarget(null);
      },
      onError: (err: any) => {
        const msg = err?.response?.data?.message?.[0] || "Không thể xóa";
        toast.error(msg);
      },
    },
  });

  const columns: ColumnDef<DealCommissionRow>[] = [
    {
      accessorKey: "deal.dealCode",
      header: "Giao dịch",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.original.deal?.dealCode ?? "—"}</span>
          {row.original.deal?.customer?.fullName && (
            <span className="text-xs text-foreground-muted">{row.original.deal.customer.fullName}</span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "property.title",
      header: "Bất động sản",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium line-clamp-1 max-w-[220px]">{row.original.property?.title ?? "—"}</span>
          <span className="text-xs text-foreground-muted tabular-nums">
            {row.original.property?.price ? formatVnd(row.original.property.price) : "—"}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "plan.name",
      header: "Kế hoạch",
      cell: ({ row }) => <span className="font-medium">{row.original.plan?.name ?? "—"}</span>,
    },
    {
      accessorKey: "totalCommissionEstimated",
      header: "Hoa hồng ước tính",
      cell: ({ row }) => <span className="tabular-nums text-sm">{formatVnd(row.original.totalCommissionEstimated)}</span>,
    },
    {
      accessorKey: "totalCommissionConfirmed",
      header: "Hoa hồng thực tế",
      cell: ({ row }) => <span className="tabular-nums text-sm font-medium text-primary">{formatVnd(row.original.totalCommissionConfirmed)}</span>,
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => <Badge variant={statusVariant[row.original.status] ?? "default"}>{statusLabel[row.original.status] ?? row.original.status}</Badge>,
    },
    {
      accessorKey: "createdAt",
      header: "Ngày tạo",
      cell: ({ row }) => <span className="tabular-nums text-xs text-foreground-muted">{new Date(row.original.createdAt).toLocaleDateString("vi-VN")}</span>,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const dc = row.original;
        // BE chỉ cho xóa khi không phải APPROVED/PAID
        const canDelete = canApprove && dc.status !== "APPROVED" && dc.status !== "PAID";
        if (!canDelete) return null;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  className="rounded-md p-1.5 text-foreground-muted transition-colors hover:bg-surface-muted"
                  aria-label="Thao tác"
                  onClick={(e: any) => e.stopPropagation()}
                />
              }
            >
              <MoreVertical size={14} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={(e: any) => {
                  e.stopPropagation();
                  router.push(portalPath(`/commission/deals/${dc.id}`));
                }}
              >
                <Eye size={14} />
                Xem chi tiết
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={(e: any) => {
                  e.stopPropagation();
                  setDeleteTarget(dc);
                }}
              >
                <Trash2 size={14} />
                Xóa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Hoa hồng"
        title="Ước tính hoa hồng"
        description="Danh sách ước tính hoa hồng theo giao dịch"
        actions={
          <Can I="CREATE" a="COMMISSION">
            <Button onClick={() => router.push(portalPath("/commission/deals/new"))}>
              <Plus size={16} />
              Tạo ước tính
            </Button>
          </Can>
        }
      />

      {isLoading ? (
        <div className="h-96 animate-pulse rounded-lg bg-surface-muted" />
      ) : dcs.length > 0 ? (
        <DataTable
          columns={columns}
          data={dcs}
          onRowClick={(row) => router.push(portalPath(`/commission/deals/${row.id}`))}
          emptyMessage="Không có hoa hồng nào"
        />
      ) : (
        <EmptyState
          icon={<Plus size={24} />}
          title="Chưa có ước tính hoa hồng"
          description="Tạo ước tính hoa hồng cho giao dịch để theo dõi và duyệt"
          action={
            <Can I="CREATE" a="COMMISSION">
              <Button onClick={() => router.push(portalPath("/commission/deals/new"))}>
                <Plus size={16} />
                Tạo ước tính
              </Button>
            </Can>
          }
        />
      )}

      {/* Delete confirm */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogPortal>
          <DialogOverlay />
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Xóa ước tính hoa hồng</DialogTitle>
              <DialogDescription>Hành động này không thể hoàn tác.</DialogDescription>
            </DialogHeader>
            {deleteTarget && (
              <div className="rounded-lg border border-border bg-surface-muted/40 p-4 text-sm">
                <p className="font-medium">{deleteTarget.property?.title ?? deleteTarget.deal?.dealCode ?? "Hoa hồng"}</p>
                <p className="mt-1 text-xs text-foreground-muted">
                  {deleteTarget.deal?.dealCode} · {statusLabel[deleteTarget.status] ?? deleteTarget.status} · {formatVnd(deleteTarget.totalCommissionEstimated)}
                </p>
              </div>
            )}
            <div className="rounded-lg bg-accent-red/20 px-4 py-3 text-sm text-accent-red-text">
              Chỉ xóa được hoa hồng chưa duyệt/chưa thanh toán. Bạn có chắc muốn xóa?
            </div>
            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={isDeleting}>
                Hủy
              </Button>
              <Button
                variant="destructive"
                onClick={async () => {
                  if (!deleteTarget) return;
                  await deleteDc({ id: deleteTarget.id });
                }}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Đang xóa...
                  </>
                ) : (
                  "Xóa"
                )}
              </Button>
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </div>
  );
}
