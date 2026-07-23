"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, UserCircle, Kanban, List as ListIcon } from "@phosphor-icons/react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { KanbanBoard, type KanbanColumn } from "@/components/shared/kanban-board";
import { useUserStore } from "@/lib/stores/user-store";
import { useGetApiLeads } from "@/lib/api/endpoints/leads";

interface Lead {
  id: string;
  customerName: string;
  phone: string;
  property: string;
  price: number;
  source: string;
  createdAt: string;
  status: string;
}

const statusConfig = [
  { id: "NEW", title: "Moi", variant: "blue" as const },
  { id: "CONTACTED", title: "Da lien he", variant: "yellow" as const },
  { id: "INTERESTED", title: "Quan tam", variant: "purple" as const },
  { id: "NEGOTIATING", title: "Dam phan", variant: "default" as const },
  { id: "CONVERTED", title: "Chuyen doi", variant: "green" as const },
  { id: "LOST", title: "Mat", variant: "red" as const },
];

function formatPrice(price: number): string {
  if (price >= 1000000000) return `${(price / 1000000000).toFixed(1)} ty`;
  if (price >= 1000000) return `${(price / 1000000).toFixed(0)} trieu`;
  return price.toLocaleString("vi-VN");
}

export default function LeadsPage() {
  const router = useRouter();
  const hasPermission = useUserStore((s) => s.hasPermission);
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [mounted, setMounted] = useState(false);

  const { data: leadsData, isLoading } = useGetApiLeads({
    status: "",
    source: "",
    assignedSalesId: "",
    customerId: "",
    propertyId: "",
    search: "",
    limit: "50",
    offset: "0",
  });
  const leads = ((leadsData as unknown as { data: Lead[] })?.data) || [];

  useEffect(() => {
    setMounted(true);
  }, []);

  const columns: KanbanColumn<Lead>[] = statusConfig.map((status) => ({
    id: status.id,
    title: status.title,
    variant: status.variant,
    items: leads.filter((l) => l.status === status.id),
  }));

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="CRM"
        title="Leads"
        description="Quan ly lead theo trang thai"
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
            {mounted && hasPermission("leads:write") && (
              <Button onClick={() => router.push("/leads/new")}>
                <Plus size={16} />
                Them lead
              </Button>
            )}
          </div>
        }
      />

      {isLoading ? (
        <div className="h-96 animate-pulse rounded-lg bg-surface-muted" />
      ) : view === "kanban" ? (
        <KanbanBoard
          columns={columns}
          onCardClick={(lead) => router.push(`/leads/${lead.id}`)}
          onDrop={(lead, targetStatus) => {
            console.log("Move lead", lead.id, "to", targetStatus);
          }}
          renderCard={(lead) => (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium truncate">{lead.customerName}</span>
                <Badge variant="default" className="shrink-0">{lead.source}</Badge>
              </div>
              <span className="text-xs text-foreground-muted tabular-nums">{lead.phone}</span>
              <span className="text-xs text-foreground-muted truncate">{lead.property}</span>
              <div className="flex items-center justify-between pt-1 border-t border-border">
                <span className="text-xs font-medium tabular-nums">{formatPrice(lead.price)}</span>
                <span className="text-xs text-foreground-muted">{lead.createdAt}</span>
              </div>
            </div>
          )}
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="border-b border-border bg-surface-muted/50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-foreground-muted">Khach hang</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-foreground-muted">Dien thoai</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-foreground-muted">BDS</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-foreground-muted">Gia</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-foreground-muted">Trang thai</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => {
                const status = statusConfig.find((s) => s.id === lead.status);
                return (
                  <tr key={lead.id} onClick={() => router.push(`/leads/${lead.id}`)} className="cursor-pointer border-b border-border hover:bg-surface-muted/30">
                    <td className="px-4 py-3 font-medium">{lead.customerName}</td>
                    <td className="px-4 py-3 tabular-nums text-foreground-muted">{lead.phone}</td>
                    <td className="px-4 py-3 text-foreground-muted truncate max-w-[150px]">{lead.property}</td>
                    <td className="px-4 py-3 tabular-nums font-medium">{formatPrice(lead.price)}</td>
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

void UserCircle;
