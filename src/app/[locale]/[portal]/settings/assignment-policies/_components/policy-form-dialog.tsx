"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useGetApiPropertyTypes } from "@/lib/api/endpoints/properties";
import { useGetApiProjects } from "@/lib/api/endpoints/projects";
import {
  transactionTypeOptions,
  sellingModeOptions,
  expireBehaviorOptions,
  emptyPolicy,
  type CreatePolicyDto,
} from "./types";

interface PropertyType {
  id: string;
  name: string;
}
interface PropertyTypesResponse {
  data?: PropertyType[];
}
interface Project {
  id: string;
  name: string;
}
interface ProjectsResponse {
  data?: Project[];
}

interface PolicyFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (dto: CreatePolicyDto) => Promise<void>;
  isSubmitting: boolean;
  initial?: CreatePolicyDto | null;
  mode?: "create" | "edit";
}

export function PolicyFormDialog({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
  initial,
  mode = "create",
}: PolicyFormDialogProps) {
  const [form, setForm] = useState<CreatePolicyDto>(emptyPolicy());

  const { data: propertyTypesRaw } = useGetApiPropertyTypes();
  const propertyTypes: PropertyType[] =
    (propertyTypesRaw as unknown as PropertyTypesResponse)?.data ?? [];

  const { data: projectsRaw } = useGetApiProjects();
  const projects: Project[] =
    (projectsRaw as unknown as ProjectsResponse)?.data ?? [];

  useEffect(() => {
    if (initial) {
      setForm({ ...emptyPolicy(), ...initial });
    } else {
      setForm(emptyPolicy());
    }
  }, [initial, open]);

  const set = <K extends keyof CreatePolicyDto>(key: K, value: CreatePolicyDto[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) return;
    await onSubmit({
      ...form,
      name: form.name.trim(),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus size={18} />
              {mode === "create" ? "Tạo chính sách phụ trách" : "Sửa chính sách phụ trách"}
            </DialogTitle>
            <DialogDescription>
              Cấu hình điều kiện nhận phụ trách sản phẩm. Policy cụ thể hơn sẽ được ưu tiên áp dụng.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="policy-name">Tên chính sách *</Label>
              <Input
                id="policy-name"
                placeholder="VD: Căn hộ Q1 — Exclusive"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label>Loại BĐS</Label>
                <Select
                  value={form.propertyTypeId ?? "__ALL__"}
                  onValueChange={(v) => set("propertyTypeId", v === "__ALL__" ? null : v)}
                  items={[
                    { value: "__ALL__", label: "Tất cả" },
                    ...propertyTypes.map((t) => ({ value: t.id, label: t.name })),
                  ]}
                >
                  <SelectTrigger className="w-full" disabled={!!form.projectId}>
                    <SelectValue placeholder="Tất cả" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__ALL__" label="Tất cả">Tất cả</SelectItem>
                    {propertyTypes.map((t) => (
                      <SelectItem key={t.id} value={t.id} label={t.name}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label>Loại giao dịch</Label>
                <Select
                  value={form.transactionType ?? "__ALL__"}
                  onValueChange={(v) => set("transactionType", v === "__ALL__" ? null : v)}
                  items={[
                    { value: "__ALL__", label: "Tất cả" },
                    ...transactionTypeOptions.map((t) => ({ value: t.value, label: t.label })),
                  ]}
                >
                  <SelectTrigger className="w-full" disabled={!!form.projectId}>
                    <SelectValue placeholder="Tất cả" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__ALL__" label="Tất cả">Tất cả</SelectItem>
                    {transactionTypeOptions.map((t) => (
                      <SelectItem key={t.value} value={t.value} label={t.label}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label>Chế độ khai thác</Label>
                <Select
                  value={form.sellingMode ?? "__ALL__"}
                  onValueChange={(v) => set("sellingMode", v === "__ALL__" ? null : v)}
                  items={[
                    { value: "__ALL__", label: "Tất cả" },
                    ...sellingModeOptions.map((s) => ({ value: s.value, label: s.label })),
                  ]}
                >
                  <SelectTrigger className="w-full" disabled={!!form.projectId}>
                    <SelectValue placeholder="Tất cả" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__ALL__" label="Tất cả">Tất cả</SelectItem>
                    {sellingModeOptions.map((s) => (
                      <SelectItem key={s.value} value={s.value} label={s.label}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label>Dự án</Label>
                <Select
                  value={form.projectId ?? "__ALL__"}
                  onValueChange={(v) => {
                    const next = v === "__ALL__" ? null : v;
                    set("projectId", next);
                    if (next) {
                      set("propertyTypeId", null);
                      set("transactionType", null);
                      set("sellingMode", null);
                    }
                  }}
                  items={[
                    { value: "__ALL__", label: "Tất cả" },
                    ...projects.map((p) => ({ value: p.id, label: p.name })),
                  ]}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Tất cả" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__ALL__" label="Tất cả">Tất cả</SelectItem>
                    {projects.map((p) => (
                      <SelectItem key={p.id} value={p.id} label={p.name}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="policy-max">Số sales tối đa</Label>
                <Input
                  id="policy-max"
                  type="number"
                  min={1}
                  value={form.maxAssignedUsers}
                  onChange={(e) => set("maxAssignedUsers", parseInt(e.target.value, 10) || 1)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="policy-duration">Thời hạn (ngày)</Label>
                <Input
                  id="policy-duration"
                  type="number"
                  min={1}
                  value={form.durationDays}
                  onChange={(e) => set("durationDays", parseInt(e.target.value, 10) || 7)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Hành vi khi hết hạn</Label>
              <Select
                value={form.expireBehavior ?? "RETURN_TO_POOL"}
                onValueChange={(v) => set("expireBehavior", v as string)}
                items={expireBehaviorOptions.map((e) => ({ value: e.value, label: e.label }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn hành vi" />
                </SelectTrigger>
                <SelectContent>
                  {expireBehaviorOptions.map((e) => (
                    <SelectItem key={e.value} value={e.value} label={e.label}>
                      <div className="flex flex-col">
                        <span>{e.label}</span>
                        <span className="text-xs text-foreground-muted">{e.hint}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="policy-priority">Ưu tiên</Label>
              <Input
                id="policy-priority"
                type="number"
                value={form.priority}
                onChange={(e) => set("priority", parseInt(e.target.value, 10) || 0)}
              />
              <p className="text-xs text-foreground-muted">
                Số cao = áp dụng trước
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting || !form.name.trim()}>
              {isSubmitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Plus size={14} />
                  {mode === "create" ? "Tạo" : "Lưu"}
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog >
  );
}
