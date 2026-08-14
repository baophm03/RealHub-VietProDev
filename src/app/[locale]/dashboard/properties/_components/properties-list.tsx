"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, MapTrifold, List as ListIcon, Funnel, Buildings, PaperPlaneTilt, Trash } from "@phosphor-icons/react";
import { formatPrice } from "@/utils";
import { Can } from "@casl/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import type { ColumnDef } from "@tanstack/react-table";
import { useGetApiProperties } from "@/lib/api/endpoints/properties";
import { GetPropertiesResponse, Property } from "@/lib/api/types/properties";
import { SubmitVerificationDialog } from "./submit-verification-dialog";
import { DeletePropertyDialog } from "./delete-property-dialog";

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

export function PropertiesList() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"list" | "map">("list");
  const [pendingSubmit, setPendingSubmit] = useState<Property | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Property | null>(null);

  const { data: propertiesData } = useGetApiProperties();
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
      accessorKey: "id",
      header: "Mã BĐS",
      cell: ({ row }) => (
        <span className="font-mono text-xs tabular-nums">{row.original.id.slice(0, 8)}</span>
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
                <PaperPlaneTilt size={14} />
                Gửi duyệt
              </Button>
            ) : null}
            <Can I="DELETE" a="PROPERTY">
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Xóa"
                onClick={() => setPendingDelete(row.original)}
              >
                <Trash size={14} className="text-destructive" />
              </Button>
            </Can>
          </div>
        );
      },
    },
  ];

  return (
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
            <Funnel size={16} />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Can I="CREATE" a="PROPERTY">
            <Button onClick={() => router.push("/dashboard/properties/new")}>
              <Plus size={16} />
              Thêm BĐS
            </Button>
          </Can>
        </div>
      </div>

      {view === "list" ? (
        filtered.length > 0 ? (
          <DataTable
            columns={columns}
            data={filtered}
            onRowClick={(row) => router.push(`/dashboard/properties/${row.id}`)}
            emptyMessage="Không tìm thấy bất động sản nào"
          />
        ) : (
          <EmptyState
            icon={<Buildings size={24} />}
            title="Chưa có bất động sản"
            description="Tạo bất động sản đầu tiên để bắt đầu bán hàng"
            action={
              <Can I="CREATE" a="PROPERTY">
                <Button onClick={() => router.push("/dashboard/properties/new")}>
                  <Plus size={16} />
                  Thêm BĐS
                </Button>
              </Can>
            }
          />
        )
      ) : (
        <div className="flex min-h-[300px] items-center justify-center rounded-lg border border-dashed border-border bg-surface-muted/30 p-8 md:min-h-[400px]">
          <div className="flex flex-col items-center gap-2 text-foreground-muted">
            <MapTrifold size={32} />
            <p className="text-sm">Bản đồ sẽ hiển thị tại đây</p>
          </div>
        </div>
      )}

      <SubmitVerificationDialog
        property={pendingSubmit}
        open={!!pendingSubmit}
        onOpenChange={(open) => !open && setPendingSubmit(null)}
      />
      <DeletePropertyDialog
        property={pendingDelete}
        open={!!pendingDelete}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      />
    </div>
  );
}
