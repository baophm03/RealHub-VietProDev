"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, MapTrifold, List as ListIcon, Funnel, Buildings } from "@phosphor-icons/react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { useUserStore } from "@/lib/stores/user-store";
import type { ColumnDef } from "@tanstack/react-table";
import { useGetApiProperties } from "@/lib/api/endpoints/properties";
import { GetPropertiesResponse, Property } from "@/lib/api/types/properties";

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

function formatPrice(price: number): string {
  if (price >= 1000000000) return `${(price / 1000000000).toFixed(1)} tỷ`;
  if (price >= 1000000) return `${(price / 1000000).toFixed(0)} triệu`;
  return price.toLocaleString("vi-VN");
}

export default function PropertiesPage() {
  const router = useRouter();
  const hasPermission = useUserStore((s) => s.hasPermission);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"list" | "map">("list");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: propertiesData } = useGetApiProperties();
  const properties = ((propertiesData as unknown as GetPropertiesResponse)?.data) || [];

  const filtered = properties.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

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
      accessorKey: "businessStatus",
      header: "Trạng thái",
      cell: ({ row }) => (
        <Badge variant={statusVariant[row.original.businessStatus ?? ""] ?? "default"}>
          {statusLabel[row.original.businessStatus ?? ""] ?? row.original.businessStatus}
        </Badge>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Bất động sản"
        title="Danh sách bất động sản"
        description="Quản lý toàn bộ bất động sản trong hệ thống"
        actions={
          mounted && hasPermission("properties:write") && (
            <Button onClick={() => router.push("/properties/new")}>
              <Plus size={16} />
              Thêm BĐS
            </Button>
          )
        }
      />

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
        <div className="flex items-center gap-1 rounded-md border border-border p-1">
          <button
            onClick={() => setView("list")}
            className={`rounded-sm p-1.5 ${view === "list" ? "bg-surface-muted" : "text-foreground-muted"}`}
            aria-label="Xem danh sách"
          >
            <ListIcon size={16} />
          </button>
          <button
            onClick={() => setView("map")}
            className={`rounded-sm p-1.5 ${view === "map" ? "bg-surface-muted" : "text-foreground-muted"}`}
            aria-label="Xem bản đồ"
          >
            <MapTrifold size={16} />
          </button>
        </div>
      </div>

      {view === "list" ? (
        filtered.length > 0 ? (
          <DataTable
            columns={columns}
            data={filtered}
            onRowClick={(row) => router.push(`/properties/${row.id}`)}
            emptyMessage="Không tìm thấy bất động sản nào"
          />
        ) : (
          <EmptyState
            icon={<Buildings size={24} />}
            title="Chưa có bất động sản"
            description="Tạo bất động sản đầu tiên để bắt đầu bán hàng"
            action={
              mounted && hasPermission("properties:write") && (
                <Button onClick={() => router.push("/properties/new")}>
                  <Plus size={16} />
                  Thêm BĐS
                </Button>
              )
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
    </div>
  );
}
