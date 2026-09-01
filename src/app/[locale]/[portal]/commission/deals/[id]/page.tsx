"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { usePortalPath } from "@/lib/hooks/use-portal";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, Check, X, DollarSign, Ban, Trash2 } from "lucide-react";
import { Can } from "@casl/react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  useGetApiDealCommissionId,
  usePostApiDealCommissionConfirm,
  usePostApiDealCommissionApprove,
  usePostApiDealCommissionReject,
  usePostApiDealCommissionMarkPaid,
  useDeleteApiDealCommissionId,
  getGetApiDealCommissionsQueryKey,
  getGetApiDealCommissionIdQueryKey,
} from "@/lib/api/endpoints/commission";

interface DealCommission {
  id: string;
  status: string;
  transactionValueEstimated: string | null;
  transactionValueConfirmed: string | null;
  totalCommissionEstimated: string | null;
  totalCommissionConfirmed: string | null;
  calculationSnapshotJson: any;
  createdAt: string;
  updatedAt: string;
  plan?: { id: string; name: string; status: string };
  items?: Array<{
    id: string;
    receiverType: string;
    receiverRole?: string;
    amountEstimated: string | null;
    amountConfirmed: string | null;
    status: string;
    receiverUser?: { id: string; fullName: string; email: string };
  }>;
  ledgers?: Array<{
    id: string;
    eventType: string;
    amountBefore: string | null;
    amountAfter: string | null;
    changedBy: string | null;
    reason?: string;
    createdAt: string;
  }>;
}

const statusVariant: Record<string, "default" | "green" | "yellow" | "blue" | "red" | "purple"> = {
  DRAFT: "default",
  ESTIMATED: "blue",
  CONFIRMED: "yellow",
  APPROVED: "green",
  PAID: "green",
  DISPUTED: "red",
  CANCELLED: "default",
};

const statusLabel: Record<string, string> = {
  DRAFT: "Nháp",
  ESTIMATED: "Đã ước tính",
  CONFIRMED: "Đã xác nhận",
  APPROVED: "Đã duyệt",
  PAID: "Đã thanh toán",
  DISPUTED: "Tranh chấp",
  CANCELLED: "Đã hủy",
};

const formatVnd = (v: string | null | undefined) => {
  if (!v) return "—";
  const n = Number(v);
  if (isNaN(n)) return v;
  return n.toLocaleString("vi-VN") + " ₫";
};

