"use client";

import { Pencil, Trash2, Users, Clock, Handshake, MoreVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Can } from "@casl/react";
import {
  statusConfig,
  transactionTypeOptions,
  sellingModeOptions,
  expireBehaviorOptions,
  type AssignmentPolicy,
} from "./types";

interface PolicyCardProps {
  policy: AssignmentPolicy;
  onEdit: () => void;
  onDelete: () => void;
}

export function PolicyCard({ policy, onEdit, onDelete }: PolicyCardProps) {
  const status = statusConfig[policy.status] ?? statusConfig.INACTIVE;
  const StatusIcon = status.icon;

  const txnLabel = transactionTypeOptions.find((t) => t.value === policy.transactionType)?.label;
  const sellingLabel = sellingModeOptions.find((s) => s.value === policy.sellingMode)?.label;
  const expireLabel = expireBehaviorOptions.find((e) => e.value === policy.expireBehavior)?.label;

  const isGlobal = !policy.propertyTypeId && !policy.transactionType && !policy.sellingMode && !policy.projectId && !policy.zoneId;

  const filters: string[] = [];
  if (policy.propertyType) filters.push(policy.propertyType.name);
  if (txnLabel) filters.push(txnLabel);
  if (sellingLabel) filters.push(sellingLabel);
  if (policy.project) filters.push(policy.project.name);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-surface transition-all duration-300 hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.08)]">
      <div className="flex items-center justify-between border-b border-border bg-surface-muted/30 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-foreground-muted">
            Ưu tiên #{policy.priority}
          </span>
          {isGlobal && (
            <Badge variant="blue" className="text-[10px]">
              Mặc định
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={status.variant} className="text-[10px]">
            <StatusIcon size={10} />
            {status.label}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  className="rounded-md p-1 text-foreground-muted transition-colors hover:bg-surface-muted"
                  aria-label="Thao tác"
                />
              }
            >
              <MoreVertical size={14} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <Can I="UPDATE" a="SETTING">
                <DropdownMenuItem onClick={onEdit}>
                  <Pencil size={14} />
                  Sửa
                </DropdownMenuItem>
              </Can>
              <Can I="DELETE" a="SETTING">
                <DropdownMenuItem onClick={onDelete} className="text-destructive">
                  <Trash2 size={14} />
                  Xóa
                </DropdownMenuItem>
              </Can>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="text-base font-semibold leading-tight tracking-tight">
          {policy.name}
        </h3>

        {!isGlobal && filters.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {filters.map((f, i) => (
              <Badge key={i} variant="outline" className="text-[10px]">
                {f}
              </Badge>
            ))}
          </div>
        )}

        <div className="mt-auto flex flex-col gap-2 border-t border-border pt-3">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-foreground-muted">
              <Users size={12} />
              Sales tối đa
            </span>
            <strong className="text-foreground">{policy.maxAssignedUsers}</strong>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-foreground-muted">
              <Clock size={12} />
              Thời hạn
            </span>
            <strong className="text-foreground">{policy.durationDays} ngày</strong>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-foreground-muted">
              <Handshake size={12} />
              Hết hạn
            </span>
            <strong className="text-foreground text-right text-[11px]">
              {expireLabel ?? policy.expireBehavior}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}
