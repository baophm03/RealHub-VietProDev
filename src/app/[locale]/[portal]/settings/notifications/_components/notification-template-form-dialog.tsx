"use client";

import { useState, useEffect } from "react";
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
import {
  usePostApiNotificationTemplate,
  usePatchApiNotificationTemplate,
} from "@/lib/api/endpoints/notifications";
import type { CreateNotificationTemplateDto } from "@/lib/api/models/createNotificationTemplateDto";
import type { UpdateNotificationTemplateDto } from "@/lib/api/models/updateNotificationTemplateDto";
import type { CreateNotificationTemplateDtoChannel } from "@/lib/api/models/createNotificationTemplateDtoChannel";
import {
  channelOptions,
  type NotificationTemplate,
} from "./types";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  editing?: NotificationTemplate | null;
}

export function NotificationTemplateFormDialog({ open, onOpenChange, editing }: Props) {
  const [code, setCode] = useState("");
  const [titleTemplate, setTitleTemplate] = useState("");
  const [bodyTemplate, setBodyTemplate] = useState("");
  const [channel, setChannel] = useState<string>("IN_APP");

  const isEdit = !!editing;

  const { mutateAsync: createTemplate, isPending: isCreating } = usePostApiNotificationTemplate({
    mutation: {
      onSuccess: () => {
        toast.success("Tạo template thành công");
        onOpenChange(false);
      },
      onError: (e: any) =>
        toast.error(e?.response?.data?.error?.message?.[0] || "Lỗi tạo template"),
    },
  });

  const { mutateAsync: updateTemplate, isPending: isUpdating } = usePatchApiNotificationTemplate({
    mutation: {
      onSuccess: () => {
        toast.success("Cập nhật template thành công");
        onOpenChange(false);
      },
      onError: (e: any) =>
        toast.error(e?.response?.data?.error?.message?.[0] || "Lỗi cập nhật template"),
    },
  });

  const isPending = isCreating || isUpdating;

  useEffect(() => {
    if (editing) {
      setCode(editing.code);
      setTitleTemplate(editing.titleTemplate);
      setBodyTemplate(editing.bodyTemplate);
      setChannel(editing.channel);
    } else {
      setCode("");
      setTitleTemplate("");
      setBodyTemplate("");
      setChannel("IN_APP");
    }
  }, [editing, open]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !titleTemplate.trim() || !bodyTemplate.trim()) {
      toast.error("Vui lòng nhập đủ code, title template và body template");
      return;
    }
    if (isEdit && editing) {
      const data: UpdateNotificationTemplateDto = {
        code: code.trim(),
        titleTemplate: titleTemplate.trim(),
        bodyTemplate: bodyTemplate.trim(),
        channel: channel as any,
      };
      await updateTemplate({ id: editing.id, data });
    } else {
      const data: CreateNotificationTemplateDto = {
        code: code.trim(),
        titleTemplate: titleTemplate.trim(),
        bodyTemplate: bodyTemplate.trim(),
        channel: channel as CreateNotificationTemplateDtoChannel,
      };
      await createTemplate({ data });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEdit ? "Sửa notification template" : "Tạo notification template"}
            </DialogTitle>
            <DialogDescription>
              Template nội dung thông báo với biến <code className="font-mono">{"{{variable}}"}</code>
            </DialogDescription>
          </DialogHeader>
          <form className="flex flex-col gap-4" onSubmit={submit}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold tracking-wide text-foreground-muted">
                  Code <span className="text-accent-red-text">*</span>
                </label>
                <Input
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="LEAD_ASSIGNED_TEMPLATE"
                  className="font-mono"
                  disabled={isEdit}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold tracking-wide text-foreground-muted">
                  Channel
                </label>
                <Select value={channel} onValueChange={(v) => setChannel((v as string) ?? "IN_APP")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn channel">
                      {(value: string) =>
                        channelOptions.find((o) => o.value === value)?.label ?? value
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {channelOptions.map((o) => (
                      <SelectItem key={o.value} value={o.value} label={o.label}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold tracking-wide text-foreground-muted">
                Title template <span className="text-accent-red-text">*</span>
              </label>
              <Input
                value={titleTemplate}
                onChange={(e) => setTitleTemplate(e.target.value)}
                placeholder="Lead mới được gán: {{leadName}}"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold tracking-wide text-foreground-muted">
                Body template <span className="text-accent-red-text">*</span>
              </label>
              <Textarea
                value={bodyTemplate}
                onChange={(e) => setBodyTemplate(e.target.value)}
                placeholder="Bạn được gán lead {{leadName}} ({{leadPhone}}). Vui lòng liên hệ trong 24h."
                rows={5}
              />
              <p className="text-xs text-foreground-muted">
                Hỗ trợ biến: <code className="font-mono">{"{{leadName}}"}</code>,{" "}
                <code className="font-mono">{"{{leadPhone}}"}</code>,{" "}
                <code className="font-mono">{"{{dealCode}}"}</code>, v.v.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
                Hủy
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Đang lưu...
                  </>
                ) : isEdit ? (
                  "Lưu thay đổi"
                ) : (
                  "Tạo template"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
