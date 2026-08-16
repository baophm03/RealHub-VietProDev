"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { formatPrice } from "@/utils";
import { toast } from "sonner";
import {
  CircleCheck,
  CircleX,
  Clock,
  Filter,
  MoreVertical,
  Pencil,
  ShieldCheck,
} from "lucide-react";
import { Can } from "@casl/react";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useGetApiProperties,
  usePatchApiProperty,
  getGetApiPropertiesQueryKey,
} from "@/lib/api/endpoints/properties";
import { GetPropertiesResponse, Property } from "@/lib/api/types/properties";
import type { UpdatePropertyDtoVerificationStatus } from "@/lib/api/models";

type VerificationStatus = UpdatePropertyDtoVerificationStatus;

const VERIFICATION_STATUSES: VerificationStatus[] = [
  "VERIFIED",
  "REJECTED",
];

const statusVariant: Record<
  VerificationStatus,
  "default" | "yellow" | "green" | "red" | "blue"
> = {
  DRAFT: "default",
  PENDING: "yellow",
  VERIFIED: "green",
  REJECTED: "red",
};

const statusLabel: Record<VerificationStatus, string> = {
  DRAFT: "Nháp",
  PENDING: "Chờ duyệt",
  VERIFIED: "Đã duyệt",
  REJECTED: "Từ chối",
};

const statusIcon: Record<VerificationStatus, typeof ShieldCheck> = {
  DRAFT: Pencil,
  PENDING: Clock,
  VERIFIED: CircleCheck,
  REJECTED: CircleX,
};

const statusDescription: Record<VerificationStatus, string> = {
  DRAFT: "Yêu cầu owner/sales chỉnh sửa lại trước khi gửi duyệt lần nữa.",
  PENDING: "Gửi yêu cầu duyệt, Operator/Agency Admin sẽ xem xét.",
  VERIFIED: "Xác minh thành công. Sản phẩm đủ điều kiện hiển thị public (kèm publicationStatus phù hợp).",
  REJECTED: "Từ chối duyệt. Cần owner/sales cập nhật lại thông tin.",
};

const txLabel: Record<string, string> = {
  SALE: "Bán",
  RENT: "Cho thuê",
  TRANSFER: "Chuyển nhượng",
  INVESTMENT: "Đầu tư",
};

