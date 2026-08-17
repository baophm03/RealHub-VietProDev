"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { List as ListIcon, Plus, SquareKanban, Trash2, Users } from "lucide-react";
import { Can } from "@casl/react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { KanbanBoard, type KanbanColumn } from "@/components/shared/kanban-board";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogPortal,
  DialogOverlay,
} from "@/components/ui/dialog";
import {
  useGetApiLeads,
  usePatchApiLead,
  useDeleteApiLead,
} from "@/lib/api/endpoints/leads";
import type { GetApiLeadsStatus } from "@/lib/api/models/getApiLeadsStatus";
import type { GetApiLeadsSource } from "@/lib/api/models/getApiLeadsSource";
import type { UpdateLeadDtoStatus } from "@/lib/api/models/updateLeadDtoStatus";

interface LeadCustomer {
  id: string;
  fullName: string;
  phone: string;
}
interface LeadProperty {
  id: string;
  title: string;
  propertyCode: string;
}
interface LeadSales {
  id: string;
  fullName: string;
}

interface Lead {
  id: string;
  leadCode: string;
  customerId: string | null;
  propertyId: string | null;
  source: string;
  assignedSalesId: string | null;
  phoneNormalized: string | null;
  status: string;
  createdAt: string;
  customer: LeadCustomer | null;
  property: LeadProperty | null;
  assignedSales: LeadSales | null;
}

interface LeadsResponse {
  success: boolean;
  data: Lead[];
  meta: { total: number; limit: number; offset: number; page: number; totalPages: number };
  timestamp: string;
}

const statusConfig: {
  id: UpdateLeadDtoStatus;
  title: string;
  variant: "blue" | "yellow" | "purple" | "default" | "green" | "red";
}[] = [
    { id: "NEW", title: "Mới", variant: "blue" },
    { id: "CONTACTED", title: "Đã liên hệ", variant: "yellow" },
    { id: "INTERESTED", title: "Quan tâm", variant: "purple" },
    { id: "NEGOTIATING", title: "Đàm phán", variant: "default" },
    { id: "CONVERTED", title: "Chuyển đổi", variant: "green" },
    { id: "LOST", title: "Mất", variant: "red" },
  ];

const statusLabel: Record<string, string> = {
  NEW: "Mới",
  CONTACTED: "Đã liên hệ",
  INTERESTED: "Quan tâm",
  NEGOTIATING: "Đàm phán",
  CONVERTED: "Chuyển đổi",
  LOST: "Mất",
  RECYCLED: "Tái chế",
};

const sourceLabel: Record<string, string> = {
  WEBSITE: "Website",
  PROPERTY_DETAIL: "Trang BĐS",
  OWNER_PAGE: "Trang chủ",
  SALES_LINK: "Link sales",
  CTV_LINK: "Link CTV",
  AGENCY_MARKETING: "Marketing",
  MANUAL_INPUT: "Nhập tay",
  LEAD_POOL: "Lead pool",
  IMPORT: "Nhập file",
};

const statusFilters: { value: GetApiLeadsStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "Tất cả trạng thái" },
  { value: "NEW", label: "Mới" },
  { value: "CONTACTED", label: "Đã liên hệ" },
  { value: "INTERESTED", label: "Quan tâm" },
  { value: "NEGOTIATING", label: "Đàm phán" },
  { value: "CONVERTED", label: "Chuyển đổi" },
  { value: "LOST", label: "Mất" },
  { value: "RECYCLED", label: "Tái chế" },
];

const sourceFilters: { value: GetApiLeadsSource | "ALL"; label: string }[] = [
  { value: "ALL", label: "Tất cả nguồn" },
  { value: "WEBSITE", label: "Website" },
  { value: "PROPERTY_DETAIL", label: "Trang BĐS" },
  { value: "OWNER_PAGE", label: "Trang chủ" },
  { value: "SALES_LINK", label: "Link sales" },
  { value: "CTV_LINK", label: "Link CTV" },
  { value: "AGENCY_MARKETING", label: "Marketing" },
  { value: "MANUAL_INPUT", label: "Nhập tay" },
  { value: "LEAD_POOL", label: "Lead pool" },
  { value: "IMPORT", label: "Nhập file" },
];

