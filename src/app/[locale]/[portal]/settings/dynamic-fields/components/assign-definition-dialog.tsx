"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

interface FieldGroup {
  id: string;
  name: string;
  code: string;
  entityType: string;
  sortOrder?: number;
  status?: string;
  groupItems?: { id: string; field: FieldDefinition }[];
}

interface FieldDefinition {
  id: string;
  fieldKey: string;
  fieldLabel: string;
  fieldType: string;
  entityType: string;
  isRequired?: boolean;
  status?: string;
  groupItems?: { id: string; group: { id: string; name: string } }[];
}

interface AssignDefinitionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assignTargetGroup: FieldGroup | null;
  allDefinitions: FieldDefinition[];
  onSubmit: (fieldIds: string[]) => void;
  isPending: boolean;
}

export function AssignDefinitionDialog({
  open,
  onOpenChange,
  assignTargetGroup,
  allDefinitions,
  onSubmit,
  isPending,
}: AssignDefinitionDialogProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    if (open && assignTargetGroup) {
      const existing = (assignTargetGroup.groupItems || []).map((item) => item.field.id);
      setSelectedIds(existing);
    }
  }, [open, assignTargetGroup]);

  const toggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const eligibleDefs = assignTargetGroup
    ? allDefinitions.filter((d) => {
      if (d.entityType !== assignTargetGroup.entityType) return false;
      // Ẩn field đã thuộc nhóm khác (cùng entityType)
      const inOtherGroup = (d.groupItems || []).some(
        (gi) => gi.group.id !== assignTargetGroup.id,
      );
      return !inOtherGroup;
    })
    : allDefinitions;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Gán trường vào nhóm</DialogTitle>
          <DialogDescription>
            {assignTargetGroup
              ? `Chọn các trường thuộc "${assignTargetGroup.name}"`
              : ""}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto">
          {eligibleDefs.length === 0 ? (
            <p className="text-sm text-foreground-muted py-4 text-center">
              Không có trường nào phù hợp
            </p>
          ) : (
            eligibleDefs.map((def) => (
              <label
                key={def.id}
                className="flex items-center gap-2 rounded-md border border-border px-3 py-2 cursor-pointer hover:bg-surface-muted"
              >
                <input
                  type="checkbox"
                  checked={selectedIds.includes(def.id)}
                  onChange={() => toggle(def.id)}
                  className="h-4 w-4"
                />
                <div className="flex flex-1 items-center gap-2">
                  <span className="text-sm font-medium">{def.fieldLabel}</span>
                  <code className="rounded bg-surface-muted px-1 py-0.5 font-mono text-xs">
                    {def.fieldKey}
                  </code>
                </div>
              </label>
            ))
          )}
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            Hủy
          </DialogClose>
          <Button onClick={() => onSubmit(selectedIds)} disabled={isPending}>
            {isPending ? "Đang lưu..." : `Lưu (${selectedIds.length} trường)`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
