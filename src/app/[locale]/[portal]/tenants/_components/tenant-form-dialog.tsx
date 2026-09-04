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
import { usePostApiTenant } from "@/lib/api/endpoints/tenants";
import type { CreateTenantDtoType } from "@/lib/api/models/createTenantDtoType";
import { typeOptions, type Tenant } from "./types";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onCreated?: () => void;
}

export function TenantFormDialog({ open, onOpenChange, onCreated }: Props) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [type, setType] = useState("AGENCY");
  const [logoUrl, setLogoUrl] = useState("");
  const [primaryColor, setPrimaryColor] = useState("");
  const [domains, setDomains] = useState("");

  const { mutateAsync: createTenant, isPending } = usePostApiTenant({
    mutation: {
      onSuccess: () => {
        toast.success("Tạo tenant thành công");
        reset();
        onOpenChange(false);
        onCreated?.();
      },
      onError: (e: any) =>
        toast.error(e?.response?.data?.error?.message?.[0] || "Lỗi tạo tenant"),
    },
  });

  const reset = () => {
    setName("");
    setCode("");
    setType("AGENCY");
    setLogoUrl("");
    setPrimaryColor("");
    setDomains("");
  };

  const close = () => {
    reset();
    onOpenChange(false);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) {
      toast.error("Vui lòng nhập tên và mã tenant");
      return;
    }
    await createTenant({
      data: {
        name: name.trim(),
        code: code.trim().toUpperCase(),
        type: type as CreateTenantDtoType,
        logoUrl: logoUrl.trim() || undefined,
        primaryColor: primaryColor.trim() || undefined,
        domains: domains
          .split(",")
          .map((d) => d.trim())
          .filter(Boolean),
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={(o) => (!o ? close() : onOpenChange(o))}>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tạo tenant mới</DialogTitle>
            <DialogDescription>
              Tạo agency / chủ đầu tư / đơn vị phân phối mới trên nền tảng
            </DialogDescription>
          </DialogHeader>
          <form className="flex flex-col gap-4" onSubmit={submit}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold tracking-wide text-foreground-muted">
                  Tên tenant <span className="text-accent-red-text">*</span>
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="VD: ABC Real Estate"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold tracking-wide text-foreground-muted">
                  Mã tenant <span className="text-accent-red-text">*</span>
                </label>
                <Input
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="VD: ABC"
                  className="font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold tracking-wide text-foreground-muted">
                  Loại tenant
                </label>
                <Select value={type} onValueChange={(v) => setType((v as string) ?? "AGENCY")}>
                  <SelectTrigger>
                    <SelectValue>
                      {(value: string) =>
                        typeOptions.find((o) => o.value === value)?.label ?? value
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {typeOptions.map((o) => (
                      <SelectItem key={o.value} value={o.value} label={o.label}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold tracking-wide text-foreground-muted">
                  Màu chủ đạo
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    placeholder="#1a73e8"
                    className="font-mono"
                  />
                  {primaryColor && (
                    <div
                      className="size-8 shrink-0 rounded-md border border-border"
                      style={{ backgroundColor: primaryColor }}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold tracking-wide text-foreground-muted">
                Logo URL
              </label>
              <Input
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://cdn.realhub.vn/logo.png"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold tracking-wide text-foreground-muted">
                Domains (phân tách bằng dấu phẩy)
              </label>
              <Input
                value={domains}
                onChange={(e) => setDomains(e.target.value)}
                placeholder="abc.realhub.vn, abc2.realhub.vn"
              />
              <p className="text-xs text-foreground-muted">
                Domain đầu tiên sẽ là primary. Subdomain tự lấy từ phần trước dấu chấm.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={close} disabled={isPending}>
                Hủy
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  "Tạo tenant"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
