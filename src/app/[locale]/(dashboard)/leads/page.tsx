"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, UserCircle, Kanban, List as ListIcon } from "@phosphor-icons/react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { KanbanBoard, type KanbanColumn } from "@/components/shared/kanban-board";
import { useAuthStore } from "@/lib/stores/auth-store";

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

const mockLeads: Lead[] = [
  { id: "1", customerName: "Nguyen Van An", phone: "090****567", property: "Vinhomes Central Park", price: 5000000000, source: "WEBSITE", createdAt: "2025-07-10", status: "NEW" },
  { id: "2", customerName: "Tran Thi Bich", phone: "098****321", property: "Masteri Thao Dien", price: 7500000000, source: "PROPERTY_DETAIL", createdAt: "2025-07-09", status: "CONTACTED" },
  { id: "3", customerName: "Le Minh Chau", phone: "091****890", property: "Sunwah Pearl", price: 3000000000, source: "SALES_LINK", createdAt: "2025-07-08", status: "INTERESTED" },
  { id: "4", customerName: "Pham Quoc Huy", phone: "093****147", property: "The Metropole", price: 25000000000, source: "AGENCY_MARKETING", createdAt: "2025-07-07", status: "NEGOTIATING" },
  { id: "5", customerName: "Hoang Thi Dung", phone: "092****258", property: "Vinhomes Golden River", price: 12000000000, source: "MANUAL_INPUT", createdAt: "2025-07-05", status: "CONVERTED" },
  { id: "6", customerName: "Vu Van Khoa", phone: "094****369", property: "Bitexco Financial Tower", price: 8000000000, source: "CTV_LINK", createdAt: "2025-07-03", status: "LOST" },
];

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
  const hasPermission = useAuthStore((s) => s.hasPermission);
  const [view, setView] = useState<"kanban" | "list">("kanban");

  const columns: KanbanColumn<Lead>[] = statusConfig.map((status) => ({
    id: status.id,
    title: status.title,
    variant: status.variant,
    items: mockLeads.filter((l) => l.status === status.id),
  }));

  return (
          <div className="flex flex-col gap-6">
        <PageHeader
          eyebrow="CRM"
          title="Leads"
          description="Quan ly lead theo trang thai"
          actions={
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 rounded-md border border-border p-1">
                <button onClick={() => setView("kanban")} className={`rounded-sm p-1.5 ${view === "kanban" ? "bg-surface-muted" : "text-foreground-muted"}`} aria-label="Kanban">
                  <Kanban size={16} />
                </button>
                <button onClick={() => setView("list")} className={`rounded-sm p-1.5 ${view === "list" ? "bg-surface-muted" : "text-foreground-muted"}`} aria-label="Danh sach">
                  <ListIcon size={16} />
                </button>
              </div>
              {hasPermission("leads:write") && (
                <Button onClick={() => router.push("/leads/new")}>
                  <Plus size={16} />
                  Them lead
                </Button>
              )}
            </div>
          }
        />

        {view === "kanban" ? (
          <KanbanBoard
            columns={columns}
            onCardClick={(lead) => router.push(`/leads/${lead.id}`)}
            onDrop={(lead, targetStatus) => {
              console.log("Move lead", lead.id, "to", targetStatus);
            }}
            renderCard={(lead) => (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{lead.customerName}</span>
                  <Badge variant="default">{lead.source}</Badge>
                </div>
                <span className="text-xs text-foreground-muted tabular-nums">{lead.phone}</span>
                <span className="text-xs text-foreground-muted">{lead.property}</span>
                <div className="flex items-center justify-between pt-1 border-t border-border">
                  <span className="text-xs font-medium tabular-nums">{formatPrice(lead.price)}</span>
                  <span className="text-xs text-foreground-muted">{lead.createdAt}</span>
                </div>
              </div>
            )}
          />
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-muted/50">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-foreground-muted">Khach hang</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-foreground-muted">Dien thoai</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-foreground-muted">BÄS</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-foreground-muted">Gia</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-foreground-muted">Trang thai</th>
                </tr>
              </thead>
              <tbody>
                {mockLeads.map((lead) => {
                  const status = statusConfig.find((s) => s.id === lead.status);
                  return (
                    <tr key={lead.id} onClick={() => router.push(`/leads/${lead.id}`)} className="cursor-pointer border-b border-border hover:bg-surface-muted/30">
                      <td className="px-4 py-3 font-medium">{lead.customerName}</td>
                      <td className="px-4 py-3 tabular-nums text-foreground-muted">{lead.phone}</td>
                      <td className="px-4 py-3 text-foreground-muted">{lead.property}</td>
                      <td className="px-4 py-3 tabular-nums font-medium">{formatPrice(lead.price)}</td>
                      <td className="px-4 py-3"><Badge variant={status?.variant ?? "default"}>{status?.title}</Badge></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>  );
}

void UserCircle;
