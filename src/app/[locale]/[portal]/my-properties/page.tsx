"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Handshake, Loader2, Link2, QrCode, Search, XCircle } from "lucide-react";
import { usePortalPath } from "@/lib/hooks/use-portal";
import { formatPrice } from "@/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { usePagination } from "@/lib/hooks/use-pagination";
import { PaginationBar } from "@/components/shared/pagination-bar";
import { customInstance } from "@/lib/api/mutator/custom-instance";

interface MyAssignment {
  id: string;
  propertyId: string;
  assignmentType: string;
  source: string;
  startsAt: string;
  expiresAt: string;
  status: string;
  publicLinkCode: string | null;
  createdAt: string;
  property: {
    id: string;
    propertyCode: string;
    title: string;
    slug: string;
    transactionType: string;
    sellingMode: string;
    price: string;
    priceUnit: string;
    area: number | null;
    areaUnit: string | null;
    businessStatus: string;
    propertyType: { id: string; name: string; code: string; group: string };
    province: { id: string; name: string; code: string } | null;
    district: { id: string; name: string; code: string } | null;
    project: { id: string; name: string } | null;
  };
}

interface MyAssignmentsResponse {
  success: boolean;
  data: MyAssignment[];
  meta: { total: number; limit: number; offset: number };
}

const txLabel: Record<string, string> = {
  SALE: "Bán",
  RENT: "Cho thuê",
  TRANSFER: "Chuyển nhượng",
  INVESTMENT: "Đầu tư",
};

const statusConfig: Record<string, { label: string; variant: "green" | "yellow" | "red" | "default" }> = {
  ACTIVE: { label: "Đang phụ trách", variant: "green" },
  EXPIRED: { label: "Hết hạn", variant: "yellow" },
  REVOKED: { label: "Đã huỷ", variant: "red" },
};

function daysLeft(expiresAt: string): number {
  const now = new Date();
  const exp = new Date(expiresAt);
  return Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export default function MyPropertiesPage() {
  const router = useRouter();
  const portalPath = usePortalPath();
  const [search, setSearch] = useState("");
  const [data, setData] = useState<MyAssignmentsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const pagination = usePagination(12);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await customInstance<MyAssignmentsResponse>({
        url: "/api/assignments/mine",
        method: "GET",
        params: {
          search: search.trim() || undefined,
          limit: pagination.limit,
          offset: pagination.offset,
        },
      });
      setData(res);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pagination.limit, pagination.offset]);

  const assignments = data?.data ?? [];
  const meta = data?.meta;
  const totalPages = Math.max(1, Math.ceil((meta?.total ?? 0) / pagination.pageSize));

  const handleRevoke = async (assignmentId: string) => {
    if (!confirm("Bạn chắc chắn muốn huỷ phụ trách sản phẩm này?")) return;
    setRevokingId(assignmentId);
    try {
      await customInstance({
        url: `/api/assignments/${assignmentId}/revoke`,
        method: "PATCH",
      });
      toast.success("Đã huỷ phụ trách");
      fetchData();
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Có lỗi khi huỷ phụ trách";
      toast.error(msg);
    } finally {
      setRevokingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Phụ trách"
        title="Bất động sản đang phụ trách"
        description="Danh sách bất động sản bạn đang phụ trách. Quản lý link/QR riêng và huỷ phụ trách khi cần."
      />

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" />
          <Input
            type="search"
            placeholder="Tìm theo tên, mã BĐS..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchData()}
            className="pl-9"
          />
        </div>
        <Button variant="outline" onClick={fetchData}>
          Tìm
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-56 animate-pulse rounded-lg bg-surface-muted" />
          ))}
        </div>
      ) : assignments.length === 0 ? (
        <EmptyState
          icon={<Handshake size={24} />}
          title="Chưa phụ trách sản phẩm nào"
          description="Nhận phụ trách bất động sản từ danh sách sản phẩm khả dụng để bắt đầu khai thác."
          action={
            <Button onClick={() => router.push(portalPath("/available-properties"))}>
              <Handshake size={16} />
              Xem sản phẩm khả dụng
            </Button>
          }
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {assignments.map((a) => {
              const status = statusConfig[a.status] ?? statusConfig.REVOKED;
              const left = daysLeft(a.expiresAt);
              const p = a.property;
              return (
                <div
                  key={a.id}
                  className="group flex flex-col gap-3 rounded-lg border border-border bg-surface p-4 transition-all duration-300 hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.08)]"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex min-w-0 flex-col gap-1">
                      <span className="font-mono text-[10px] tabular-nums text-foreground-muted">
                        {p.propertyCode}
                      </span>
                      <h3
                        className="cursor-pointer truncate text-base font-semibold leading-tight tracking-tight transition-colors group-hover:text-primary"
                        onClick={() => router.push(portalPath(`/my-properties/${a.id}`))}
                      >
                        {p.title}
                      </h3>
                    </div>
                    <Badge variant={status.variant} className="shrink-0 text-[10px]">
                      {status.label}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    <Badge variant="outline" className="text-[10px]">
                      {p.propertyType.name}
                    </Badge>
                    <Badge variant="outline" className="text-[10px]">
                      {txLabel[p.transactionType] ?? p.transactionType}
                    </Badge>
                    {p.project && (
                      <Badge variant="outline" className="text-[10px]">
                        {p.project.name}
                      </Badge>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5 border-t border-border pt-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-foreground-muted">Giá</span>
                      <strong className="tabular-nums text-foreground">
                        {formatPrice(Number(p.price || 0))}
                      </strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-foreground-muted">Diện tích</span>
                      <strong className="tabular-nums text-foreground">
                        {p.area ? `${p.area} m²` : "—"}
                      </strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-foreground-muted">Vị trí</span>
                      <span className="text-right text-foreground">
                        {[p.district?.name, p.province?.name].filter(Boolean).join(", ") || "—"}
                      </span>
                    </div>
                    {a.status === "ACTIVE" && (
                      <div className="flex items-center justify-between">
                        <span className="text-foreground-muted">Còn lại</span>
                        <span className={`font-medium ${left <= 1 ? "text-destructive" : left <= 3 ? "text-accent-yellow-text" : "text-foreground"}`}>
                          {left > 0 ? `${left} ngày` : "Hết hôm nay"}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 border-t border-border pt-2.5">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="flex-1"
                      title="Sao chép link chia sẻ (có ref code)"
                      disabled={!a.publicLinkCode}
                      onClick={() => {
                        if (!a.publicLinkCode) {
                          toast.error("Chưa có mã link riêng");
                          return;
                        }
                        const url = `${window.location.origin}/vi/listings/${p.propertyCode}?ref=${a.publicLinkCode}`;
                        navigator.clipboard.writeText(url);
                        toast.success("Đã sao chép link chia sẻ");
                      }}
                    >
                      <Link2 size={14} />
                      Link riêng
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="flex-1"
                      title="Mã QR"
                      disabled
                    >
                      <QrCode size={14} />
                      QR code
                    </Button>
                    {a.status === "ACTIVE" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="px-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        title="Huỷ phụ trách"
                        onClick={() => handleRevoke(a.id)}
                        disabled={revokingId === a.id}
                      >
                        {revokingId === a.id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <XCircle size={14} />
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <PaginationBar
            pageSize={pagination.pageSize}
            setPageSize={pagination.setPageSize}
            currentPage={pagination.currentPage}
            setCurrentPage={pagination.setCurrentPage}
            totalPages={totalPages}
          />
        </>
      )}
    </div>
  );
}
