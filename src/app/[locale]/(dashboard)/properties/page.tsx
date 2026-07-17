"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, MapTrifold, List as ListIcon, Funnel, Buildings } from "@phosphor-icons/react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { useAuthStore } from "@/lib/stores/auth-store";
import type { ColumnDef } from "@tanstack/react-table";

interface PropertyRow {
  id: string;
  propertyCode: string;
  title: string;
  transactionType: string;
  businessStatus: string;
  price: number;
  area: number;
  location: string;
}

const mockData: PropertyRow[] = [
  { id: "1", propertyCode: "PROP-001", title: "Vinhomes Central Park - 2PN", transactionType: "SALE", businessStatus: "AVAILABLE", price: 5000000000, area: 80, location: "Binh Thanh, TP.HCM" },
  { id: "2", propertyCode: "PROP-002", title: "Masteri Thao Dien - 3PN", transactionType: "SALE", businessStatus: "RESERVED", price: 7500000000, area: 120, location: "Thu Duc, TP.HCM" },
  { id: "3", propertyCode: "PROP-003", title: "Sunwah Pearl - Studio", transactionType: "RENT", businessStatus: "AVAILABLE", price: 15000000, area: 35, location: "Quan 1, TP.HCM" },
  { id: "4", propertyCode: "PROP-004", title: "The Metropole - Penthouse", transactionType: "SALE", businessStatus: "SOLD", price: 25000000000, area: 250, location: "Quan 1, TP.HCM" },
];

const statusVariant: Record<string, "green" | "yellow" | "red" | "blue" | "default"> = {
  AVAILABLE: "green",
  RESERVED: "yellow",
  SOLD: "red",
  RENTED: "blue",
  OFF_MARKET: "default",
};

const statusLabel: Record<string, string> = {
  AVAILABLE: "San co",
  RESERVED: "Dat coc",
  SOLD: "Da ban",
  RENTED: "Da thue",
  OFF_MARKET: "Khoi ban",
};

const txLabel: Record<string, string> = {
  SALE: "Ban",
  RENT: "Cho thue",
  TRANSFER: "Chuyen nhuong",
  INVESTMENT: "Dau tu",
};

function formatPrice(price: number): string {
  if (price >= 1000000000) return `${(price / 1000000000).toFixed(1)} ty`;
  if (price >= 1000000) return `${(price / 1000000).toFixed(0)} trieu`;
  return price.toLocaleString("vi-VN");
}

const columns: ColumnDef<PropertyRow>[] = [
  {
    accessorKey: "propertyCode",
    header: "Ma BDS",
    cell: ({ row }) => (
      <span className="font-mono text-xs tabular-nums">{row.original.propertyCode}</span>
    ),
  },
  {
    accessorKey: "title",
    header: "Ten",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.title}</span>
    ),
  },
  {
    accessorKey: "transactionType",
    header: "Giao dich",
    cell: ({ row }) => (
      <span className="text-sm text-foreground-muted">{txLabel[row.original.transactionType] ?? row.original.transactionType}</span>
    ),
  },
  {
    accessorKey: "price",
    header: "Gia",
    cell: ({ row }) => (
      <span className="tabular-nums font-medium">{formatPrice(row.original.price)}</span>
    ),
  },
  {
    accessorKey: "area",
    header: "Dien tich",
    cell: ({ row }) => (
      <span className="tabular-nums text-foreground-muted">{row.original.area} m2</span>
    ),
  },
  {
    accessorKey: "location",
    header: "Vi tri",
    cell: ({ row }) => (
      <span className="text-sm text-foreground-muted">{row.original.location}</span>
    ),
  },
  {
    accessorKey: "businessStatus",
    header: "Trang thai",
    cell: ({ row }) => (
      <Badge variant={statusVariant[row.original.businessStatus] ?? "default"}>
        {statusLabel[row.original.businessStatus] ?? row.original.businessStatus}
      </Badge>
    ),
  },
];

export default function PropertiesPage() {
  const router = useRouter();
  const hasPermission = useAuthStore((s) => s.hasPermission);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"list" | "map">("list");

  const filtered = mockData.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.propertyCode.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Bat dong san"
        title="Danh sach bat dong san"
        description="Quan ly toan bo bat dong san trong he thong"
        actions={
          hasPermission("properties:write") && (
            <Button onClick={() => router.push("/properties/new")}>
              <Plus size={16} />
              Them BDS
            </Button>
          )
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Input
            type="search"
            placeholder="Tim kiem..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-auto min-w-0"
          />
          <Button variant="outline" size="icon" aria-label="Bo loc" className="shrink-0">
            <Funnel size={16} />
          </Button>
        </div>
        <div className="flex items-center gap-1 rounded-md border border-border p-1">
          <button
            onClick={() => setView("list")}
            className={`rounded-sm p-1.5 ${view === "list" ? "bg-surface-muted" : "text-foreground-muted"}`}
            aria-label="Xem danh sach"
          >
            <ListIcon size={16} />
          </button>
          <button
            onClick={() => setView("map")}
            className={`rounded-sm p-1.5 ${view === "map" ? "bg-surface-muted" : "text-foreground-muted"}`}
            aria-label="Xem ban do"
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
            emptyMessage="Khong tim thay bat dong san nao"
          />
        ) : (
          <EmptyState
            icon={<Buildings size={24} />}
            title="Chua co bat dong san"
            description="Tao bat dong san dau tien de bat dau ban hang"
            action={
              hasPermission("properties:write") && (
                <Button onClick={() => router.push("/properties/new")}>
                  <Plus size={16} />
                  Them BDS
                </Button>
              )
            }
          />
        )
      ) : (
        <div className="flex min-h-[300px] items-center justify-center rounded-lg border border-dashed border-border bg-surface-muted/30 p-8 md:min-h-[400px]">
          <div className="flex flex-col items-center gap-2 text-foreground-muted">
            <MapTrifold size={32} />
            <p className="text-sm">Ban do se hien thi tai day</p>
          </div>
        </div>
      )}
    </div>
  );
}
