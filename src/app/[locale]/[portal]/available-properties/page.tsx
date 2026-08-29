"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Handshake, Loader2, Search } from "lucide-react";
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

interface AvailableProperty {
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
  _count: { assignments: number };
}

interface AvailablePropertiesResponse {
  success: boolean;
  data: AvailableProperty[];
  meta: { total: number; limit: number; offset: number };
}

const txLabel: Record<string, string> = {
  SALE: "Bán",
  RENT: "Cho thuê",
  TRANSFER: "Chuyển nhượng",
  INVESTMENT: "Đầu tư",
};

const sellingModeLabel: Record<string, string> = {
  SALES_DISTRIBUTION: "Phân phối sales",
  HYBRID: "Kết hợp",
};

export default function AvailablePropertiesPage() {
  const router = useRouter();
  const portalPath = usePortalPath();
  const [search, setSearch] = useState("");
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const pagination = usePagination(12);

  const [data, setData] = useState<AvailablePropertiesResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await customInstance<AvailablePropertiesResponse>({
        url: "/api/properties/available-for-assignment",
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

  const properties = data?.data ?? [];
  const meta = data?.meta;
  const totalPages = Math.max(1, Math.ceil((meta?.total ?? 0) / pagination.pageSize));

  const handleClaim = async (propertyId: string) => {
    setClaimingId(propertyId);
    try {
      await customInstance({
        url: "/api/assignments",
        method: "POST",
        data: {
          propertyId,
          assignmentType: "SALES",
          source: "SELF_ASSIGN",
        },
      });
      toast.success("Nhận phụ trách thành công");
      fetchData();
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Có lỗi khi nhận phụ trách";
      toast.error(msg);
    } finally {
      setClaimingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Phụ trách"
        title="Bất động sản có thể nhận"
        description="Danh sách bất động sản đang mở nhận phụ trách. Nhận để tạo link/QR riêng và bắt đầu khai thác."
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
            <div key={i} className="h-48 animate-pulse rounded-lg bg-surface-muted" />
          ))}
        </div>
      ) : properties.length === 0 ? (
        <EmptyState
          icon={<Handshake size={24} />}
          title="Không có sản phẩm nào"
          description="Hiện không có bất động sản nào đang mở nhận phụ trách. Vui lòng quay lại sau."
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((p) => (
              <div
                key={p.id}
                className="group flex flex-col gap-3 rounded-lg border border-border bg-surface p-4 transition-all duration-300 hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.08)]"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex min-w-0 flex-col gap-1">
                    <span className="font-mono text-[10px] tabular-nums text-foreground-muted">
                      {p.propertyCode}
                    </span>
                    <h3
                      className="cursor-pointer truncate text-base font-semibold leading-tight tracking-tight transition-colors group-hover:text-primary"
                      onClick={() => router.push(portalPath(`/available-properties/${p.id}`))}
                    >
                      {p.title}
                    </h3>
                  </div>
                  <Badge variant="blue" className="shrink-0 text-[10px]">
                    {sellingModeLabel[p.sellingMode] ?? p.sellingMode}
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
                  <div className="flex items-center justify-between">
                    <span className="text-foreground-muted">Đang phụ trách</span>
                    <span className="text-foreground">{p._count.assignments} sales</span>
                  </div>
                </div>

                <Button
                  className="mt-1 w-full"
                  size="sm"
                  onClick={() => handleClaim(p.id)}
                  disabled={claimingId === p.id}
                >
                  {claimingId === p.id ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Đang nhận...
                    </>
                  ) : (
                    <>
                      <Handshake size={14} />
                      Nhận phụ trách
                    </>
                  )}
                </Button>
              </div>
            ))}
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
