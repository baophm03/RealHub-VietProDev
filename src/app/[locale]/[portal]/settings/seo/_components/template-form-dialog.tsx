"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { CreateSeoTemplateDtoPageType } from "@/lib/api/models/createSeoTemplateDtoPageType";
import { SEO_CONTEXT_REGISTRY } from "@/lib/seo-context";
import type { SeoPageType } from "@/lib/seo";
import {
  pageTypeLabel,
  defaultTemplateForm,
  type TemplateFormValues,
} from "./types";

const pageTypeOptions = Object.entries(CreateSeoTemplateDtoPageType).map(([k]) => ({
  value: k,
  label: pageTypeLabel[k] ?? k,
}));

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  title: string;
  submitLabel: string;
  isSubmitting: boolean;
  initial: TemplateFormValues | null;
  onSubmit: (v: TemplateFormValues) => Promise<void>;
}

export function TemplateFormDialog({
  open,
  onOpenChange,
  title,
  submitLabel,
  isSubmitting,
  initial,
  onSubmit,
}: Props) {
  const [form, setForm] = useState<TemplateFormValues>(initial ?? defaultTemplateForm);

  // Sync khi mở edit
  if (open && initial && form.name !== initial.name && form.name === "") {
    setForm(initial);
  }

  const close = () => {
    setForm(defaultTemplateForm);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => (!o ? close() : onOpenChange(o))}>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              Sử dụng biến <code className="rounded bg-surface-muted px-1 py-0.5 font-mono text-xs">{"{{key}}"}</code> để thay thế giá trị động. Xem danh sách biến khả dụng bên dưới.
            </DialogDescription>
          </DialogHeader>

          {/* Available variables hint */}
          {(() => {
            const keys = SEO_CONTEXT_REGISTRY[form.pageType as SeoPageType] ?? [];
            if (keys.length === 0) return null;
            return (
              <div className="rounded-lg border border-border bg-surface-muted/40 p-3">
                <p className="mb-2 text-xs font-semibold tracking-wide text-foreground-muted">
                  Biến khả dụng cho {pageTypeLabel[form.pageType] ?? form.pageType}:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {keys.map((k) => (
                    <button
                      key={k.key}
                      type="button"
                      title={k.description + (k.example ? ` — VD: ${k.example}` : "")}
                      onClick={() => {
                        // Insert {{key}} into titleTemplate at cursor — simplest: append
                        setForm({ ...form, titleTemplate: `${form.titleTemplate}{{${k.key}}}` });
                      }}
                      className="inline-flex items-center gap-1 rounded-md border border-border bg-surface px-2 py-1 font-mono text-xs transition-colors hover:border-accent hover:bg-surface-muted"
                    >
                      <span className="text-foreground">{`{{${k.key}}}`}</span>
                      <span className="text-foreground-muted">— {k.description}</span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })()}
          <form
            className="flex flex-col gap-4"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!form.name.trim()) {
                toast.error("Vui lòng nhập tên");
                return;
              }
              if (!form.titleTemplate.trim()) {
                toast.error("Vui lòng nhập title template");
                return;
              }
              await onSubmit(form);
            }}
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold tracking-wide text-foreground-muted">
                  Loại trang <span className="text-accent-red-text">*</span>
                </label>
                <Select
                  value={form.pageType}
                  onValueChange={(v) =>
                    setForm({ ...form, pageType: (v as string) ?? "PROPERTY_DETAIL" })
                  }
                  disabled={!!initial}
                >
                  <SelectTrigger>
                    <SelectValue>
                      {(value: string) =>
                        pageTypeOptions.find((o) => o.value === value)?.label ?? value
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
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold tracking-wide text-foreground-muted">
                  Tên template <span className="text-accent-red-text">*</span>
                </label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="VD: Mặc định BĐS"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold tracking-wide text-foreground-muted">
                Title template <span className="text-accent-red-text">*</span>
              </label>
              <Input
                value={form.titleTemplate}
                onChange={(e) => setForm({ ...form, titleTemplate: e.target.value })}
                placeholder="{{propertyTitle}} - {{location}} | {{tenantName}}"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold tracking-wide text-foreground-muted">
                Description template
              </label>
              <Textarea
                value={form.descriptionTemplate}
                onChange={(e) => setForm({ ...form, descriptionTemplate: e.target.value })}
                placeholder="{{propertyTitle}} - {{area}}m² tại {{location}}. Giá {{price}}"
                rows={3}
              />
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold tracking-wide text-foreground-muted">
                  OG title
                </label>
                <Input
                  value={form.ogTitleTemplate}
                  onChange={(e) => setForm({ ...form, ogTitleTemplate: e.target.value })}
                  placeholder="Để trống = dùng title"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold tracking-wide text-foreground-muted">
                  OG description
                </label>
                <Textarea
                  value={form.ogDescriptionTemplate}
                  onChange={(e) => setForm({ ...form, ogDescriptionTemplate: e.target.value })}
                  placeholder="Để trống = dùng description"
                  rows={2}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold tracking-wide text-foreground-muted">
                Robots rule
              </label>
              <Input
                value={form.robotsRule}
                onChange={(e) => setForm({ ...form, robotsRule: e.target.value })}
                placeholder="index,follow"
              />
              <p className="text-xs text-foreground-muted">
                VD: index,follow | noindex,nofollow | noindex,follow
              </p>
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
