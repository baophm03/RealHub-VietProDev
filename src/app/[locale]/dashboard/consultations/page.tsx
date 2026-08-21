"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Check,
  CheckCheck,
  CircleUser,
  ExternalLink,
  Eye,
  Filter,
  Headset,
  House,
  MessageCircle,
  Phone,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogPortal,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Can } from "@casl/react";
import {
  useGetApiPropertyContactsAdmin,
  usePatchApiPropertyContactsId,
} from "@/lib/api/endpoints/property-contacts";
import type { ColumnDef } from "@tanstack/react-table";
import type { GetApiPropertyContactsStatus } from "@/lib/api/models/getApiPropertyContactsStatus";

interface PropertyContact {
  id: string;
  propertyId: string;
  userName: string;
  userPhone: string;
  userContent?: string;
  status: "UNREAD" | "READ" | "REPLIED";
  createdAt: string;
  updatedAt: string;
  property?: {
    id: string;
    title: string;
    propertyCode: string;
  };
}

interface PropertyContactsResponse {
  success: boolean;
  data: PropertyContact[];
  meta: {
    total: number;
    limit: number;
    offset: number;
    page: number;
    totalPages: number;
  };
  timestamp: string;
}

const statusConfig: Record<
  PropertyContact["status"],
  { label: string; variant: "red" | "blue" | "green" }
> = {
  UNREAD: { label: "Chưa đọc", variant: "red" },
  READ: { label: "Đã đọc", variant: "blue" },
  REPLIED: { label: "Đã phản hồi", variant: "green" },
};

