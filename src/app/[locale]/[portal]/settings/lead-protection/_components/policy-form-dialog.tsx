"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { CreateLeadProtectionPolicyDtoSource } from "@/lib/api/models/createLeadProtectionPolicyDtoSource";
import { CreateLeadProtectionPolicyDtoSellingMode } from "@/lib/api/models/createLeadProtectionPolicyDtoSellingMode";
import { CreateLeadProtectionPolicyDtoCustomerType } from "@/lib/api/models/createLeadProtectionPolicyDtoCustomerType";
import {
  sourceLabel,
  sellingModeLabel,
  customerTypeLabel,
  defaultPolicyForm,
  type PolicyFormValues,
} from "./types";

const sourceOptions = Object.entries(CreateLeadProtectionPolicyDtoSource).map(([k]) => ({
  value: k,
  label: sourceLabel[k] ?? k,
}));
const sellingModeOptions = Object.entries(CreateLeadProtectionPolicyDtoSellingMode).map(([k]) => ({
  value: k,
  label: sellingModeLabel[k] ?? k,
}));
const customerTypeOptions = Object.entries(CreateLeadProtectionPolicyDtoCustomerType).map(([k]) => ({
  value: k,
  label: customerTypeLabel[k] ?? k,
}));

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  title: string;
  submitLabel: string;
  isSubmitting: boolean;
  initial: PolicyFormValues | null;
  onSubmit: (v: PolicyFormValues) => Promise<void>;
}

export function PolicyFormDialog({
  open,
  onOpenChange,
  title,
  submitLabel,
  isSubmitting,
  initial,
  onSubmit,
}: Props) {
  const [form, setForm] = useState<PolicyFormValues>(initial ?? defaultPolicyForm);

  // Sync khi mở edit
  if (open && initial && form.name !== initial.name && form.name === "") {
    setForm(initial);
  }

  const close = () => {
    setForm(defaultPolicyForm);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => (!o ? close() : onOpenChange(o))}>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              Quy định thời gian bảo vệ lead, reclaim, reassign theo điều kiện.
            </DialogDescription>
          </DialogHeader>
          <form
            className="flex flex-col gap-4"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!form.name.trim()) {
                toast.error("Vui lòng nhập tên");
                return;
              }
              await onSubmit(form);
            }}
          >
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold tracking-wide text-foreground-muted">
                Tên chính sách <span className="text-accent-red-text">*</span>
              </label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="VD: Bảo vệ lead website 30 ngày"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold tracking-wide text-foreground-muted">Nguồn</label>
                <Select
                  value={form.source}
                  onValueChange={(v) => setForm({ ...form, source: (v as string) ?? "" })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Mọi nguồn">
                      {(value: string) =>
                        sourceOptions.find((o) => o.value === value)?.label ?? "Mọi nguồn"
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {sourceOptions.map((o) => (
                      <SelectItem key={o.value} value={o.value} label={o.label}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold tracking-wide text-foreground-muted">Loại KH</label>
                <Select
                  value={form.customerType}
                  onValueChange={(v) => setForm({ ...form, customerType: (v as string) ?? "" })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Mọi loại">
                      {(value: string) =>
                        customerTypeOptions.find((o) => o.value === value)?.label ?? "Mọi loại"
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {customerTypeOptions.map((o) => (
                      <SelectItem key={o.value} value={o.value} label={o.label}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold tracking-wide text-foreground-muted">Selling mode</label>
              <Select
                value={form.sellingMode}
                onValueChange={(v) => setForm({ ...form, sellingMode: (v as string) ?? "" })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Mọi selling mode">
                    {(value: string) =>
                      sellingModeOptions.find((o) => o.value === value)?.label ?? "Mọi selling mode"
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {sellingModeOptions.map((o) => (
                    <SelectItem key={o.value} value={o.value} label={o.label}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold tracking-wide text-foreground-muted">
                  Ngày bảo vệ
                </label>
                <Input
                  type="number"
                  value={form.protectionDays}
                  onChange={(e) =>
                    setForm({ ...form, protectionDays: Number(e.target.value) })
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold tracking-wide text-foreground-muted">
                  Ngày reclaim
                </label>
                <Input
                  type="number"
                  value={form.inactiveReclaimDays}
                  onChange={(e) =>
                    setForm({ ...form, inactiveReclaimDays: Number(e.target.value) })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="allowReassign"
                  checked={form.allowReassign}
                  onChange={(e) =>
                    setForm({ ...form, allowReassign: e.target.checked })
                  }
                  className="size-4 rounded border-input"
                />
                <label htmlFor="allowReassign" className="text-sm">
                  Cho phép reassign
                </label>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold tracking-wide text-foreground-muted">
                  Ưu tiên
                </label>
                <Input
                  type="number"
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={close} disabled={isSubmitting}>
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  submitLabel
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
