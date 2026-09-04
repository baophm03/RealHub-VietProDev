"use client";

import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  conflictTypeLabel,
  disputeStatusVariant,
  disputeStatusLabel,
  type LeadDispute,
} from "./types";

interface Props {
  disputes: LeadDispute[];
  isLoading: boolean;
  canApprove: boolean;
  isResolving: boolean;
  onResolve: (dispute: LeadDispute, resolution: "RESOLVED" | "REJECTED") => Promise<void>;
}

export function DisputesList({
  disputes,
  isLoading,
  canApprove,
  isResolving,
  onResolve,
}: Props) {
  if (isLoading) {
    return <div className="h-64 animate-pulse rounded-lg bg-surface-muted" />;
  }

  if (disputes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border py-16 text-center">
        <p className="text-sm font-medium">Không có tranh chấp</p>
        <p className="text-xs text-foreground-muted">
          Chưa có tranh chấp phụ trách nào trong trạng thái này.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {disputes.map((d) => (
        <Card key={d.id}>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Badge variant={disputeStatusVariant[d.status] ?? "default"}>
                    {disputeStatusLabel[d.status] ?? d.status}
                  </Badge>
                  <span className="text-sm font-medium">
                    {conflictTypeLabel[d.conflictType] ?? d.conflictType}
                  </span>
                </div>
                <p className="text-xs text-foreground-muted">
                  Lead {d.lead.leadCode} · {d.lead.phoneNormalized} ·{" "}
                  {new Date(d.createdAt).toLocaleDateString("vi-VN")}
                </p>
              </div>
              {canApprove && d.status === "OPEN" && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isResolving}
                    onClick={() => onResolve(d, "RESOLVED")}
                  >
                    <Check size={12} className="text-accent-green-text" />
                    Giải quyết
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isResolving}
                    onClick={() => onResolve(d, "REJECTED")}
                  >
                    <X size={12} className="text-accent-red-text" />
                    Từ chối
                  </Button>
                </div>
              )}
            </div>
            {d.reason && (
              <p className="rounded-md bg-surface-muted/40 px-3 py-2 text-sm">
                {d.reason}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-3 text-xs text-foreground-muted">
              <span>
                Yêu cầu bởi:{" "}
                <span className="font-medium text-foreground">
                  {d.requester?.fullName ?? "—"}
                </span>
              </span>
              <span>
                Người tạo lead:{" "}
                <span className="font-medium text-foreground">
                  {d.lead.creator?.fullName ?? "—"}
                </span>
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
