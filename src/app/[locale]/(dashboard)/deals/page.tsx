"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Handshake, Kanban, List as ListIcon } from "@phosphor-icons/react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { KanbanBoard, type KanbanColumn } from "@/components/shared/kanban-board";
import { useAuthStore } from "@/lib/stores/auth-store";

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

const mockDeals: Deal[] = [
  { id: "1", title: "Ban Vinomes Central Park 2PN", customerName: "Nguyen Van An", propertyName: "Vinhomes Central Park", transactionValue: 5000000000, transactionType: "SALE", status: "PENDING", createdAt: "2025-07-10" },
  { id: "2", title: "Thue Masteri Thao Dien 3PN", customerName: "Tran Thi Bich", propertyName: "Masteri Thao Dien", transactionValue: 25000000, transactionType: "RENT", status: "NEGOTIATING", createdAt: "2025-07-08" },
  { id: "3", title: "Ban Sunwah Pearl Studio", customerName: "Le Minh Chau", propertyName: "Sunwah Pearl", transactionValue: 3000000000, transactionType: "SALE", status: "DEPOSITED", createdAt: "2025-07-05" },
  { id: "4", title: "Ban The Metropole Penthouse", customerName: "Pham Quoc Huy", propertyName: "The Metropole", transactionValue: 25000000000, transactionType: "SALE", status: "COMPLETED", createdAt: "2025-07-01" },
];

const statusConfig = [
  { id: "PENDING", title: "Cho xu ly", variant: "blue" as const },
  { id: "NEGOTIATING", title: "Dam phan", variant: "yellow" as const },
  { id: "DEPOSITED", title: "Dat coc", variant: "purple" as const },
  { id: "CONTRACT_SIGNED", title: "Ky HD", variant: "default" as const },
  { id: "COMPLETED", title: "Hoan thanh", variant: "green" as const },
  { id: "CANCELLED", title: "Huy", variant: "red" as const },
];

function formatPrice(price: number): string {
  if (price >= 1000000000) return `${(price / 1000000000).toFixed(1)} ty`;
  if (price >= 1000000) return `${(price / 1000000).toFixed(0)} trieu`;
  return price.toLocaleString("vi-VN");
}

export default function DealsPage() {
  const router = useRouter();
  const hasPermission = useAuthStore((s) => s.hasPermission);
  const [view, setView] = useState<"kanban" | "list">("kanban");

  const columns: KanbanColumn<Deal>[] = statusConfig.map((status) => ({
    id: status.id,
    title: status.title,
    variant: status.variant,
    items: mockDeals.filter((d) => d.status === status.id),
  }));

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Giao dich"
        title="Giao dich"
        description="Quan ly giao dich theo workflow"
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
            {hasPermission("deals:write") && (
              <Button onClick={() => router.push("/deals/new")}>
                <Plus size={16} />
                Them giao dich
              </Button>
            )}
          </div>
        }
      />

      {view === "kanban" ? (
        <KanbanBoard
          columns={columns}
          onCardClick={(deal) => router.push(`/deals/${deal.id}`)}
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
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-foreground-muted">Tieu de</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-foreground-muted">Khach hang</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-foreground-muted">Gia tri</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-foreground-muted">Trang thai</th>
              </tr>
            </thead>
            <tbody>
              {mockDeals.map((deal) => {
                const status = statusConfig.find((s) => s.id === deal.status);
                return (
                  <tr key={deal.id} onClick={() => router.push(`/deals/${deal.id}`)} className="cursor-pointer border-b border-border hover:bg-surface-muted/30">
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

void Handshake;
