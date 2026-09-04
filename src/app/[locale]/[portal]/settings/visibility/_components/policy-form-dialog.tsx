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
import { CreateVisibilityPolicyDtoEntityType } from "@/lib/api/models/createVisibilityPolicyDtoEntityType";
import {
  entityTypeLabel,
  type PolicyFormValues,
} from "./types";

const entityTypeOptions = Object.entries(CreateVisibilityPolicyDtoEntityType).map(([k]) => ({
  value: k,
  label: entityTypeLabel[k] ?? k,
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
  const [name, setName] = useState(initial?.name ?? "");
  const [entityType, setEntityType] = useState(initial?.entityType ?? "PROPERTY");
  const [priority, setPriority] = useState(initial?.priority ?? 0);

  // Sync khi mở edit
  if (open && initial && name === "" && initial.name) {
    setName(initial.name);
    setEntityType(initial.entityType);
    setPriority(initial.priority);
  }

  const close = () => {
    setName("");
    setEntityType("PROPERTY");
    setPriority(0);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => (!o ? close() : onOpenChange(o))}>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>Quy định hiển thị dữ liệu theo role.</DialogDescription>
          </DialogHeader>
          <form
            className="flex flex-col gap-4"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!name.trim()) {
                toast.error("Vui lòng nhập tên");
                return;
              }
              await onSubmit({ name: name.trim(), entityType, priority });
            }}
          >
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold tracking-wide text-foreground-muted">
                Tên chính sách <span className="text-accent-red-text">*</span>
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="VD: Ẩn giá BĐS với khách"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold tracking-wide text-foreground-muted">
                Đối tượng <span className="text-accent-red-text">*</span>
              </label>
              <Select
                value={entityType}
                onValueChange={(v) => setEntityType((v as string) ?? "PROPERTY")}
                disabled={!!initial}
              >
                <SelectTrigger>
                  <SelectValue>
                    {(value: string) =>
                      entityTypeOptions.find((o) => o.value === value)?.label ?? value
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {entityTypeOptions.map((o) => (
                    <SelectItem key={o.value} value={o.value} label={o.label}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold tracking-wide text-foreground-muted">
                Độ ưu tiên
              </label>
              <Input
                type="number"
                value={priority}
                onChange={(e) => setPriority(Number(e.target.value))}
              />
              <p className="text-xs text-foreground-muted">Số cao hơn áp dụng trước.</p>
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
