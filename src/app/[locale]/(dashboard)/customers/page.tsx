"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Users, Funnel } from "@phosphor-icons/react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { useAuthStore } from "@/lib/stores/auth-store";
import type { ColumnDef } from "@tanstack/react-table";

interface CustomerRow {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  type: string;
  leadCount: number;
  createdAt: string;
}

const mockData: CustomerRow[] = [
  { id: "1", fullName: "Nguyen Van An", phone: "090****567", email: "an.nguyen@email.com", type: "BUYER", leadCount: 3, createdAt: "2025-07-01" },
  { id: "2", fullName: "Tran Thi Bich", phone: "098****321", email: "bich.tran@email.com", type: "SELLER", leadCount: 1, createdAt: "2025-07-05" },
  { id: "3", fullName: "Le Minh Chau", phone: "091****890", email: "chau.le@email.com", type: "TENANT", leadCount: 2, createdAt: "2025-07-10" },
  { id: "4", fullName: "Pham Quoc Huy", phone: "093****147", email: "huy.pham@email.com", type: "BUYER", leadCount: 5, createdAt: "2025-07-12" },
];

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
    cell: ({ row }) => <span className="text-sm text-foreground-muted">{row.original.email}</span>,
  },
  {
    accessorKey: "type",
    header: "Loai",
    cell: ({ row }) => <Badge variant="blue">{typeLabel[row.original.type] ?? row.original.type}</Badge>,
  },
  {
    accessorKey: "leadCount",
    header: "Leads",
    cell: ({ row }) => <span className="tabular-nums">{row.original.leadCount}</span>,
  },
  {
    accessorKey: "createdAt",
    header: "Ngay tao",
    cell: ({ row }) => <span className="tabular-nums text-foreground-muted text-xs">{row.original.createdAt}</span>,
  },
];

export default function CustomersPage() {
  const router = useRouter();
  const hasPermission = useAuthStore((s) => s.hasPermission);
  const [search, setSearch] = useState("");

  const filtered = mockData.filter(
    (c) => c.fullName.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search)
  );

  return (
          <div className="flex flex-col gap-6">
        <PageHeader
          eyebrow="CRM"
          title="Khach hang"
          description="Quan ly danh sach khach hang"
          actions={
            hasPermission("customers:write") && (
              <Button onClick={() => router.push("/customers/new")}>
                <Plus size={16} />
                Them khach hang
              </Button>
            )
          }
        />

        <div className="flex items-center gap-2">
          <Input
            type="search"
            placeholder="Tim kiem theo ten hoac so dien thoai..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
          <Button variant="outline" size="icon" aria-label="Bo loc">
            <Funnel size={16} />
          </Button>
        </div>

        {filtered.length > 0 ? (
          <DataTable
            columns={columns}
            data={filtered}
            onRowClick={(row) => router.push(`/customers/${row.id}`)}
          />
        ) : (
          <EmptyState
            icon={<Users size={24} />}
            title="Chua co khach hang"
            description="Them khach hang dau tien de bat dau quan ly CRM"
            action={
              hasPermission("customers:write") && (
                <Button onClick={() => router.push("/customers/new")}>
                  <Plus size={16} />
                  Them khach hang
                </Button>
              )
            }
          />
        )}
      </div>  );
}