export function VerificationList() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<VerificationStatus | "ALL">(
    "PENDING",
  );

  // Query for counts (no verificationStatus filter)
  const { data: allData } = useGetApiProperties();
  const allProperties =
    ((allData as unknown as GetPropertiesResponse)?.data) || [];

  // Query for table (with server-side filter)
  const params = {
    verificationStatus:
      statusFilter !== "ALL" ? (statusFilter as VerificationStatus) : undefined,
    search: search || undefined,
  };
  const { data: filteredData, isLoading } = useGetApiProperties(params);
  const { mutateAsync: patchProperty, isPending } = usePatchApiProperty();

  const filtered =
    (((filteredData as unknown as GetPropertiesResponse)?.data) || []).filter(
      (p) => (p.verificationStatus ?? "DRAFT") !== "DRAFT",
    );

  // pending dialog state
  const [pendingAction, setPendingAction] = useState<{
    property: Property;
    status: VerificationStatus;
  } | null>(null);

  const handleConfirm = async () => {
    if (!pendingAction) return;
    const { property, status } = pendingAction;
    try {
      await patchProperty({
        id: property.id,
        data: { verificationStatus: status },
      });
      await queryClient.invalidateQueries({
        queryKey: getGetApiPropertiesQueryKey(),
      });
      toast.success(
        `Đã chuyển "${property.title}" sang "${statusLabel[status]}"`,
      );
      setPendingAction(null);
    } catch (err) {
      console.error(err);
      toast.error("Có lỗi xảy ra khi cập nhật trạng thái kiểm duyệt");
    }
  };

  const columns: ColumnDef<Property>[] = [
    {
      accessorKey: "propertyCode",
      header: "Mã BĐS",
      cell: ({ row }) => (
        <span className="font-mono text-xs tabular-nums">
          {row.original.propertyCode || row.original.id.slice(0, 8)}
        </span>
      ),
    },
    {
      accessorKey: "title",
      header: "Tên",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.title}</span>
      ),
    },
    {
      accessorKey: "transactionType",
      header: "Giao dịch",
      cell: ({ row }) => (
        <span className="text-sm text-foreground-muted">
          {txLabel[row.original.transactionType] ?? row.original.transactionType}
        </span>
      ),
    },
    {
      accessorKey: "price",
      header: "Giá",
      cell: ({ row }) => (
        <span className="tabular-nums font-medium">
          {formatPrice(Number(row.original.price || 0))}
        </span>
      ),
    },
    {
      accessorKey: "address",
      header: "Vị trí",
      cell: ({ row }) => (
        <span className="text-sm text-foreground-muted">
          {row.original.address ??
            [row.original.district?.name, row.original.province?.name]
              .filter(Boolean)
              .join(", ") ??
            "-"}
        </span>
      ),
    },
    {
      id: "verificationStatus",
      header: "Kiểm duyệt",
      cell: ({ row }) => {
        const vStatus = (row.original.verificationStatus ?? "DRAFT") as VerificationStatus;
        return (
          <Badge variant={statusVariant[vStatus]}>
            {statusLabel[vStatus] ?? vStatus}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Hành động",
      cell: ({ row }) => {
        const current = (row.original.verificationStatus ?? "DRAFT") as VerificationStatus;
        return (
          <Can I="APPROVE" a="PROPERTY">
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex justify-end"
            >
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Đổi trạng thái kiểm duyệt"
                    />
                  }
                >
                  <MoreVertical size={16} />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" sideOffset={4}>
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>Chuyển trạng thái</DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    {VERIFICATION_STATUSES.map((status) => {
                      const Icon = statusIcon[status];
                      const isCurrent = status === current;
                      return (
                        <DropdownMenuItem
                          key={status}
                          disabled={isCurrent || isPending}
                          onClick={() =>
                            setPendingAction({ property: row.original, status })
                          }
                        >
                          <Icon
                            size={14}
                            className={
                              status === "VERIFIED"
                                ? "text-accent-green-text"
                                : status === "REJECTED"
                                  ? "text-accent-red-text"
                                  : status === "PENDING"
                                    ? "text-accent-yellow-text"
                                    : "text-foreground-muted"
                            }
                          />
                          <span className="flex flex-col">
                            <span className="text-sm font-medium">
                              {statusLabel[status]}
                              {isCurrent && (
                                <span className="ml-1 text-xs text-foreground-muted">
                                  (hiện tại)
                                </span>
                              )}
                            </span>
                          </span>
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </Can>
        );
      },
    },
  ];

  const filterTabs: { value: VerificationStatus | "ALL"; label: string }[] = [
    { value: "ALL", label: "Tất cả" },
    { value: "PENDING", label: "Chờ duyệt" },
    { value: "VERIFIED", label: "Đã duyệt" },
    { value: "REJECTED", label: "Từ chối" },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Filter tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {filterTabs.map((tab) => {
          const count =
            tab.value === "ALL"
              ? allProperties.filter(
                (p) => (p.verificationStatus ?? "DRAFT") !== "DRAFT",
              ).length
              : allProperties.filter(
                (p) => (p.verificationStatus ?? "DRAFT") === tab.value,
              ).length;
          const active = statusFilter === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm transition-colors ${active
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-surface text-foreground-muted hover:bg-surface-muted"
                }`}
            >
              {tab.label}
              <span
                className={`rounded-full px-1.5 text-xs tabular-nums ${active
                  ? "bg-primary/20 text-primary"
                  : "bg-surface-muted text-foreground-muted"
                  }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="flex items-center gap-2">
        <Input
          type="search"
          placeholder="Tìm theo tên hoặc mã BĐS..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-auto min-w-0"
        />
        <Button variant="outline" size="icon" aria-label="Bộ lọc" className="shrink-0">
          <Filter size={16} />
        </Button>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex h-40 items-center justify-center rounded-lg border border-border bg-surface-muted/30">
          <span className="text-sm text-foreground-muted">Đang tải...</span>
        </div>
      ) : filtered.length > 0 ? (
        <DataTable
          columns={columns}
          data={filtered}
          onRowClick={(row) => router.push(`/dashboard/properties/${row.id}`)}
          emptyMessage="Không tìm thấy bất động sản nào"
        />
      ) : (
        <EmptyState
          icon={<ShieldCheck size={24} />}
          title="Không có BĐS cần duyệt"
          description={
            statusFilter === "PENDING"
              ? "Hiện không có bất động sản nào đang chờ kiểm duyệt."
              : "Không có bất động sản nào phù hợp với bộ lọc."
          }
        />
      )}

      {/* Confirm dialog */}
      <Dialog
        open={!!pendingAction}
        onOpenChange={(open) => !open && setPendingAction(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Xác nhận chuyển trạng thái kiểm duyệt
            </DialogTitle>
            <DialogDescription>
              {pendingAction && (
                <span className="flex flex-col gap-1">
                  <span>
                    BĐS:{" "}
                    <strong className="text-foreground">
                      {pendingAction.property.title}
                    </strong>
                  </span>
                  <span>
                    Trạng thái mới:{" "}
                    <Badge variant={statusVariant[pendingAction.status]}>
                      {statusLabel[pendingAction.status]}
                    </Badge>
                  </span>
                  <span className="mt-2 text-xs">
                    {statusDescription[pendingAction.status]}
                  </span>
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPendingAction(null)}
              disabled={isPending}
            >
              Hủy
            </Button>
            <Button
              onClick={handleConfirm}
              loading={isPending}
              variant={pendingAction?.status === "REJECTED" ? "destructive" : "default"}
            >
              Xác nhận
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
