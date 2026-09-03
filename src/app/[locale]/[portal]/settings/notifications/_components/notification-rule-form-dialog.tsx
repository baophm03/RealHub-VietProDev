"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  usePostApiNotificationRule,
  usePatchApiNotificationRule,
  useGetApiNotificationTemplates,
} from "@/lib/api/endpoints/notifications";
import type { CreateNotificationRuleDto } from "@/lib/api/models/createNotificationRuleDto";
import type { UpdateNotificationRuleDto } from "@/lib/api/models/updateNotificationRuleDto";
import type { CreateNotificationRuleDtoReceiverType } from "@/lib/api/models/createNotificationRuleDtoReceiverType";
import type { CreateNotificationRuleDtoChannel } from "@/lib/api/models/createNotificationRuleDtoChannel";
import {
  eventCodeOptions,
  receiverTypeOptions,
  channelOptions,
  type NotificationRule,
} from "./types";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  editing?: NotificationRule | null;
}

export function NotificationRuleFormDialog({ open, onOpenChange, editing }: Props) {
  const [eventCode, setEventCode] = useState("");
  const [receiverType, setReceiverType] = useState<string>("SALES_AGENT");
  const [channel, setChannel] = useState<string>("IN_APP");
  const [templateId, setTemplateId] = useState<string>("");
  const [isEnabled, setIsEnabled] = useState(true);

  const isEdit = !!editing;

  const { data: templatesRaw } = useGetApiNotificationTemplates(undefined, {
    query: { enabled: open },
  });
  const templates: any[] = Array.isArray(templatesRaw) ? templatesRaw : [];

  const { mutateAsync: createRule, isPending: isCreating } = usePostApiNotificationRule({
    mutation: {
      onSuccess: () => {
        toast.success("Tạo rule thành công");
        onOpenChange(false);
      },
      onError: (e: any) =>
        toast.error(e?.response?.data?.error?.message?.[0] || "Lỗi tạo rule"),
    },
  });

  const { mutateAsync: updateRule, isPending: isUpdating } = usePatchApiNotificationRule({
    mutation: {
      onSuccess: () => {
        toast.success("Cập nhật rule thành công");
        onOpenChange(false);
      },
      onError: (e: any) =>
        toast.error(e?.response?.data?.error?.message?.[0] || "Lỗi cập nhật rule"),
    },
  });

  const isPending = isCreating || isUpdating;

  useEffect(() => {
    if (editing) {
      setEventCode(editing.eventCode);
      setReceiverType(editing.receiverType);
      setChannel(editing.channel);
      setTemplateId(editing.templateId ?? "");
      setIsEnabled(editing.isEnabled);
    } else {
      setEventCode("");
      setReceiverType("SALES_AGENT");
      setChannel("IN_APP");
      setTemplateId("");
      setIsEnabled(true);
    }
  }, [editing, open]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventCode) {
      toast.error("Vui lòng chọn event");
      return;
    }
    if (isEdit && editing) {
      const data: UpdateNotificationRuleDto = {
        eventCode,
        receiverType: receiverType as any,
        channel: channel as any,
        templateId: templateId || undefined,
        isEnabled,
      };
      await updateRule({ id: editing.id, data });
    } else {
      const data: CreateNotificationRuleDto = {
        eventCode,
        receiverType: receiverType as CreateNotificationRuleDtoReceiverType,
        channel: channel as CreateNotificationRuleDtoChannel,
        templateId: templateId || undefined,
        isEnabled,
      };
      await createRule({ data });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEdit ? "Sửa notification rule" : "Tạo notification rule"}</DialogTitle>
            <DialogDescription>
              Cấu hình gửi thông báo khi event xảy ra
            </DialogDescription>
          </DialogHeader>
          <form className="flex flex-col gap-4" onSubmit={submit}>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold tracking-wide text-foreground-muted">
                Event <span className="text-accent-red-text">*</span>
              </label>
              <Select value={eventCode} onValueChange={(v) => setEventCode((v as string) ?? "")}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn event">
                    {(value: string) =>
                      eventCodeOptions.find((o) => o.value === value)?.label ?? value
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {eventCodeOptions.map((o) => (
                    <SelectItem key={o.value} value={o.value} label={o.label}>
                      <div className="flex flex-col">
                        <span>{o.label}</span>
                        <span className="font-mono text-xs text-foreground-muted">{o.value}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold tracking-wide text-foreground-muted">
                  Người nhận
                </label>
                <Select
                  value={receiverType}
                  onValueChange={(v) => setReceiverType((v as string) ?? "SALES_AGENT")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn người nhận">
                      {(value: string) =>
                        receiverTypeOptions.find((o) => o.value === value)?.label ?? value
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {receiverTypeOptions.map((o) => (
                      <SelectItem key={o.value} value={o.value} label={o.label}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                Template (tùy chọn)
              </label>
              <Select
                value={templateId}
                onValueChange={(v) => setTemplateId((v as string) ?? "")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Không dùng template">
                    {(value: string) => {
                      if (!value) return "Không dùng template";
                      const t = templates.find((t) => t.id === value);
                      return t ? `${t.code} (${t.channel})` : value;
                    }}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="" label="Không dùng template">
                    Không dùng template
                  </SelectItem>
                  {templates.map((t) => (
                    <SelectItem key={t.id} value={t.id} label={`${t.code} (${t.channel})`}>
                      <div className="flex flex-col">
                        <span className="font-mono text-sm">{t.code}</span>
                        <span className="text-xs text-foreground-muted">
                          {t.titleTemplate}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border bg-surface-muted/40 p-3">
              <div className="flex flex-col">
                <span className="text-sm font-medium">Kích hoạt</span>
                <span className="text-xs text-foreground-muted">
                  Rule bật sẽ tự động gửi thông báo khi event xảy ra
                </span>
              </div>
              <Switch checked={isEnabled} onCheckedChange={setIsEnabled} />
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
                  "Tạo rule"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