export default function LeadsPage() {
  const router = useRouter();
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [statusFilter, setStatusFilter] = useState<GetApiLeadsStatus | "ALL">("ALL");
  const [sourceFilter, setSourceFilter] = useState<GetApiLeadsSource | "ALL">("ALL");
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Lead | null>(null);

  const { data: leadsData, isLoading, refetch } = useGetApiLeads({
    status: statusFilter === "ALL" ? undefined : (statusFilter as GetApiLeadsStatus),
    source: sourceFilter === "ALL" ? undefined : (sourceFilter as GetApiLeadsSource),
    search: search.trim() || undefined,
    limit: "50",
    offset: "0",
  });
  const leads = ((leadsData as unknown as LeadsResponse)?.data) || [];
  const totalCount = (leadsData as unknown as LeadsResponse)?.meta?.total ?? leads.length;

  const { mutateAsync: updateLead, isPending: isUpdating } = usePatchApiLead();
  const { mutateAsync: deleteLead, isPending: isDeleting } = useDeleteApiLead();

  const handleDrop = async (lead: Lead, targetStatus: string) => {
    if (lead.status === targetStatus) return;
    try {
      await updateLead({ id: lead.id, data: { status: targetStatus as UpdateLeadDtoStatus } });
      toast.success(`Đã chuyển lead sang "${statusLabel[targetStatus] ?? targetStatus}"`);
      refetch();
    } catch (err) {
      toast.error("Cập nhật trạng thái lead thất bại");
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteLead({ id: deleteTarget.id });
      toast.success(`Đã xóa lead "${deleteTarget.leadCode}"`);
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      toast.error("Xóa lead thất bại");
      console.error(err);
    }
  };

  const columns: KanbanColumn<Lead>[] = statusConfig.map((status) => ({
    id: status.id,
    title: status.title,
    variant: status.variant,
    items: leads.filter((l) => l.status === status.id),
  }));

  const renderLeadInfo = (lead: Lead) => (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium truncate">
          {lead.customer?.fullName ?? lead.leadCode}
        </span>
        <Badge variant="default" className="shrink-0 text-[10px]">
          {sourceLabel[lead.source] ?? lead.source}
        </Badge>
      </div>
      <span className="text-xs text-foreground-muted tabular-nums">
        {lead.phoneNormalized ?? lead.customer?.phone ?? "—"}
      </span>
      {lead.property && (
        <span className="text-xs text-foreground-muted truncate">{lead.property.title}</span>
      )}
      <div className="flex items-center justify-between pt-1 border-t border-border">
        <span className="text-xs text-foreground-muted">{lead.leadCode}</span>
        <span className="text-xs text-foreground-muted tabular-nums">
          {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString("vi-VN") : ""}
        </span>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="CRM"
        title="Khách hàng tiềm năng"
        description="Quản lý khách hàng tiềm năng theo trạng thái"
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 rounded-md border border-border p-1">
              <button
                onClick={() => setView("kanban")}
                className={`rounded-sm p-1.5 ${view === "kanban" ? "bg-surface-muted" : "text-foreground-muted"}`}
                aria-label="Kanban"
              >
                <SquareKanban size={16} />
              </button>
              <button
                onClick={() => setView("list")}
                className={`rounded-sm p-1.5 ${view === "list" ? "bg-surface-muted" : "text-foreground-muted"}`}
                aria-label="Danh sách"
              >
                <ListIcon size={16} />
              </button>
            </div>
            <Can I="CREATE" a="LEAD">
              <Button onClick={() => router.push("/dashboard/leads/new")}>
                <Plus size={16} />
                Thêm khách hàng
              </Button>
            </Can>
          </div>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          placeholder="Tìm theo mã KHTN, SĐT..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9 w-full rounded-md border border-border bg-surface px-3 text-sm text-foreground outline-none focus:border-ring sm:w-auto sm:min-w-[260px]"
        />
        <div className="flex items-center gap-2">
          <Select
            value={statusFilter}
            items={Object.fromEntries(statusFilters.map((f) => [f.value, f.label]))}
            onValueChange={(v) => setStatusFilter((v ?? "ALL") as GetApiLeadsStatus | "ALL")}
          >
            <SelectTrigger className="h-9 w-[180px]">
              <SelectValue placeholder="Tất cả trạng thái" />
            </SelectTrigger>
            <SelectContent>
              {statusFilters.map((f) => (
                <SelectItem key={f.value} value={f.value} label={f.label}>
                  {f.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={sourceFilter}
            items={Object.fromEntries(sourceFilters.map((f) => [f.value, f.label]))}
            onValueChange={(v) => setSourceFilter((v ?? "ALL") as GetApiLeadsSource | "ALL")}
          >
            <SelectTrigger className="h-9 w-[180px]">
              <SelectValue placeholder="Tất cả nguồn" />
            </SelectTrigger>
            <SelectContent>
              {sourceFilters.map((f) => (
                <SelectItem key={f.value} value={f.value} label={f.label}>
                  {f.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="h-96 animate-pulse rounded-lg bg-surface-muted" />
      ) : leads.length === 0 ? (
        <EmptyState
          icon={<Users size={24} />}
          title="Chưa có khách hàng tiềm năng"
          description="Thêm khách hàng tiềm năng đầu tiên để bắt đầu quản lý CRM"
          action={
            <Can I="CREATE" a="LEAD">
              <Button onClick={() => router.push("/dashboard/leads/new")}>
                <Plus size={16} />
                Thêm khách hàng
              </Button>
            </Can>
          }
        />
      ) : (
        <>
          <div className="text-xs text-foreground-muted">{totalCount} khách hàng tiềm năng</div>
          {view === "kanban" ? (
            <KanbanBoard
              columns={columns}
              onCardClick={(lead) => router.push(`/dashboard/leads/${lead.id}`)}
              onDrop={handleDrop}
              renderCard={renderLeadInfo}
            />
          ) : (
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-sm min-w-[700px]">
                <thead>
                  <tr className="border-b border-border bg-surface-muted/50">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-foreground-muted">Mã KHTN</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-foreground-muted">Khách hàng</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-foreground-muted">Điện thoại</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-foreground-muted">BĐS</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-foreground-muted">Nguồn</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-foreground-muted">Trạng thái</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-foreground-muted"></th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => {
                    const status = statusConfig.find((s) => s.id === lead.status);
                    return (
                      <tr
                        key={lead.id}
                        onClick={() => router.push(`/dashboard/leads/${lead.id}`)}
                        className="cursor-pointer border-b border-border hover:bg-surface-muted/30"
                      >
                        <td className="px-4 py-3 font-medium tabular-nums">{lead.leadCode}</td>
                        <td className="px-4 py-3 font-medium">{lead.customer?.fullName ?? "—"}</td>
                        <td className="px-4 py-3 tabular-nums text-foreground-muted">
                          {lead.phoneNormalized ?? lead.customer?.phone ?? "—"}
                        </td>
                        <td className="px-4 py-3 text-foreground-muted truncate max-w-[180px]">
                          {lead.property?.title ?? "—"}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="default" className="text-[10px]">
                            {sourceLabel[lead.source] ?? lead.source}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={status?.variant ?? "default"}>
                            {status?.title ?? lead.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                          <Can I="DELETE" a="LEAD">
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              aria-label="Xóa"
                              onClick={() => setDeleteTarget(lead)}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </Can>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Delete confirmation dialog */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogPortal>
          <DialogOverlay />
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Xóa khách hàng tiềm năng</DialogTitle>
              <DialogDescription>
                Hành động này sẽ ẩn khách hàng tiềm năng (soft delete). Bạn có chắc chắn?
              </DialogDescription>
            </DialogHeader>
            {deleteTarget && (
              <div className="rounded-lg border border-border bg-surface-muted/40 p-4 text-sm">
                <p className="font-medium">{deleteTarget.leadCode}</p>
                {deleteTarget.customer?.fullName && (
                  <p className="text-foreground-muted">{deleteTarget.customer.fullName}</p>
                )}
              </div>
            )}
            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" onClick={() => setDeleteTarget(null)}>Hủy</Button>
              <Can I="DELETE" a="LEAD">
                <Button variant="destructive" disabled={isDeleting} onClick={handleDelete}>
                  {isDeleting ? "Đang xóa..." : "Xóa"}
                </Button>
              </Can>
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </div>
  );
}