export default function DealCommissionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const portalPath = usePortalPath();
  const queryClient = useQueryClient();
  const id = params.id as string;

  const { data: dcData, isLoading } = useGetApiDealCommissionId(id);
  const dc = (dcData as unknown as { data: DealCommission })?.data;

  const [actionOpen, setActionOpen] = useState<null | "approve" | "reject" | "markPaid" | "delete">(null);
  const [actionReason, setActionReason] = useState("");
  const [executing, setExecuting] = useState(false);

  const { mutateAsync: confirm } = usePostApiDealCommissionConfirm();
  const { mutateAsync: approve } = usePostApiDealCommissionApprove();
  const { mutateAsync: reject } = usePostApiDealCommissionReject();
  const { mutateAsync: markPaid } = usePostApiDealCommissionMarkPaid();
  const { mutateAsync: deleteDc } = useDeleteApiDealCommissionId();

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: getGetApiDealCommissionsQueryKey() });
    queryClient.invalidateQueries({ queryKey: getGetApiDealCommissionIdQueryKey(id) });
  };

  const handleConfirm = async () => {
    setExecuting(true);
    try {
      await confirm({ id, data: {} as any });
      toast.success("Đã xác nhận hoa hồng");
      refresh();
    } catch (err: any) {
      toast.error(err?.response?.data?.message?.[0] || "Có lỗi xảy ra");
    } finally {
      setExecuting(false);
    }
  };

  const handleAction = async () => {
    if (!actionOpen) return;
    setExecuting(true);
    try {
      if (actionOpen === "approve") {
        await approve({ id, data: { reason: actionReason || undefined } });
        toast.success("Đã duyệt hoa hồng");
      } else if (actionOpen === "reject") {
        await reject({ id, data: { reason: actionReason || undefined } });
        toast.success("Đã từ chối hoa hồng");
      } else if (actionOpen === "markPaid") {
        await markPaid({ id, data: { reason: actionReason || undefined } });
        toast.success("Đã đánh dấu đã thanh toán");
      } else if (actionOpen === "delete") {
        await deleteDc({ id });
        toast.success("Đã xóa hoa hồng");
        router.push(portalPath("/commission/deals"));
        return;
      }
      setActionOpen(null);
      setActionReason("");
      refresh();
    } catch (err: any) {
      toast.error(err?.response?.data?.message?.[0] || "Có lỗi xảy ra");
    } finally {
      setExecuting(false);
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

  if (!dc) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push(portalPath("/commission/deals"))} className="rounded-md p-2 text-foreground-muted hover:bg-surface-muted">
            <ArrowLeft size={20} />
          </button>
          <PageHeader eyebrow="Hoa hồng" title="Không tìm thấy" />
        </div>
      </div>
    );
  }

  const actionTitleMap: Record<string, string> = {
    approve: "Duyệt hoa hồng",
    reject: "Từ chối hoa hồng",
    markPaid: "Đánh dấu đã thanh toán",
    delete: "Xóa hoa hồng",
  };
  const actionTitle = actionOpen ? actionTitleMap[actionOpen] ?? "" : "";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push(portalPath("/commission/deals"))} className="rounded-md p-2 text-foreground-muted hover:bg-surface-muted">
            <ArrowLeft size={20} />
          </button>
          <PageHeader
            eyebrow="Hoa hồng"
            title={`Giao dịch ${dc.plan?.name ?? ""}`}
          />
        </div>
        <Badge variant={statusVariant[dc.status] ?? "default"} className="text-sm">
          {statusLabel[dc.status] ?? dc.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Summary */}
          <div className="rounded-lg border border-border bg-surface p-6">
            <h3 className="text-sm font-semibold mb-4">Tổng quan</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-foreground-muted">Giá ước tính</span>
                <p className="text-sm font-medium tabular-nums">{formatVnd(dc.transactionValueEstimated)}</p>
              </div>
              <div>
                <span className="text-xs text-foreground-muted">Giá thực tế</span>
                <p className="text-sm font-medium tabular-nums">{formatVnd(dc.transactionValueConfirmed)}</p>
              </div>
              <div>
                <span className="text-xs text-foreground-muted">Hoa hồng ước tính</span>
                <p className="text-sm font-medium tabular-nums text-primary">{formatVnd(dc.totalCommissionEstimated)}</p>
              </div>
              <div>
                <span className="text-xs text-foreground-muted">Hoa hồng thực tế</span>
                <p className="text-sm font-medium tabular-nums text-primary">{formatVnd(dc.totalCommissionConfirmed)}</p>
              </div>
            </div>
          </div>

          {/* Items */}
          {dc.items && dc.items.length > 0 && (
            <div className="rounded-lg border border-border bg-surface p-6">
              <h3 className="text-sm font-semibold mb-4">Phân chia</h3>
              <div className="flex flex-col gap-3">
                {dc.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {item.receiverUser?.fullName ?? item.receiverRole ?? item.receiverType}
                      </span>
                      <span className="text-xs text-foreground-muted">{item.status}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-sm tabular-nums">{formatVnd(item.amountConfirmed)}</span>
                      <span className="text-xs text-foreground-muted tabular-nums">
                        ước tính: {formatVnd(item.amountEstimated)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ledger */}
          {dc.ledgers && dc.ledgers.length > 0 && (
            <div className="rounded-lg border border-border bg-surface p-6">
              <h3 className="text-sm font-semibold mb-4">Lịch sử</h3>
              <div className="flex flex-col gap-2">
                {dc.ledgers.map((l) => (
                  <div key={l.id} className="flex items-center justify-between text-sm">
                    <div className="flex flex-col">
                      <span className="font-medium">{l.eventType}</span>
                      {l.reason && <span className="text-xs text-foreground-muted">{l.reason}</span>}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-foreground-muted">
                      <span className="tabular-nums">{formatVnd(l.amountAfter)}</span>
                      <span>{new Date(l.createdAt).toLocaleDateString("vi-VN")}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar actions */}
        <div className="flex flex-col gap-4">
          <div className="rounded-lg border border-border bg-surface p-6">
            <h3 className="text-sm font-semibold mb-4">Hành động</h3>
            <div className="flex flex-col gap-2">
              <Can I="APPROVE" a="COMMISSION">
                {dc.status === "ESTIMATED" || dc.status === "DRAFT" ? (
                  <Button onClick={handleConfirm} disabled={executing} className="w-full justify-start">
                    <Check size={16} /> Xác nhận giá thực tế
                  </Button>
                ) : null}
                {dc.status === "CONFIRMED" ? (
                  <Button onClick={() => setActionOpen("approve")} className="w-full justify-start">
                    <Check size={16} /> Duyệt hoa hồng
                  </Button>
                ) : null}
                {dc.status === "APPROVED" ? (
                  <Button onClick={() => setActionOpen("markPaid")} className="w-full justify-start">
                    <DollarSign size={16} /> Đánh dấu đã thanh toán
                  </Button>
                ) : null}
                {dc.status !== "PAID" && dc.status !== "CANCELLED" ? (
                  <Button variant="outline" onClick={() => setActionOpen("reject")} className="w-full justify-start">
                    <Ban size={16} /> Từ chối
                  </Button>
                ) : null}
                {dc.status !== "APPROVED" && dc.status !== "PAID" ? (
                  <Button variant="outline" onClick={() => setActionOpen("delete")} className="w-full justify-start text-destructive">
                    <Trash2 size={16} /> Xóa
                  </Button>
                ) : null}
              </Can>
              {dc.status === "PAID" && (
                <p className="text-xs text-foreground-muted py-2">
                  Hoa hồng đã thanh toán, không thể thay đổi.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action dialog */}
      <Dialog open={!!actionOpen} onOpenChange={(open) => !open && setActionOpen(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{actionTitle}</DialogTitle>
            <DialogDescription>
              {actionOpen === "delete"
                ? "Hành động này không thể hoàn tác. Hoa hồng sẽ bị xóa vĩnh viễn."
                : "Bạn có chắc muốn thực hiện hành động này?"}
            </DialogDescription>
          </DialogHeader>
          <div>
            <label className="text-xs font-medium text-foreground-muted">Lý do (tùy chọn)</label>
            <Textarea
              value={actionReason}
              onChange={(e) => setActionReason(e.target.value)}
              rows={2}
              placeholder="Ghi chú..."
            />
          </div>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>Hủy</DialogClose>
            <Button
              onClick={handleAction}
              disabled={executing}
              variant={actionOpen === "delete" || actionOpen === "reject" ? "destructive" : "default"}
            >
              {executing ? "Đang xử lý..." : "Xác nhận"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
