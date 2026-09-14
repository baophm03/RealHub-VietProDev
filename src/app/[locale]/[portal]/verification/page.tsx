"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePortalPath } from "@/lib/hooks/use-portal";
import { usePagination } from "@/lib/hooks/use-pagination";
import { formatPrice, formatLocationShort } from "@/utils";
import { Filter, ShieldCheck } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { PaginationBar } from "@/components/shared/pagination-bar";
import { PageHeader } from "@/components/shared/page-header";
import { useGetApiPropertiesAdmin } from "@/lib/api/endpoints/properties";
import { GetPropertiesResponse, Property } from "@/lib/api/types/properties";
import type { UpdatePropertyDtoVerificationStatus } from "@/lib/api/models";
import { VerificationActionDialog, type VerificationActionTarget } from "./_components/verification-action-dialog";
import { VerificationActions } from "./_components/verification-actions";

type VerificationStatus = UpdatePropertyDtoVerificationStatus;

const statusVariant: Record<
  VerificationStatus,
  "default" | "yellow" | "green" | "red" | "blue"
> = {
  DRAFT: "default",
  PENDING: "yellow",
  VERIFIED: "green",
  REJECTED: "red",
};

const statusLabel: Record<VerificationStatus, string> = {
  DRAFT: "Nháp",
  PENDING: "Chờ duyệt",
  VERIFIED: "Đã duyệt",
  REJECTED: "Từ chối",
};

const txLabel: Record<string, string> = {
  SALE: "Bán",
  RENT: "Cho thuê",
  TRANSFER: "Chuyển nhượng",
  INVESTMENT: "Đầu tư",
};

export default function VerificationPage() {
  const router = useRouter();
  const portalPath = usePortalPath();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<VerificationStatus | "ALL">(
    "PENDING",
  );

  const { data: allData } = useGetApiPropertiesAdmin();
  const allProperties = ((allData as unknown as GetPropertiesResponse)?.data) || [];

  const pagination = usePagination(10);
  const { data: filteredData, isLoading } = useGetApiPropertiesAdmin({
    verificationStatus:
      statusFilter !== "ALL" ? (statusFilter as VerificationStatus) : undefined,
    search: search || undefined,
    limit: pagination.limit,
    offset: pagination.offset,
  });

  const filtered = (((filteredData as unknown as GetPropertiesResponse)?.data) || []).filter(
    (p) => (p.verificationStatus ?? "DRAFT") !== "DRAFT",
  );
  const meta = (filteredData as unknown as GetPropertiesResponse)?.meta;
  const totalPages = meta?.totalPages ?? Math.max(1, Math.ceil((meta?.total ?? 0) / pagination.pageSize));

  const [pendingAction, setPendingAction] = useState<VerificationActionTarget | null>(null);

  const columns: ColumnDef<Property>[] = [
    {
      accessorKey: "propertyCode",
      header: "Mã BĐS",
      cell: ({ row }) => (
        <span className="font-mono text-xs tabular-nums">
          {row.original.propertyCode || row.original.id.slice(0, 8)}
        </span>
      ),
    },
    {
      accessorKey: "title",
      header: "Tên",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.title}</span>
      ),
    },
    {
      accessorKey: "transactionType",
      header: "Giao dịch",
      cell: ({ row }) => (
        <span className="text-sm text-foreground-muted">
          {txLabel[row.original.transactionType] ?? row.original.transactionType}
        </span>
      ),
    },
    {
      accessorKey: "price",
      header: "Giá",
      cell: ({ row }) => (
        <span className="tabular-nums font-medium">
          {formatPrice(Number(row.original.price || 0))}
        </span>
      ),
    },
    {
      id: "location",
      header: "Vị trí",
      cell: ({ row }) => (
        <span className="text-sm text-foreground-muted">
          {formatLocationShort(row.original)}
        </span>
      ),
    },
    {
      id: "verificationStatus",
      header: "Kiểm duyệt",
      cell: ({ row }) => {
        const vStatus = (row.original.verificationStatus ?? "DRAFT") as VerificationStatus;
        return (
          <Badge variant={statusVariant[vStatus]}>
            {statusLabel[vStatus] ?? vStatus}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Hành động",
      cell: ({ row }) => (
        <VerificationActions
          property={row.original}
          onPick={(t) =>
            setPendingAction({
              property: t.property,
              status: t.status,
              transitionId: t.transitionId,
            } as any)
          }
        />
      ),
    },
  ];

  const filterTabs: { value: VerificationStatus | "ALL"; label: string }[] = [
    { value: "ALL", label: "Tất cả" },
    { value: "PENDING", label: "Chờ duyệt" },
    { value: "VERIFIED", label: "Đã duyệt" },
    { value: "REJECTED", label: "Từ chối" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Kiểm duyệt"
        title="Duyệt bất động sản"
        description="Xác minh chủ nguồn & sản phẩm trước khi hiển thị public"
      />

      {/* Filter tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {filterTabs.map((tab) => {
          const count =
            tab.value === "ALL"
              ? allProperties.filter(
                (p) => (p.verificationStatus ?? "DRAFT") !== "DRAFT",
              ).length
              : allProperties.filter(
                (p) => (p.verificationStatus ?? "DRAFT") === tab.value,
              ).length;
          const active = statusFilter === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm transition-colors ${active
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-surface text-foreground-muted hover:bg-surface-muted"
                }`}
            >
              {tab.label}
              <span
                className={`rounded-full px-1.5 text-xs tabular-nums ${active
                  ? "bg-primary/20 text-primary"
                  : "bg-surface-muted text-foreground-muted"
                  }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="flex items-center gap-2">
        <Input
          type="search"
          placeholder="Tìm kiếm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-auto min-w-0"
        />
        <Button variant="outline" size="icon" aria-label="Bộ lọc" className="shrink-0">
          <Filter size={16} />
        </Button>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex h-40 items-center justify-center rounded-lg border border-border bg-surface-muted/30">
          <span className="text-sm text-foreground-muted">Đang tải...</span>
        </div>
      ) : filtered.length > 0 ? (
        <>
          <DataTable
            columns={columns}
            data={filtered}
            onRowClick={(row) => router.push(portalPath(`/properties/${row.id}`))}
            emptyMessage="Không tìm thấy bất động sản nào"
          />
          <PaginationBar
            pageSize={pagination.pageSize}
            setPageSize={pagination.setPageSize}
            currentPage={pagination.currentPage}
            setCurrentPage={pagination.setCurrentPage}
            totalPages={totalPages}
          />
        </>
      ) : (
        <EmptyState
          icon={<ShieldCheck size={24} />}
          title="Không có BĐS cần duyệt"
          description={
            statusFilter === "PENDING"
              ? "Hiện không có bất động sản nào đang chờ kiểm duyệt."
              : "Không có bất động sản nào phù hợp với bộ lọc."
          }
        />
      )}

      {/* Confirm dialog */}
      <VerificationActionDialog
        target={pendingAction}
        open={!!pendingAction}
        onOpenChange={(open) => !open && setPendingAction(null)}
      />
    </div>
  );
}
