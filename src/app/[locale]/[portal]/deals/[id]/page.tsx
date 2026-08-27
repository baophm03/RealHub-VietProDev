"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { usePortalPath } from "@/lib/hooks/use-portal";
import {
  ArrowLeft,
  Clock,
  House,
  MessageSquare,
  Pencil,
  SquareKanban,
  Trash2,
  User,
} from "lucide-react";
import { formatPrice } from "@/utils";
import { Can } from "@casl/react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  useGetApiDealId,
  useGetApiDealActivities,
  usePatchApiDeal,
  useDeleteApiDeal,
  usePostApiDealActivity,
  useGetApiReservations,
  usePostApiReservation,
  usePatchApiApproveReservation,
  usePatchApiRejectReservation,
} from "@/lib/api/endpoints/deals-reservations";
import type { UpdateDealDtoStatus } from "@/lib/api/models/updateDealDtoStatus";

interface DealProperty {
  id: string;
  title: string;
  propertyCode: string;
}
interface DealCustomer {
  id: string;
  fullName: string;
}
interface DealLead {
  id: string;
  leadCode: string;
}
interface DealActivity {
  id: string;
  activityType: string;
  content?: string;
  createdAt: string;
}
interface Reservation {
  id: string;
  dealId: string;
  propertyId: string;
  reservationType: string;
  status: string;
  startsAt: string;
  expiresAt: string;
  note?: string;
  property?: DealProperty | null;
}

interface Deal {
  id: string;
  dealCode: string;
  transactionType: string;
  expectedValue?: string;
  finalValue?: string;
  status: string;
  currentWorkflowState?: string | null;
  createdAt?: string;
  property?: DealProperty | null;
  customer?: DealCustomer | null;
  lead?: DealLead | null;
  activities?: DealActivity[];
  reservations?: Reservation[];
}

const txLabel: Record<string, string> = {
  SALE: "Bán",
  RENT: "Cho thuê",
  TRANSFER: "Chuyển nhượng",
};

const statusVariant: Record<string, "blue" | "yellow" | "purple" | "default" | "green" | "red"> = {
  SOFT_RESERVED: "blue",
  NEGOTIATING: "yellow",
  SUCCESS: "green",
  FAILED: "red",
  CANCELLED: "default",
  DISPUTED: "purple",
};

const statusLabel: Record<string, string> = {
  SOFT_RESERVED: "Đặt cọc",
  NEGOTIATING: "Đàm phán",
  SUCCESS: "Thành công",
  FAILED: "Thất bại",
  CANCELLED: "Hủy",
  DISPUTED: "Tranh chấp",
};

const statusOptions = [
  { value: "SOFT_RESERVED", label: "Đặt cọc" },
  { value: "NEGOTIATING", label: "Đàm phán" },
  { value: "SUCCESS", label: "Thành công" },
  { value: "FAILED", label: "Thất bại" },
  { value: "CANCELLED", label: "Hủy" },
  { value: "DISPUTED", label: "Tranh chấp" },
];

const activityTypeLabel: Record<string, string> = {
  NOTE: "Ghi chú",
  STATUS_CHANGE: "Đổi trạng thái",
  CALL: "Gọi điện",
  EMAIL: "Email",
  MEETING: "Gặp mặt",
  DOCUMENT: "Tài liệu",
};

const reservationTypeLabel: Record<string, string> = {
  SOFT: "Cọc mềm",
  HARD: "Cọc cứng",
};

const reservationStatusLabel: Record<string, { label: string; variant: "blue" | "green" | "default" | "red" | "yellow" }> = {
  PENDING: { label: "Chờ duyệt", variant: "yellow" },
  APPROVED: { label: "Đã duyệt", variant: "green" },
  REJECTED: { label: "Từ chối", variant: "red" },
  ACTIVE: { label: "Hoạt động", variant: "blue" },
  EXPIRED: { label: "Hết hạn", variant: "default" },
  CANCELLED: { label: "Đã hủy", variant: "default" },
  CONVERTED: { label: "Đã chuyển", variant: "green" },
};

