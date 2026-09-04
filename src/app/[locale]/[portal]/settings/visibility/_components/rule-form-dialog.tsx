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
import { VisibilityRuleDtoVisibilityLevel } from "@/lib/api/models/visibilityRuleDtoVisibilityLevel";
import { VisibilityRuleDtoMaskType } from "@/lib/api/models/visibilityRuleDtoMaskType";
import {
  visibilityLevelLabel,
  maskTypeLabel,
  roleOptions,
  type RuleFormValues,
} from "./types";

const visibilityLevelOptions = Object.entries(VisibilityRuleDtoVisibilityLevel).map(([k]) => ({
  value: k,
  label: visibilityLevelLabel[k] ?? k,
}));

const maskTypeOptions = Object.entries(VisibilityRuleDtoMaskType).map(([k]) => ({
  value: k,
  label: maskTypeLabel[k] ?? k,
}));

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  isSubmitting: boolean;
  onSubmit: (v: RuleFormValues) => Promise<void>;
}

export function RuleFormDialog({ open, onOpenChange, isSubmitting, onSubmit }: Props) {
  const [fieldKey, setFieldKey] = useState("");
  const [roleCode, setRoleCode] = useState("GUEST");
  const [visibilityLevel, setVisibilityLevel] = useState("FULL");
  const [maskType, setMaskType] = useState<string>("");

  const close = () => {
    setFieldKey("");
    setRoleCode("GUEST");
    setVisibilityLevel("FULL");
    setMaskType("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => (!o ? close() : onOpenChange(o))}>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Thêm rule hiển thị</DialogTitle>
            <DialogDescription>
              Quy định role nào thấy field nào, với mức độ nào.
            </DialogDescription>
          </DialogHeader>
          <form
            className="flex flex-col gap-4"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!fieldKey.trim()) {
                toast.error("Vui lòng nhập field key");
                return;
              }
              await onSubmit({
                fieldKey: fieldKey.trim(),
                roleCode,
                visibilityLevel,
                maskType: maskType || undefined,
              });
            }}
          >
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold tracking-wide text-foreground-muted">
                Field key <span className="text-accent-red-text">*</span>
              </label>
              <Input
                value={fieldKey}
                onChange={(e) => setFieldKey(e.target.value)}
                placeholder="VD: price, phone, addressPublic"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold tracking-wide text-foreground-muted">Role</label>
                <Select value={roleCode} onValueChange={(v) => setRoleCode((v as string) ?? "GUEST")}>
                  <SelectTrigger>
                    <SelectValue>
                      {(value: string) =>
                        roleOptions.find((o) => o.value === value)?.label ?? value
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map((o) => (
                      <SelectItem key={o.value} value={o.value} label={o.label}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold tracking-wide text-foreground-muted">
                  Mức hiển thị
                </label>
                <Select
                  value={visibilityLevel}
                  onValueChange={(v) => setVisibilityLevel((v as string) ?? "FULL")}
                >
                  <SelectTrigger>
                    <SelectValue>
                      {(value: string) =>
                        visibilityLevelOptions.find((o) => o.value === value)?.label ?? value
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {visibilityLevelOptions.map((o) => (
                      <SelectItem key={o.value} value={o.value} label={o.label}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {visibilityLevel === "MASKED" && (
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold tracking-wide text-foreground-muted">
                  Kiểu mask
                </label>
                <Select
                  value={maskType}
                  onValueChange={(v) => setMaskType((v as string) ?? "")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn kiểu mask">
                      {(value: string) =>
                        maskTypeOptions.find((o) => o.value === value)?.label ?? "Chọn kiểu mask"
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {maskTypeOptions.map((o) => (
                      <SelectItem key={o.value} value={o.value} label={o.label}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={close} disabled={isSubmitting}>
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Đang thêm...
                  </>
                ) : (
                  "Thêm rule"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
