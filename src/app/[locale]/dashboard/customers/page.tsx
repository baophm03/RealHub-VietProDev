"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Filter, Plus, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogPortal,
  DialogOverlay,
} from "@/components/ui/dialog";
import {
  useGetApiCustomers,
  useDeleteApiCustomer,
} from "@/lib/api/endpoints/customers";
import type { ColumnDef } from "@tanstack/react-table";
import type { GetApiCustomersType } from "@/lib/api/models/getApiCustomersType";
import type { GetApiCustomersStatus } from "@/lib/api/models/getApiCustomersStatus";
import { Can } from '@casl/react';

interface CustomerType {
  id: string;
  type: string;
}

interface CustomerRow {
  id: string;
  fullName: string;
  phone?: string;
  email?: string;
  status: string;
  types: CustomerType[];
  _count?: { leads: number; needs: number };
  createdAt: string;
}

interface CustomersResponse {
  success: boolean;
  data: CustomerRow[];
  meta: {
    total: number;
    limit: number;
    offset: number;
    page: number;
    totalPages: number;
  };
  timestamp: string;
}

const typeLabel: Record<string, string> = {
  BUYER: "Người mua",
  SELLER: "Người bán",
  TENANT: "Người thuê",
  LANDLORD: "Cho thuê",
  INVESTOR: "Nhà đầu tư",
};

const statusLabel: Record<string, { label: string; variant: "green" | "default" | "red" }> = {
  ACTIVE: { label: "Hoạt động", variant: "green" },
  INACTIVE: { label: "Không hoạt động", variant: "default" },
  BLACKLISTED: { label: "Blacklist", variant: "red" },
};

const typeFilters: { value: GetApiCustomersType | "ALL"; label: string }[] = [
  { value: "ALL", label: "Tất cả loại" },
  { value: "BUYER", label: "Người mua" },
  { value: "SELLER", label: "Người bán" },
  { value: "RENTER", label: "Người thuê" },
  { value: "LANDLORD", label: "Cho thuê" },
  { value: "INVESTOR", label: "Nhà đầu tư" },
];

const statusFilters: { value: GetApiCustomersStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "Tất cả trạng thái" },
  { value: "ACTIVE", label: "Hoạt động" },
  { value: "INACTIVE", label: "Không hoạt động" },
  { value: "BLACKLISTED", label: "Blacklist" },
];

