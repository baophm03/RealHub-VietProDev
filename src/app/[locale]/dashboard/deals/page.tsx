"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Kanban, List as ListIcon } from "@phosphor-icons/react";
import { Can } from "@casl/react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { KanbanBoard, type KanbanColumn } from "@/components/shared/kanban-board";
import { useGetApiDeals } from "@/lib/api/endpoints/deals-reservations";

interface Deal {
  id: string;
  title: string;
  customerName: string;
  propertyName: string;
  transactionValue: number;
  transactionType: string;
  status: string;
  createdAt: string;
}

const statusConfig = [
  { id: "PENDING", title: "Chờ xử lý", variant: "blue" as const },
  { id: "NEGOTIATING", title: "Đàm phán", variant: "yellow" as const },
  { id: "DEPOSITED", title: "Đặt cọc", variant: "purple" as const },
  { id: "CONTRACT_SIGNED", title: "Ký HĐ", variant: "default" as const },
  { id: "COMPLETED", title: "Hoàn thành", variant: "green" as const },
  { id: "CANCELLED", title: "Hủy", variant: "red" as const },
];

function formatPrice(price: number): string {
  if (price >= 1000000000) return `${(price / 1000000000).toFixed(1)} ty`;
  if (price >= 1000000) return `${(price / 1000000).toFixed(0)} trieu`;
  return price.toLocaleString("vi-VN");
}

export default function DealsPage() {
  const router = useRouter();
  const [view, setView] = useState<"kanban" | "list">("kanban");

  const { data: dealsData, isLoading } = useGetApiDeals({
    status: undefined,
    salesUserId: undefined,
    propertyId: undefined,
    customerId: undefined,
    limit: "50",
    offset: "0",
  });
  const deals = ((dealsData as unknown as { data: Deal[] })?.data) || [];

  const columns: KanbanColumn<Deal>[] = statusConfig.map((status) => ({
    id: status.id,
    title: status.title,
    variant: status.variant,
    items: deals.filter((d) => d.status === status.id),
  }));

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Giao dịch"
        title="Giao dịch"
        description="Quản lý giao dịch theo workflow"
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 rounded-md border border-border p-1">
              <button onClick={() => setView("kanban")} className={`rounded-sm p-1.5 ${view === "kanban" ? "bg-surface-muted" : "text-foreground-muted"}`} aria-label="Kanban">
                <Kanban size={16} />
              </button>
              <button onClick={() => setView("list")} className={`rounded-sm p-1.5 ${view === "list" ? "bg-surface-muted" : "text-foreground-muted"}`} aria-label="Danh sach">
                <ListIcon size={16} />
              </button>
            </div>
            <Can I="CREATE" a="DEAL">
              <Button onClick={() => router.push("/dashboard/deals/new")}>
                <Plus size={16} />
                Thêm giao dịch
              </Button>
            </Can>
          </div>
        }
      />

      {isLoading ? (
        <div className="h-96 animate-pulse rounded-lg bg-surface-muted" />
      ) : view === "kanban" ? (
        <KanbanBoard
          columns={columns}
          onCardClick={(deal) => router.push(`/dashboard/deals/${deal.id}`)}
          onDrop={(deal, targetStatus) => {
            console.log("Move deal", deal.id, "to", targetStatus);
          }}
          renderCard={(deal) => (
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium line-clamp-2">{deal.title}</span>
              <span className="text-xs text-foreground-muted truncate">{deal.customerName}</span>
              <div className="flex items-center justify-between pt-1 border-t border-border">
                <span className="text-xs font-medium tabular-nums">{formatPrice(deal.transactionValue)}</span>
                <Badge variant="default" className="text-[10px]">{deal.transactionType}</Badge>
              </div>
            </div>
          )}
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="border-b border-border bg-surface-muted/50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-foreground-muted">Tiêu đề</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-foreground-muted">Khách hàng</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-foreground-muted">Giá trị</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-foreground-muted">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {deals.map((deal) => {
                const status = statusConfig.find((s) => s.id === deal.status);
                return (
                  <tr key={deal.id} onClick={() => router.push(`/dashboard/deals/${deal.id}`)} className="cursor-pointer border-b border-border hover:bg-surface-muted/30">
                    <td className="px-4 py-3 font-medium">{deal.title}</td>
                    <td className="px-4 py-3 text-foreground-muted">{deal.customerName}</td>
                    <td className="px-4 py-3 tabular-nums font-medium">{formatPrice(deal.transactionValue)}</td>
                    <td className="px-4 py-3"><Badge variant={status?.variant ?? "default"}>{status?.title}</Badge></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

