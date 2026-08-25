"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { usePortalPath } from "@/lib/hooks/use-portal";
import {
  Building2,
  Filter,
  Plus,
  Send,
  Trash2,
} from "lucide-react";
import { formatPrice } from "@/utils";
import { Can } from "@casl/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import type { ColumnDef } from "@tanstack/react-table";
import { useGetApiPropertiesAdmin } from "@/lib/api/endpoints/properties";
import { GetPropertiesResponse, Property } from "@/lib/api/types/properties";
import { SubmitVerificationDialog } from "./_components/submit-verification-dialog";
import { DeletePropertyDialog } from "./_components/delete-property-dialog";

const statusVariant: Record<string, "green" | "yellow" | "red" | "blue" | "default"> = {
  AVAILABLE: "green",
  RESERVED: "yellow",
  SOLD: "red",
  RENTED: "blue",
  OFF_MARKET: "default",
};

const statusLabel: Record<string, string> = {
  AVAILABLE: "Sẵn có",
  RESERVED: "Đặt cọc",
  SOLD: "Đã bán",
  RENTED: "Đã thuê",
  OFF_MARKET: "Ngừng bán",
};

const txLabel: Record<string, string> = {
  SALE: "Bán",
  RENT: "Cho thuê",
  TRANSFER: "Chuyển nhượng",
  INVESTMENT: "Đầu tư",
};

const verificationStatusVariant: Record<
  string,
  "default" | "yellow" | "green" | "red"
> = {
  DRAFT: "default",
  PENDING: "yellow",
  VERIFIED: "green",
  REJECTED: "red",
};

const verificationStatusLabel: Record<string, string> = {
  DRAFT: "Nháp",
  PENDING: "Chờ duyệt",
  VERIFIED: "Đã duyệt",
  REJECTED: "Từ chối",
};

export default function PropertiesPage() {
  const router = useRouter();
  const portalPath = usePortalPath();
  const [search, setSearch] = useState("");
  const [pendingSubmit, setPendingSubmit] = useState<Property | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Property | null>(null);

  const { data: propertiesData, refetch } = useGetApiPropertiesAdmin();
  const properties = ((propertiesData as unknown as GetPropertiesResponse)?.data) || [];

  const filtered = useMemo(
    () =>
      properties.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase()),
      ),
    [properties, search],
  );

  const getVerificationStatus = (p: Property) =>
    (p.verificationStatus ?? "DRAFT") as
    | "DRAFT"
    | "PENDING"
    | "VERIFIED"
    | "REJECTED";

  const columns: ColumnDef<Property>[] = [
    {
      accessorKey: "propertyCode",
      header: "Mã BĐS",
      cell: ({ row }) => (
        <span className="font-mono text-xs tabular-nums">{row.original.propertyCode}</span>
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
        <span className="text-sm text-foreground-muted">{txLabel[row.original.transactionType] ?? row.original.transactionType}</span>
      ),
    },
    {
      accessorKey: "price",
      header: "Giá",
      cell: ({ row }) => (
        <span className="tabular-nums font-medium">{formatPrice(Number(row.original.price || 0))}</span>
      ),
    },
    {
      accessorKey: "area",
      header: "Diện tích",
      cell: ({ row }) => (
        <span className="tabular-nums text-foreground-muted">{row.original.area ?? "-"} m²</span>
      ),
    },
    {
      accessorKey: "address",
      header: "Vị trí",
      cell: ({ row }) => (
        <span className="text-sm text-foreground-muted">{row.original.address ?? "-"}</span>
      ),
    },
    {
      id: "verificationStatus",
      header: "Duyệt",
      cell: ({ row }) => {
        const vStatus = getVerificationStatus(row.original);
        return (
          <Badge variant={verificationStatusVariant[vStatus] ?? "default"}>
            {verificationStatusLabel[vStatus] ?? vStatus}
          </Badge>
        );
      },
    },
    {
      accessorKey: "businessStatus",
      header: "Trạng thái",
      cell: ({ row }) => (
        <Badge variant={statusVariant[row.original.businessStatus ?? ""] ?? "default"}>
          {statusLabel[row.original.businessStatus ?? ""] ?? row.original.businessStatus}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Hành động",
      cell: ({ row }) => {
        const vStatus = getVerificationStatus(row.original);
        const canSubmit = vStatus === "DRAFT" || vStatus === "REJECTED";
        return (
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-start gap-2"
          >
            {canSubmit ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPendingSubmit(row.original)}
              >
                <Send size={14} />
                Gửi duyệt
              </Button>
            ) : null}
            <Can I="DELETE_OWN" a="PROPERTY">
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Xóa"
                onClick={() => setPendingDelete(row.original)}
              >
                <Trash2 size={14} className="text-destructive" />
              </Button>
            </Can>
          </div>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Bất động sản"
        title="Quản lý bất động sản"
        description="Quản lý toàn bộ bất động sản trong hệ thống"
      />

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
          <div className="flex items-center gap-2">
            <Can I="CREATE" a="PROPERTY">
              <Button onClick={() => router.push(portalPath("/properties/new"))}>
                <Plus size={16} />
                Thêm mới
              </Button>
            </Can>
          </div>
        </div>

        {filtered.length > 0 ? (
          <DataTable
            columns={columns}
            data={filtered}
            onRowClick={(row) => router.push(portalPath(`/properties/${row.id}`))}
            emptyMessage="Không tìm thấy bất động sản nào"
          />
        ) : (
          <EmptyState
            icon={<Building2 size={24} />}
            title="Chưa có bất động sản"
            description="Tạo bất động sản đầu tiên để bắt đầu bán hàng"
            action={
              <Can I="CREATE" a="PROPERTY">
                <Button onClick={() => router.push(portalPath("/properties/new"))}>
                  <Plus size={16} />
                  Thêm mới
                </Button>
              </Can>
            }
          />
        )}
      </div>

      <SubmitVerificationDialog
        property={pendingSubmit}
        open={!!pendingSubmit}
        onOpenChange={(open) => !open && setPendingSubmit(null)}
        onRefresh={refetch}
      />
      <DeletePropertyDialog
        property={pendingDelete}
        open={!!pendingDelete}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        onRefresh={refetch}
      />
    </div>
  );
}