export default function CustomersPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<GetApiCustomersType | "ALL">("ALL");
  const [statusFilter, setStatusFilter] = useState<GetApiCustomersStatus | "ALL">("ALL");
  const [deleteTarget, setDeleteTarget] = useState<CustomerRow | null>(null);

  const { data: customersData, isLoading, refetch } = useGetApiCustomers({
    search: search.trim() || undefined,
    type: typeFilter === "ALL" ? undefined : (typeFilter as GetApiCustomersType),
    status: statusFilter === "ALL" ? undefined : (statusFilter as GetApiCustomersStatus),
    limit: "50",
    offset: "0",
  });
  const customers = ((customersData as unknown as CustomersResponse)?.data) || [];

  const { mutateAsync: deleteCustomer, isPending: isDeleting } = useDeleteApiCustomer();

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteCustomer({ id: deleteTarget.id });
      toast.success(`Đã xóa khách hàng "${deleteTarget.fullName}"`);
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      toast.error("Xóa khách hàng thất bại");
      console.error(err);
    }
  };

  const columns = useMemo<ColumnDef<CustomerRow>[]>(
    () => [
      {
        accessorKey: "fullName",
        header: "Khách hàng",
        cell: ({ row }) => (
          <div className="flex flex-col gap-0.5">
            <span className="font-medium">{row.original.fullName}</span>
            {row.original.email && (
              <span className="text-xs text-foreground-muted truncate max-w-[180px]">
                {row.original.email}
              </span>
            )}
          </div>
        ),
      },
      {
        accessorKey: "phone",
        header: "Điện thoại",
        cell: ({ row }) => (
          <span className="tabular-nums text-foreground-muted">{row.original.phone || "—"}</span>
        ),
      },
      {
        id: "types",
        header: "Loại",
        cell: ({ row }) => {
          const types = row.original.types || [];
          if (types.length === 0) return <span className="text-foreground-muted">—</span>;
          return (
            <div className="flex flex-wrap gap-1">
              {types.map((t) => (
                <Badge key={t.id} variant="blue">
                  {typeLabel[t.type] ?? t.type}
                </Badge>
              ))}
            </div>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Trạng thái",
        cell: ({ row }) => {
          const cfg = statusLabel[row.original.status] ?? { label: row.original.status, variant: "default" as const };
          return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
        },
      },
      {
        id: "stats",
        header: "Leads / Nhu cầu",
        cell: ({ row }) => {
          const count = row.original._count;
          if (!count) return <span className="text-foreground-muted">—</span>;
          return (
            <span className="text-xs tabular-nums text-foreground-muted">
              {count.leads} / {count.needs}
            </span>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: "Ngày tạo",
        cell: ({ row }) => (
          <span className="tabular-nums text-foreground-muted text-xs">
            {row.original.createdAt
              ? new Date(row.original.createdAt).toLocaleDateString("vi-VN")
              : "—"}
          </span>
        ),
      },
      {
        id: "actions",
        header: "Thao tác",
        cell: ({ row }) => (
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <Can I="DELETE" a="CUSTOMER">
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Xóa"
                onClick={() => setDeleteTarget(row.original)}
              >
                <Trash2 size={14} />
              </Button>
            </Can>
          </div>
        ),
      },
    ],
    [],
  );

  const totalCount = (customersData as unknown as CustomersResponse)?.meta?.total ?? customers.length;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="CRM"
        title="Khách hàng"
        description="Quản lý danh sách khách hàng"
        actions={
          <Can I="CREATE" a="CUSTOMER">
            <Button onClick={() => router.push("/dashboard/customers/new")}>
              <Plus size={16} />
              Thêm khách hàng
            </Button>
          </Can>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Input
            type="search"
            placeholder="Tìm theo tên, SĐT, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-auto min-w-0 sm:min-w-[260px]"
          />
          <Button variant="outline" size="icon" aria-label="Bộ lọc" className="shrink-0">
            <Filter size={16} />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as GetApiCustomersType | "ALL")}
            className="h-9 rounded-md border border-border bg-surface px-3 text-sm text-foreground outline-none focus:border-ring"
          >
            {typeFilters.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as GetApiCustomersStatus | "ALL")}
            className="h-9 rounded-md border border-border bg-surface px-3 text-sm text-foreground outline-none focus:border-ring"
          >
            {statusFilters.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="h-96 animate-pulse rounded-lg bg-surface-muted" />
      ) : customers.length > 0 ? (
        <>
          <div className="text-xs text-foreground-muted">{totalCount} khách hàng</div>
          <DataTable
            columns={columns}
            data={customers}
            onRowClick={(row) => router.push(`/dashboard/customers/${row.id}`)}
            emptyMessage="Không có khách hàng"
          />
        </>
      ) : (
        <EmptyState
          icon={<Users size={24} />}
          title="Chưa có khách hàng"
          description="Thêm khách hàng đầu tiên để bắt đầu quản lý CRM"
          action={
            <Can I="CREATE" a="CUSTOMER">
              <Button onClick={() => router.push("/dashboard/customers/new")}>
                <Plus size={16} />
                Thêm khách hàng
              </Button>
            </Can>
          }
        />
      )}

      {/* Delete confirmation dialog */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogPortal>
          <DialogOverlay />
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Xóa khách hàng</DialogTitle>
              <DialogDescription>
                Hành động này sẽ ẩn khách hàng (soft delete). Bạn có chắc chắn?
              </DialogDescription>
            </DialogHeader>
            {deleteTarget && (
              <div className="rounded-lg border border-border bg-surface-muted/40 p-4 text-sm">
                <p className="font-medium">{deleteTarget.fullName}</p>
                {deleteTarget.phone && (
                  <p className="text-foreground-muted tabular-nums">{deleteTarget.phone}</p>
                )}
              </div>
            )}
            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" onClick={() => setDeleteTarget(null)}>
                Hủy
              </Button>
              <Can I="DELETE" a="CUSTOMER">
                <Button
                  variant="destructive"
                  disabled={isDeleting}
                  onClick={handleDelete}
                >
                  {isDeleting ? "Đang xóa..." : "Xóa"}
                </Button>
              </Can>
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </div>
  );
}
