"use client";

import { X } from "lucide-react";
import { FormField } from "@/components/shared/form-section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  receiverRoleOptions,
  receiverTypeOptions,
  splitTypeOptions,
  type Split,
} from "./types";

interface SplitItemProps {
  split: Split;
  splitsCount: number;
  totalPercent: number;
  isLast: boolean;
  onChange: (patch: Partial<Split>) => void;
  onRemove: () => void;
}

export function SplitItem({
  split,
  splitsCount,
  totalPercent,
  isLast,
  onChange,
  onRemove,
}: SplitItemProps) {
  return (
    <div className="relative flex flex-col gap-2 rounded-md border border-border bg-surface p-3">
      {splitsCount > 1 && (
        <Button
          size="icon-sm"
          variant="ghost"
          className="absolute top-1 right-1 z-10"
          onClick={onRemove}
          title="Xóa split"
        >
          <X size={12} />
        </Button>
      )}

      {/* Row 1: Receiver + role/userId */}
      <div className="grid grid-cols-12 gap-2 items-end">
        <FormField label="Chia" className="col-span-5">
          <Select
            value={split.receiverType}
            onValueChange={(v) => {
              const rt = (v as string) ?? "ROLE";
              onChange({
                receiverType: rt,
                receiverRole: rt === "ROLE" ? "SALES" : undefined,
                receiverUserId: rt === "USER" ? "" : undefined,
              });
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Kiểu">
                {(value: string) =>
                  receiverTypeOptions.find((o) => o.value === value)?.label || value
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
        </FormField>

        {split.receiverType === "ROLE" && (
          <FormField label="Vai trò" className="col-span-7">
            <Select
              value={split.receiverRole ?? "SALES"}
              onValueChange={(v) =>
                onChange({ receiverRole: (v as string) ?? "SALES" })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Role">
                  {(value: string) =>
                    receiverRoleOptions.find((o) => o.value === value)?.label || value
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {receiverRoleOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value} label={o.label}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
        )}

        {split.receiverType === "USER" && (
          <FormField label="User ID" className="col-span-7">
            <Input
              placeholder="uuid"
              value={split.receiverUserId ?? ""}
              onChange={(e) => onChange({ receiverUserId: e.target.value })}
            />
          </FormField>
        )}

        {split.receiverType === "EXTERNAL" && (
          <div className="col-span-7" />
        )}
      </div>

      {/* Row 2: Loại + số tiền */}
      <div className="grid grid-cols-12 gap-2 items-end">
        <FormField label="Loại" className="col-span-5">
          <Select
            value={split.splitType}
            onValueChange={(v) =>
              onChange({ splitType: (v as string) ?? "PERCENT" })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Loại">
                {(value: string) =>
                  splitTypeOptions.find((o) => o.value === value)?.label || value
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {splitTypeOptions.map((o) => (
                <SelectItem key={o.value} value={o.value} label={o.label}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        <FormField
          label={split.splitType === "PERCENT" ? "%" : "Số tiền"}
          className="col-span-7"
        >
          <Input
            type="number"
            placeholder={split.splitType === "PERCENT" ? "70" : "5000000"}
            value={split.splitValue}
            onChange={(e) => onChange({ splitValue: Number(e.target.value) })}
          />
        </FormField>
      </div>

      {isLast && split.splitType === "PERCENT" && totalPercent !== 100 && (
        <p className="text-[10px] text-foreground-muted">
          Tổng % các split PERCENT = {totalPercent}% (khuyến nghị 100%)
        </p>
      )}
    </div>
  );
}
