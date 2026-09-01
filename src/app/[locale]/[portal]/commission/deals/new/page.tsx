"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { usePortalPath } from "@/lib/hooks/use-portal";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { FormSection, FormField } from "@/components/shared/form-section";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useGetApiDeals } from "@/lib/api/endpoints/deals-reservations";
import {
  useGetApiDealCommissions,
  usePostApiDealCommission,
  getGetApiDealCommissionsQueryKey,
} from "@/lib/api/endpoints/commission";

interface DealRow {
  id: string;
  dealCode: string;
  status: string;
  expectedValue?: string;
  finalValue?: string;
  property?: { id: string; title: string; price?: string };
  customer?: { id: string; fullName: string };
}

export default function EstimateCommissionPage() {
  const router = useRouter();
  const portalPath = usePortalPath();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [selectedDealId, setSelectedDealId] = useState(searchParams.get("dealId") ?? "");

  const { data: dealsData, isLoading: dealsLoading } = useGetApiDeals({
    limit: "50",
    offset: "0",
  });
  const deals = ((dealsData as unknown as { data: DealRow[] })?.data) || [];

  const { mutateAsync: createDc } = usePostApiDealCommission();

  // Pre-select deal from query param
  useEffect(() => {
    const qDealId = searchParams.get("dealId");
    if (qDealId && !selectedDealId) setSelectedDealId(qDealId);
  }, [searchParams, selectedDealId]);

  const selectedDeal = deals.find((d) => d.id === selectedDealId);
  const propertyId = selectedDeal?.property?.id ?? "";

  // Check existing commissions for this deal
  const { data: existingDcs } = useGetApiDealCommissions(
    { dealId: selectedDealId || undefined, status: undefined },
    { query: { enabled: !!selectedDealId } },
  ) as any;
  const existingList = ((existingDcs as unknown as { data: any[] })?.data) || [];

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDealId) {
      toast.error("Vui lòng chọn giao dịch");
      return;
    }
    if (!propertyId) {
      toast.error("Giao dịch không có bất động sản");
      return;
    }
    setLoading(true);
    try {
      const result = await createDc({
        data: {
          dealId: selectedDealId,
          propertyId,
        } as any,
      });
      const dcId = (result as any)?.data?.id ?? (result as any)?.id;
      toast.success("Đã tạo ước tính hoa hồng");
      queryClient.invalidateQueries({ queryKey: getGetApiDealCommissionsQueryKey() });
      if (dcId) {
        router.push(portalPath(`/commission/deals/${dcId}`));
      } else {
        router.push(portalPath("/commission/deals"));
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message?.[0] || "Có lỗi xảy ra khi tạo ước tính");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.push(portalPath("/commission/deals"))} className="rounded-md p-2 text-foreground-muted hover:bg-surface-muted" aria-label="Quay lại">
          <ArrowLeft size={20} />
        </button>
        <PageHeader eyebrow="Hoa hồng" title="Tạo ước tính hoa hồng" />
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <FormSection
          title="Chọn giao dịch"
          description="Chọn giao dịch để ước tính hoa hồng dựa trên gói đang hoạt động"
        >
          <FormField label="Giao dịch" required>
            {dealsLoading ? (
              <div className="flex items-center gap-2 text-sm text-foreground-muted">
                <Loader2 size={14} className="animate-spin" />
                Đang tải giao dịch...
              </div>
            ) : deals.length === 0 ? (
              <p className="text-sm text-foreground-muted py-2">
                Không có giao dịch nào. Vui lòng tạo giao dịch trước.
              </p>
            ) : (
              <Select
                value={selectedDealId}
                items={Object.fromEntries(deals.map((d) => [d.id, `${d.dealCode} — ${d.property?.title ?? "—"}`]))}
                onValueChange={(v) => v && setSelectedDealId(v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn giao dịch..." />
                </SelectTrigger>
                <SelectContent>
                  {deals.map((d) => (
                    <SelectItem
                      key={d.id}
                      value={d.id}
                      label={`${d.dealCode} — ${d.property?.title ?? "—"}`}
                    >
                      {d.dealCode} — {d.property?.title ?? "—"}
                      {d.customer?.fullName ? ` (${d.customer.fullName})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </FormField>

          {selectedDeal && (
            <div className="rounded-lg border border-border bg-surface-muted/40 p-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-xs text-foreground-muted">Mã giao dịch</span>
                  <p className="font-medium">{selectedDeal.dealCode}</p>
                </div>
                <div>
                  <span className="text-xs text-foreground-muted">Bất động sản</span>
                  <p className="font-medium">{selectedDeal.property?.title ?? "—"}</p>
                </div>
                <div>
                  <span className="text-xs text-foreground-muted">Khách hàng</span>
                  <p className="font-medium">{selectedDeal.customer?.fullName ?? "—"}</p>
                </div>
                <div>
                  <span className="text-xs text-foreground-muted">Trạng thái</span>
                  <p className="font-medium">{selectedDeal.status}</p>
                </div>
                {selectedDeal.expectedValue && (
                  <div>
                    <span className="text-xs text-foreground-muted">Giá trị dự kiến</span>
                    <p className="font-medium tabular-nums">
                      {Number(selectedDeal.expectedValue).toLocaleString("vi-VN")} ₫
                    </p>
                  </div>
                )}
                {selectedDeal.finalValue && (
                  <div>
                    <span className="text-xs text-foreground-muted">Giá trị cuối</span>
                    <p className="font-medium tabular-nums">
                      {Number(selectedDeal.finalValue).toLocaleString("vi-VN")} ₫
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {existingList.length > 0 && (
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-700">
              Giao dịch này đã có {existingList.length} ước tính hoa hồng. Tạo mới sẽ thêm một bản ghi khác.
            </div>
          )}
        </FormSection>

        <div className="flex items-center justify-end gap-2">
          <Button type="button" variant="secondary" onClick={() => router.push(portalPath("/commission/deals"))}>Hủy</Button>
          <Button type="submit" disabled={loading || !selectedDealId}>
            {loading ? "Đang tạo..." : "Tạo ước tính"}
          </Button>
        </div>
      </form>
    </div>
  );
}