function toLocalDatetimeInput(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function DealDetailPage() {
  const params = useParams();
  const router = useRouter();
  const portalPath = usePortalPath();
  const id = params.id as string;
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [activityType, setActivityType] = useState("NOTE");
  const [activityContent, setActivityContent] = useState("");
  const [resvOpen, setResvOpen] = useState(false);
  const [resvType, setResvType] = useState("SOFT");
  const [resvStartsAt, setResvStartsAt] = useState("");
  const [resvExpiresAt, setResvExpiresAt] = useState("");
  const [resvNote, setResvNote] = useState("");

  const { data: dealData, isLoading, refetch } = useGetApiDealId(id);
  const deal = (dealData as unknown as { data: Deal })?.data;

  const { data: activitiesData, refetch: refetchActivities } = useGetApiDealActivities(id);
  const activities = ((activitiesData as unknown as { data: DealActivity[] })?.data) || [];

  const { data: reservationsData, refetch: refetchReservations } = useGetApiReservations({
    dealId: id,
    limit: "50",
    offset: "0",
  });
  const reservations = ((reservationsData as unknown as { data: Reservation[] })?.data) || [];

  const { mutateAsync: updateDeal, isPending: isUpdating } = usePatchApiDeal();
  const { mutateAsync: deleteDeal, isPending: isDeleting } = useDeleteApiDeal();
  const { mutateAsync: addActivity, isPending: isAddingActivity } = usePostApiDealActivity();
  const { mutateAsync: createReservation, isPending: isCreatingResv } = usePostApiReservation();
  const { mutateAsync: approveReservation } = usePatchApiApproveReservation();
  const { mutateAsync: rejectReservation } = usePatchApiRejectReservation();

  const handleStatusChange = async (newStatus: string) => {
    if (!deal || deal.status === newStatus) return;
    try {
      await updateDeal({ id, data: { status: newStatus as UpdateDealDtoStatus } });
      toast.success("Đã cập nhật trạng thái");
      refetch();
    } catch (err) {
      toast.error((err as any)?.response?.data?.error?.message?.[0] || "Cập nhật trạng thái thất bại");
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDeal({ id });
      toast.success(`Đã xóa giao dịch "${deal?.dealCode}"`);
      router.push(portalPath("/deals"));
    } catch (err) {
      toast.error((err as any)?.response?.data?.error?.message?.[0] || "Xóa giao dịch thất bại");
      console.error(err);
    }
  };

  const handleAddActivity = async () => {
    if (!activityContent.trim()) return;
    try {
      await addActivity({
        id,
        data: {
          activityType: activityType as any,
          content: activityContent,
        },
      });
      toast.success("Đã thêm hoạt động");
      setActivityContent("");
      refetchActivities();
    } catch (err) {
      toast.error((err as any)?.response?.data?.error?.message?.[0] || "Thêm hoạt động thất bại");
      console.error(err);
    }
  };

  const handleCreateReservation = async () => {
    if (!deal || !resvStartsAt || !resvExpiresAt) return;
    try {
      await createReservation({
        data: {
          dealId: deal.id,
          propertyId: deal.property?.id ?? "",
          customerId: deal.customer?.id || undefined,
          reservationType: resvType as any,
          startsAt: resvStartsAt,
          expiresAt: resvExpiresAt,
          note: resvNote || undefined,
        },
      });
      toast.success("Đã tạo reservation");
      setResvOpen(false);
      setResvStartsAt("");
      setResvExpiresAt("");
      setResvNote("");
      refetchReservations();
    } catch (err) {
      toast.error((err as any)?.response?.data?.error?.message?.[0] || "Tạo reservation thất bại");
      console.error(err);
    }
  };

  const handleApprove = async (resvId: string) => {
    try {
      await approveReservation({ id: resvId });
      toast.success("Đã duyệt reservation");
      refetchReservations();
    } catch (err) {
      toast.error((err as any)?.response?.data?.error?.message?.[0] || "Duyệt reservation thất bại");
      console.error(err);
    }
  };

  const handleReject = async (resvId: string) => {
    try {
      await rejectReservation({ id: resvId });
      toast.success("Đã từ chối reservation");
      refetchReservations();
    } catch (err) {
      toast.error((err as any)?.response?.data?.error?.message?.[0] || "Từ chối reservation thất bại");
      console.error(err);
    }
  };

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

  if (!deal) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push(portalPath("/deals"))}
            className="rounded-md p-2 text-foreground-muted hover:bg-surface-muted"
            aria-label="Quay lại"
          >
            <ArrowLeft size={20} />
          </button>
          <PageHeader eyebrow="Giao dịch" title="Không tìm thấy" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push(portalPath("/deals"))}
            className="rounded-md p-2 text-foreground-muted hover:bg-surface-muted"
            aria-label="Quay lại"
          >
            <ArrowLeft size={20} />
          </button>
          <PageHeader eyebrow="Giao dịch" title={deal.dealCode} />
        </div>
        <div className="flex items-center gap-2">
          <Can I="UPDATE_OWN" a="DEAL">
            <Button variant="outline" onClick={() => router.push(portalPath(`/deals/${id}/edit`))}>
              <Pencil size={16} />
              Chỉnh sửa
            </Button>
          </Can>
          <Can I="DELETE_OWN" a="DEAL">
            <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
              <Trash2 size={16} />
              Xóa
            </Button>
          </Can>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Main info */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="rounded-lg border border-border bg-surface p-6">
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="blue">{txLabel[deal.transactionType] ?? deal.transactionType}</Badge>
              <Badge variant={statusVariant[deal.status] ?? "default"}>
                {statusLabel[deal.status] ?? deal.status}
              </Badge>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-2">
                <SquareKanban size={16} className="text-foreground-muted shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-xs font-medium uppercase tracking-wide text-foreground-muted">Mã giao dịch</span>
                  <span className="text-sm font-medium tabular-nums">{deal.dealCode}</span>
                </div>
              </div>
              {deal.expectedValue && (
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium uppercase tracking-wide text-foreground-muted">Giá trị dự kiến</span>
                  <span className="text-sm tabular-nums font-medium">{formatPrice(deal.expectedValue)}</span>
                </div>
              )}
              {deal.finalValue && (
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium uppercase tracking-wide text-foreground-muted">Giá trị cuối</span>
                  <span className="text-sm tabular-nums font-medium">{formatPrice(deal.finalValue)}</span>
                </div>
              )}
              {deal.customer && (
                <div className="flex items-start gap-2">
                  <User size={16} className="text-foreground-muted shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="text-xs font-medium uppercase tracking-wide text-foreground-muted">Khách hàng</span>
                    <button
                      onClick={() => router.push(portalPath(`/customers/${deal.customer!.id}`))}
                      className="text-left text-sm text-primary hover:underline"
                    >
                      {deal.customer.fullName}
                    </button>
                  </div>
                </div>
              )}
              {deal.property && (
                <div className="flex items-start gap-2">
                  <House size={16} className="text-foreground-muted shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="text-xs font-medium uppercase tracking-wide text-foreground-muted">BĐS</span>
                    <button
                      onClick={() => router.push(portalPath(`/properties/${deal.property!.id}`))}
                      className="text-left text-sm text-primary hover:underline"
                    >
                      {deal.property.title}
                    </button>
                    <span className="text-xs text-foreground-muted">#{deal.property.propertyCode}</span>
                  </div>
                </div>
              )}
              {deal.lead && (
                <div className="flex items-start gap-2">
                  <SquareKanban size={16} className="text-foreground-muted shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="text-xs font-medium uppercase tracking-wide text-foreground-muted">Nguồn khách hàng</span>
                    <button
                      onClick={() => router.push(portalPath(`/leads/${deal.lead!.id}`))}
                      className="text-left text-sm text-primary hover:underline"
                    >
                      {deal.lead.leadCode}
                    </button>
                  </div>
                </div>
              )}
              {deal.createdAt && (
                <div className="flex items-start gap-2">
                  <Clock size={16} className="text-foreground-muted shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="text-xs font-medium uppercase tracking-wide text-foreground-muted">Ngày tạo</span>
                    <span className="text-sm tabular-nums">
                      {new Date(deal.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Status update */}
          <Can I="UPDATE_OWN" a="DEAL">
            <div className="rounded-lg border border-border bg-surface p-6">
              <h3 className="text-sm font-semibold mb-4">Cập nhật trạng thái</h3>
              <div className="flex flex-wrap items-center gap-2">
                {statusOptions.map((opt) => (
                  <Button
                    key={opt.value}
                    variant={deal.status === opt.value ? "default" : "outline"}
                    size="sm"
                    disabled={isUpdating || deal.status === opt.value}
                    onClick={() => handleStatusChange(opt.value)}
                  >
                    {opt.label}
                  </Button>
                ))}
              </div>
            </div>
          </Can>

          {/* Reservations */}
          <div className="rounded-lg border border-border bg-surface p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <SquareKanban size={16} className="text-foreground-muted" />
                <h3 className="text-sm font-semibold">Reservations</h3>
                <Badge variant="secondary">{reservations.length}</Badge>
              </div>
              <Can I="CREATE" a="DEAL">
                <Button size="sm" variant="outline" onClick={() => setResvOpen(true)}>
                  Thêm reservation
                </Button>
              </Can>
            </div>
            {reservations.length > 0 ? (
              <div className="flex flex-col gap-2">
                {reservations.map((resv) => {
                  const cfg = reservationStatusLabel[resv.status] ?? { label: resv.status, variant: "default" as const };
                  return (
                    <div
                      key={resv.id}
                      className="flex flex-col gap-2 rounded-lg border border-border bg-surface-muted/40 p-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="default" className="text-[10px]">
                            {reservationTypeLabel[resv.reservationType] ?? resv.reservationType}
                          </Badge>
                          <Badge variant={cfg.variant}>{cfg.label}</Badge>
                        </div>
                        <span className="text-xs tabular-nums text-foreground-muted">
                          {new Date(resv.startsAt).toLocaleDateString("vi-VN")} — {new Date(resv.expiresAt).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                      {resv.note && <p className="text-sm whitespace-pre-wrap">{resv.note}</p>}
                      {resv.status === "PENDING" && (
                        <div className="flex items-center gap-2">
                          <Can I="APPROVE" a="DEAL">
                            <Button size="xs" variant="default" onClick={() => handleApprove(resv.id)}>
                              Duyệt
                            </Button>
                            <Button size="xs" variant="outline" onClick={() => handleReject(resv.id)}>
                              Từ chối
                            </Button>
                          </Can>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-foreground-muted">Chưa có reservation nào</p>
            )}
          </div>

          {/* Activities */}
          <div className="rounded-lg border border-border bg-surface p-6">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare size={16} className="text-foreground-muted" />
              <h3 className="text-sm font-semibold">Lịch sử hoạt động</h3>
              <Badge variant="secondary">{activities.length}</Badge>
            </div>

            <div className="flex flex-col gap-2 mb-4 rounded-lg border border-border bg-surface-muted/40 p-3">
              <div className="flex items-center gap-2">
                <Select
                  value={activityType}
                  items={activityTypeLabel}
                  onValueChange={(v) => v && setActivityType(v)}
                >
                  <SelectTrigger size="sm" className="h-8 w-[180px] text-xs">
                    <SelectValue placeholder="Loại hoạt động" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(activityTypeLabel).map(([value, label]) => (
                      <SelectItem key={value} value={value} label={label}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Textarea
                placeholder="Nội dung ghi chú / cuộc gọi..."
                value={activityContent}
                onChange={(e) => setActivityContent(e.target.value)}
                className="min-h-16"
              />
              <div className="flex justify-end">
                <Button
                  size="sm"
                  disabled={isAddingActivity || !activityContent.trim()}
                  onClick={handleAddActivity}
                >
                  {isAddingActivity ? "Đang lưu..." : "Thêm hoạt động"}
                </Button>
              </div>
            </div>

            {activities.length > 0 ? (
              <div className="flex flex-col gap-2">
                {activities.map((act) => (
                  <div
                    key={act.id}
                    className="flex flex-col gap-1 rounded-lg border border-border bg-surface-muted/40 p-3"
                  >
                    <div className="flex items-center justify-between">
                      <Badge variant="default" className="text-[10px]">
                        {activityTypeLabel[act.activityType] ?? act.activityType}
                      </Badge>
                      <span className="text-xs tabular-nums text-foreground-muted">
                        {new Date(act.createdAt).toLocaleString("vi-VN")}
                      </span>
                    </div>
                    {act.content && <p className="text-sm whitespace-pre-wrap">{act.content}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-foreground-muted">Chưa có hoạt động nào</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-4">
          <div className="rounded-lg border border-border bg-surface p-6">
            <h3 className="text-sm font-semibold mb-4">Thông tin liên quan</h3>
            <div className="flex flex-col gap-4 text-sm">
              <div className="flex items-start gap-2">
                <SquareKanban size={16} className="text-foreground-muted shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-xs text-foreground-muted">Workflow state</span>
                  <span className="text-sm font-medium">
                    {deal.currentWorkflowState ?? "—"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogPortal>
          <DialogOverlay />
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Xóa giao dịch</DialogTitle>
              <DialogDescription>
                Hành động này sẽ ẩn giao dịch (soft delete). Bạn có chắc chắn?
              </DialogDescription>
            </DialogHeader>
            <div className="rounded-lg border border-border bg-surface-muted/40 p-4 text-sm">
              <p className="font-medium">{deal.dealCode}</p>
              {deal.customer?.fullName && (
                <p className="text-foreground-muted">{deal.customer.fullName}</p>
              )}
            </div>
            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" onClick={() => setDeleteOpen(false)}>Hủy</Button>
              <Button variant="destructive" disabled={isDeleting} onClick={handleDelete}>
                {isDeleting ? "Đang xóa..." : "Xóa"}
              </Button>
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>

      {/* Create reservation dialog */}
      <Dialog open={resvOpen} onOpenChange={setResvOpen}>
        <DialogPortal>
          <DialogOverlay />
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Tạo reservation</DialogTitle>
              <DialogDescription>
                Đặt giữ BĐS cho giao dịch này.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold tracking-wide text-foreground-muted">Loại reservation</label>
                <Select
                  value={resvType}
                  items={{ SOFT: "Cọc mềm", HARD: "Cọc cứng" }}
                  onValueChange={(v) => v && setResvType(v)}
                >
                  <SelectTrigger className="h-9 w-full">
                    <SelectValue placeholder="Chọn loại reservation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SOFT" label="Cọc mềm">Cọc mềm</SelectItem>
                    <SelectItem value="HARD" label="Cọc cứng">Cọc cứng</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold tracking-wide text-foreground-muted">Bắt đầu</label>
                  <Input
                    type="datetime-local"
                    value={resvStartsAt}
                    onChange={(e) => setResvStartsAt(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold tracking-wide text-foreground-muted">Hết hạn</label>
                  <Input
                    type="datetime-local"
                    value={resvExpiresAt}
                    onChange={(e) => setResvExpiresAt(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold tracking-wide text-foreground-muted">Ghi chú</label>
                <Textarea
                  value={resvNote}
                  onChange={(e) => setResvNote(e.target.value)}
                  placeholder="Ghi chú (tùy chọn)"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" onClick={() => setResvOpen(false)}>Hủy</Button>
              <Button
                disabled={isCreatingResv || !resvStartsAt || !resvExpiresAt}
                onClick={handleCreateReservation}
              >
                {isCreatingResv ? "Đang lưu..." : "Tạo reservation"}
              </Button>
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </div>
  );
}
