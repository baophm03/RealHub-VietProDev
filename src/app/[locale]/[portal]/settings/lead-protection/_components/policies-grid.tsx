"use client";

import { Shield, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  sourceLabel,
  sellingModeLabel,
  customerTypeLabel,
  type LeadProtectionPolicy,
} from "./types";

interface Props {
  policies: LeadProtectionPolicy[];
  canUpdate: boolean;
  canDelete: boolean;
  onEdit: (p: LeadProtectionPolicy) => void;
  onDelete: (p: LeadProtectionPolicy) => void;
}

export function PoliciesGrid({ policies, canUpdate, canDelete, onEdit, onDelete }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {policies.map((p) => (
        <Card key={p.id}>
          <CardHeader>
            <div className="flex items-start justify-between gap-2">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Shield size={14} className="text-foreground-muted" />
                  {p.name}
                </CardTitle>
                <CardDescription>
                  {p.source ? sourceLabel[p.source] ?? p.source : "Mọi nguồn"} ·{" "}
                  {p.customerType ? customerTypeLabel[p.customerType] ?? p.customerType : "Mọi loại KH"}
                </CardDescription>
              </div>
              <Badge variant={p.status === "ACTIVE" ? "green" : "default"}>
                {p.status === "ACTIVE" ? "Active" : p.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="text-foreground-muted">Bảo vệ</p>
                <p className="font-medium tabular-nums">{p.protectionDays} ngày</p>
              </div>
              <div>
                <p className="text-foreground-muted">Reclaim</p>
                <p className="font-medium tabular-nums">{p.inactiveReclaimDays} ngày</p>
              </div>
              <div>
                <p className="text-foreground-muted">Reassign</p>
                <p className="font-medium">{p.allowReassign ? "Cho phép" : "Không"}</p>
              </div>
              <div>
                <p className="text-foreground-muted">Ưu tiên</p>
                <p className="font-medium tabular-nums">{p.priority}</p>
              </div>
              {p.sellingMode && (
                <div className="col-span-2">
                  <p className="text-foreground-muted">Selling mode</p>
                  <p className="font-medium">{sellingModeLabel[p.sellingMode] ?? p.sellingMode}</p>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 pt-3">
              {canUpdate && (
                <Button variant="outline" size="sm" onClick={() => onEdit(p)}>
                  <Pencil size={12} />
                  Sửa
                </Button>
              )}
              {canDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-auto text-destructive"
                  onClick={() => onDelete(p)}
                >
                  <Trash2 size={12} />
                  Xóa
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
