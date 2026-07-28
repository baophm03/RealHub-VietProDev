"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Users, Funnel } from "@phosphor-icons/react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { useUserStore } from "@/lib/stores/user-store";
import { useGetApiCustomers } from "@/lib/api/endpoints/customers";
import type { ColumnDef } from "@tanstack/react-table";

interface CustomerRow {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  types: string[];
  createdAt: string;
}

const typeLabel: Record<string, string> = {
  BUYER: "Nguoi mua",
  SELLER: "Nguoi ban",
  TENANT: "Nguoi thue",
  LANDLORD: "Cho thue",
};

const columns: ColumnDef<CustomerRow>[] = [
  {
    accessorKey: "fullName",
    header: "Ho ten",
    cell: ({ row }) => <span className="font-medium">{row.original.fullName}</span>,
  },
  {
    accessorKey: "phone",
    header: "Dien thoai",
    cell: ({ row }) => <span className="tabular-nums text-foreground-muted">{row.original.phone}</span>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <span className="text-sm text-foreground-muted truncate max-w-[180px] block">{row.original.email}</span>,
  },
  {
    accessorKey: "type",
    header: "Loai",
    cell: ({ row }) => <Badge variant="blue">{(row.original.types || []).join(", ")}</Badge>,
  },
  {
    accessorKey: "createdAt",
    header: "Ngày tạo",
    cell: ({ row }) => <span className="tabular-nums text-foreground-muted text-xs">{row.original.createdAt ? new Date(row.original.createdAt).toLocaleDateString("vi-VN") : "-"}</span>,
  },
];

export default function CustomersPage() {
  const router = useRouter();
  const hasPermission = useUserStore((s) => s.hasPermission);
  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);

  const { data: customersData, isLoading } = useGetApiCustomers({
    search: undefined,
    type: undefined,
    status: undefined,
    limit: "20",
    offset: "0",
  });
  const customers = ((customersData as unknown as { data: CustomerRow[] })?.data) || [];

  useEffect(() => {
    setMounted(true);
  }, []);

  const filtered = customers.filter(
    (c) => c.fullName.toLowerCase().includes(search.toLowerCase()) || (c.phone || "").includes(search)
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="CRM"
        title="Khách hàng"
        description="Quản lý danh sách khách hàng"
        actions={
          mounted && hasPermission("customers:write") && (
            <Button onClick={() => router.push("/customers/new")}>
              <Plus size={16} />
              Thêm khách hàng
            </Button>
          )
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <Input
            type="search"
            placeholder="Tìm kiếm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-auto min-w-0"
          />
          <Button variant="outline" size="icon" aria-label="Bo loc" className="shrink-0">
            <Funnel size={16} />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="h-96 animate-pulse rounded-lg bg-surface-muted" />
      ) : filtered.length > 0 ? (
        <DataTable
          columns={columns}
          data={filtered}
          onRowClick={(row) => router.push(`/customers/${row.id}`)}
        />
      ) : (
        <EmptyState
          icon={<Users size={24} />}
          title="Chưa có khách hàng"
          description="Thêm khách hàng đầu tiên để bắt đầu quản lý CRM"
          action={
            mounted && hasPermission("customers:write") && (
              <Button onClick={() => router.push("/customers/new")}>
                <Plus size={16} />
                Thêm khách hàng
              </Button>
            )
          }
        />
      )}
    </div>
  );
}