export default function ConsultationsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<PropertyContact["status"] | "ALL">("ALL");
  const [detailContact, setDetailContact] = useState<PropertyContact | null>(null);

  // Query for counts (no status filter)
  const { data: allContactsData } = useGetApiPropertyContactsAdmin({
    limit: "50",
    offset: "0",
  });
  const allContacts =
    ((allContactsData as unknown as PropertyContactsResponse)?.data) || [];

  // Query for table (with filters)
  const { data: contactsData, isLoading, refetch } = useGetApiPropertyContactsAdmin({
    status: statusFilter === "ALL" ? undefined : (statusFilter as GetApiPropertyContactsStatus),
    search: search.trim() || undefined,
    limit: "50",
    offset: "0",
  });
  const contacts =
    ((contactsData as unknown as PropertyContactsResponse)?.data) || [];

  const { mutateAsync: updateContact, isPending: isUpdating } = usePatchApiPropertyContactsId();

  const handleStatusChange = async (
    id: string,
    status: PropertyContact["status"],
  ) => {
    try {
      await updateContact({ id, data: { status } });
      toast.success(`Đã cập nhật: ${statusConfig[status].label}`);
      setDetailContact((prev) => (prev && prev.id === id ? { ...prev, status } : prev));
      refetch();
    } catch (err) {
      toast.error((err as any)?.response?.data?.error?.message?.[0] || "Cập nhật trạng thái thất bại");
      console.error(err);
    }
  };

  const columns = useMemo<ColumnDef<PropertyContact>[]>(
    () => [
      {
        accessorKey: "userName",
        header: "Khách hàng",
        cell: ({ row }) => (
          <div className="flex flex-col gap-0.5">
            <span className="font-medium">{row.original.userName}</span>
            <span className="text-xs tabular-nums text-foreground-muted">{row.original.userPhone}</span>
          </div>
        ),
      },
      {
        id: "property",
        header: "Bất động sản",
        cell: ({ row }) => {
          const property = row.original.property;
          if (!property) return <span className="text-foreground-muted">—</span>;
          return (
            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/dashboard/properties/${property.id}`);
              }}
              className="group flex flex-col gap-0.5 text-left"
            >
              <span className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1 max-w-[220px]">
                {property.title}
              </span>
              <span className="text-xs tabular-nums text-foreground-muted">
                #{property.propertyCode}
              </span>
            </button>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Trạng thái",
        cell: ({ row }) => {
          const cfg = statusConfig[row.original.status] ?? statusConfig.UNREAD;
          return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
        },
      },
      {
        accessorKey: "createdAt",
        header: "Ngày gửi",
        cell: ({ row }) => (
          <span className="tabular-nums text-foreground-muted text-xs">
            {row.original.createdAt
              ? new Date(row.original.createdAt).toLocaleDateString("vi-VN")
              : "—"}
          </span>
        ),
      },
      {
        id: "actions",
        header: "Thao tác",
        cell: ({ row }) => (
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDetailContact(row.original)}
              leftIcon={<Eye size={14} />}
            >
              Chi tiết
            </Button>
          </div>
        ),
      },
    ],
    [router],
  );

  const totalCount = (allContactsData as unknown as PropertyContactsResponse)?.meta?.total ?? allContacts.length;
  const unreadCount = useMemo(
    () => allContacts.filter((c) => c.status === "UNREAD").length,
    [allContacts],
  );

  const filterTabs: { value: PropertyContact["status"] | "ALL"; label: string }[] = [
    { value: "ALL", label: "Tất cả" },
    { value: "UNREAD", label: "Chưa đọc" },
    { value: "READ", label: "Đã đọc" },
    { value: "REPLIED", label: "Đã phản hồi" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="CRM"
        title="Tư vấn"
        description="Yêu cầu tư vấn từ khách hàng qua form liên hệ bất động sản"
      />

      {/* Filter tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {filterTabs.map((tab) => {
          const count =
            tab.value === "ALL"
              ? allContacts.length
              : allContacts.filter((c) => c.status === tab.value).length;
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
          placeholder="Tìm theo tên, SĐT, nội dung..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-auto min-w-0"
        />
        <Button variant="outline" size="icon" aria-label="Bộ lọc" className="shrink-0">
          <Filter size={16} />
        </Button>
      </div>

      {isLoading ? (
        <div className="h-96 animate-pulse rounded-lg bg-surface-muted" />
      ) : contacts.length > 0 ? (
        <DataTable
          columns={columns}
          data={contacts}
          onRowClick={(contact) => setDetailContact(contact)}
          emptyMessage="Không có yêu cầu tư vấn"
        />
      ) : (
        <EmptyState
          icon={<Headset size={24} />}
          title="Chưa có yêu cầu tư vấn"
          description="Các yêu cầu tư vấn từ form liên hệ trên trang bất động sản sẽ hiển thị tại đây"
        />
      )}

      {/* Detail Dialog */}
      <Dialog
        open={!!detailContact}
        onOpenChange={(open) => !open && setDetailContact(null)}
      >
        <DialogPortal>
          <DialogOverlay />
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Chi tiết yêu cầu tư vấn</DialogTitle>
              <DialogDescription>
                Thông tin khách hàng và bất động sản liên quan
              </DialogDescription>
            </DialogHeader>

            {detailContact && (
              <div className="flex flex-col gap-5">
                {/* Status + date */}
                <div className="flex items-center justify-between">
                  <Badge variant={statusConfig[detailContact.status]?.variant ?? "default"}>
                    {statusConfig[detailContact.status]?.label ?? detailContact.status}
                  </Badge>
                  <span className="text-xs tabular-nums text-foreground-muted">
                    {detailContact.createdAt
                      ? new Date(detailContact.createdAt).toLocaleString("vi-VN")
                      : ""}
                  </span>
                </div>

                {/* Two-column layout: property (left) | customer (right) */}
                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Property info (left) */}
                  <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface-muted/40 p-4">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-foreground-muted">
                      <House size={14} />
                      Bất động sản
                    </div>
                    {detailContact.property ? (
                      <div className="flex flex-col gap-2">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-sm font-medium leading-snug">
                            {detailContact.property.title}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label="Xem bất động sản"
                            onClick={() => {
                              router.push(`/dashboard/properties/${detailContact.property!.id}`);
                              setDetailContact(null);
                            }}
                          >
                            <ExternalLink size={14} />
                          </Button>
                        </div>
                        <span className="text-xs tabular-nums text-foreground-muted">
                          #{detailContact.property.propertyCode}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-foreground-muted">—</span>
                    )}
                  </div>

                  {/* Customer info (right) */}
                  <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface-muted/40 p-4">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-foreground-muted">
                      <CircleUser size={14} />
                      Khách liên hệ
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="text-sm font-medium">{detailContact.userName}</span>
                      <div className="flex items-center gap-2 text-sm text-foreground-muted">
                        <Phone size={14} />
                        <span className="tabular-nums">{detailContact.userPhone}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content (full width) */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-foreground-muted">
                    <MessageCircle size={14} />
                    Nội dung yêu cầu
                  </div>
                  <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap rounded-lg border border-border bg-surface-muted/40 p-4">
                    {detailContact.userContent || "—"}
                  </p>
                </div>

                {/* Meta */}
                <div className="flex items-center gap-2 text-xs text-foreground-muted">
                  <Calendar size={14} />
                  <span>
                    Cập nhật lúc:{" "}
                    <span className="tabular-nums">
                      {detailContact.updatedAt
                        ? new Date(detailContact.updatedAt).toLocaleString("vi-VN")
                        : "—"}
                    </span>
                  </span>
                </div>

                {/* Status actions */}
                <Can I="UPDATE" a="PROPERTY">
                  <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4">
                    <span className="text-xs font-medium text-foreground-muted mr-auto">
                      Cập nhật trạng thái:
                    </span>
                    <Button
                      variant={detailContact.status === "UNREAD" ? "default" : "outline"}
                      size="sm"
                      disabled={isUpdating || detailContact.status === "UNREAD"}
                      onClick={() => handleStatusChange(detailContact.id, "UNREAD")}
                    >
                      Chưa đọc
                    </Button>
                    <Button
                      variant={detailContact.status === "READ" ? "default" : "outline"}
                      size="sm"
                      disabled={isUpdating || detailContact.status === "READ"}
                      onClick={() => handleStatusChange(detailContact.id, "READ")}
                      leftIcon={<Check size={14} />}
                    >
                      Đã đọc
                    </Button>
                    <Button
                      variant={detailContact.status === "REPLIED" ? "default" : "outline"}
                      size="sm"
                      disabled={isUpdating || detailContact.status === "REPLIED"}
                      onClick={() => handleStatusChange(detailContact.id, "REPLIED")}
                      leftIcon={<CheckCheck size={14} />}
                    >
                      Đã phản hồi
                    </Button>
                  </div>
                </Can>
              </div>
            )}
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </div>
  );
}
