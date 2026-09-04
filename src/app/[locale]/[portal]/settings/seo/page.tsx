"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Search, Pencil, Globe } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { DataTable } from "@/components/shared/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import { ability } from "@/config/casl/ability";
import {
  useGetApiSeoTemplates,
  usePatchApiSeoTemplate,
  getGetApiSeoTemplatesQueryKey,
} from "@/lib/api/endpoints/seo-templates";
import type { UpdateSeoTemplateDto } from "@/lib/api/models/updateSeoTemplateDto";
import { CreateSeoTemplateDtoPageType } from "@/lib/api/models/createSeoTemplateDtoPageType";
import {
  pageTypeLabel,
  type SeoTemplate,
  type TemplateFormValues,
} from "./_components/types";
import { TemplateFormDialog } from "./_components/template-form-dialog";

const pageTypeOptions = Object.entries(CreateSeoTemplateDtoPageType).map(([k]) => ({
  value: k,
  label: pageTypeLabel[k] ?? k,
}));

export default function SeoTemplatesPage() {
  const queryClient = useQueryClient();
  const canUpdate = ability.can("UPDATE", "SETTING");

  const [pageTypeFilter, setPageTypeFilter] = useState<string>("");
  const [search, setSearch] = useState("");
  const [editTarget, setEditTarget] = useState<SeoTemplate | null>(null);

  const { data: raw, isLoading } = useGetApiSeoTemplates({
    pageType: (pageTypeFilter || undefined) as any,
  });
  const allTemplates: SeoTemplate[] =
    (raw as unknown as { data?: SeoTemplate[] })?.data ?? [];
  const templates = search.trim()
    ? allTemplates.filter(
      (t) =>
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.titleTemplate.toLowerCase().includes(search.toLowerCase()),
    )
    : allTemplates;

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: getGetApiSeoTemplatesQueryKey() });

  const { mutateAsync: updateTemplate, isPending: isUpdating } = usePatchApiSeoTemplate({
    mutation: {
      onSuccess: () => {
        toast.success("Cập nhật thành công");
        invalidate();
        setEditTarget(null);
      },
      onError: (e: any) => toast.error(e?.response?.data?.error?.message?.[0] || "Lỗi cập nhật"),
    },
  });

  const columns: ColumnDef<SeoTemplate>[] = [
    {
      accessorKey: "name",
      header: "Tên",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.original.name}</span>
          <span className="text-xs text-foreground-muted">
            {pageTypeLabel[row.original.pageType] ?? row.original.pageType}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "titleTemplate",
      header: "Title template",
      cell: ({ row }) => (
        <span className="line-clamp-1 max-w-[280px] font-mono text-xs text-foreground-muted">
          {row.original.titleTemplate}
        </span>
      ),
    },
    {
      accessorKey: "robotsRule",
      header: "Robots",
      cell: ({ row }) => (
        <span className="font-mono text-xs text-foreground-muted">
          {row.original.robotsRule || "—"}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => (
        <Badge variant={row.original.status === "ACTIVE" ? "green" : "default"}>
          {row.original.status === "ACTIVE" ? "Active" : row.original.status}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          {canUpdate && (
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Sửa"
              onClick={(e) => {
                e.stopPropagation();
                setEditTarget(row.original);
              }}
            >
              <Pencil size={14} />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Cài đặt"
        title="SEO templates"
        description="Cấu hình template title, description, OG, robots cho từng loại trang. Hỗ trợ biến {{propertyTitle}}, {{location}}, {{tenantName}}..."
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Input
            type="search"
            placeholder="Tìm theo tên hoặc title template..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-[280px]"
          />
        </div>
        <Select
          value={pageTypeFilter}
          onValueChange={(v) => setPageTypeFilter((v as string) ?? "")}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Tất cả loại trang">
              {(value: string) =>
                pageTypeOptions.find((o) => o.value === value)?.label ?? "Tất cả loại trang"
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {pageTypeOptions.map((o) => (
              <SelectItem key={o.value} value={o.value} label={o.label}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="h-96 animate-pulse rounded-lg bg-surface-muted" />
      ) : templates.length === 0 ? (
        <EmptyState
          icon={<Globe size={24} />}
          title="Chưa có SEO template"
          description="Chạy seed `npm run seed:seo` để tạo 7 template mặc định cho các trang công khai."
        />
      ) : (
        <DataTable
          columns={columns}
          data={templates}
          onRowClick={(row) => canUpdate && setEditTarget(row)}
          emptyMessage="Không tìm thấy template"
        />
      )}

      <TemplateFormDialog
        open={!!editTarget}
        onOpenChange={(o) => !o && setEditTarget(null)}
        title="Cập nhật SEO template"
        submitLabel="Lưu"
        isSubmitting={isUpdating}
        initial={
          editTarget
            ? {
              pageType: editTarget.pageType,
              name: editTarget.name,
              titleTemplate: editTarget.titleTemplate,
              descriptionTemplate: editTarget.descriptionTemplate,
              ogTitleTemplate: editTarget.ogTitleTemplate ?? "",
              ogDescriptionTemplate: editTarget.ogDescriptionTemplate ?? "",
              robotsRule: editTarget.robotsRule ?? "",
            }
            : null
        }
        onSubmit={async (v: TemplateFormValues) => {
          if (!editTarget) return;
          await updateTemplate({
            id: editTarget.id,
            data: {
              name: v.name,
              titleTemplate: v.titleTemplate,
              descriptionTemplate: v.descriptionTemplate,
              ogTitleTemplate: v.ogTitleTemplate || undefined,
              ogDescriptionTemplate: v.ogDescriptionTemplate || undefined,
              robotsRule: v.robotsRule || undefined,
            } as UpdateSeoTemplateDto,
          });
        }}
      />
    </div>
  );
}
