"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Pencil } from "@phosphor-icons/react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGetApiCustomerId } from "@/lib/api/endpoints/customers";

interface CustomerType {
  id: string;
  tenantId: string;
  customerId: string;
  type: string;
}

interface Customer {
  id: string;
  fullName: string;
  phone?: string;
  email?: string;
  types?: CustomerType[];
  createdAt?: string;
}

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: customerData, isLoading } = useGetApiCustomerId(id);
  const customer = (customerData as unknown as { data: Customer })?.data;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 animate-pulse rounded-md bg-surface-muted" />
          <div className="h-8 w-64 animate-pulse rounded-lg bg-surface-muted" />
        </div>
        <div className="h-96 animate-pulse rounded-lg bg-surface-muted" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/dashboard/customers")} className="rounded-md p-2 text-foreground-muted hover:bg-surface-muted" aria-label="Quay lại">
            <ArrowLeft size={20} />
          </button>
          <PageHeader eyebrow="CRM" title="Không tìm thấy" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.push("/dashboard/customers")} className="rounded-md p-2 text-foreground-muted hover:bg-surface-muted" aria-label="Quay lại">
          <ArrowLeft size={20} />
        </button>
        <PageHeader
          eyebrow="CRM"
          title={customer.fullName}
          actions={
            <Button variant="outline" onClick={() => router.push(`/dashboard/customers/${id}/edit`)}>
              <Pencil size={16} />
              Chỉnh sửa
            </Button>
          }
        />
      </div>

      <div className="rounded-lg border border-border bg-surface p-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            {(customer.types || []).map((t) => (
              <Badge key={t.id} variant="blue">{t.type}</Badge>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <span className="text-xs font-medium uppercase tracking-wide text-foreground-muted">Họ và tên</span>
              <p className="text-sm font-medium">{customer.fullName}</p>
            </div>
            <div>
              <span className="text-xs font-medium uppercase tracking-wide text-foreground-muted">Số điện thoại</span>
              <p className="text-sm tabular-nums">{customer.phone || "-"}</p>
            </div>
            <div>
              <span className="text-xs font-medium uppercase tracking-wide text-foreground-muted">Email</span>
              <p className="text-sm">{customer.email || "-"}</p>
            </div>
            <div>
              <span className="text-xs font-medium uppercase tracking-wide text-foreground-muted">Ngày tạo</span>
              <p className="text-sm tabular-nums">{customer.createdAt ? new Date(customer.createdAt).toLocaleDateString("vi-VN") : "-"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
