"use client";

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
  propertyType?: { id: string; name: string; code: string } | null;
  sortOrder?: number;
  status?: string;
  definitions?: FieldDefinition[];
}

interface FieldDefinition {
  id: string;
  fieldKey: string;
  fieldLabel: string;
  fieldType: string;
  entityType: string;
  group?: { id: string; name: string } | null;
  propertyType?: { id: string; name: string; code: string } | null;
  isRequired?: boolean;
  status?: string;
}

interface AssignDefinitionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assignTargetGroup: FieldGroup | null;
  unassignedDefinitions: FieldDefinition[];
  selectedDefIds: string[];
  onToggleDef: (id: string) => void;
  onSubmit: () => void;
  isAssigning: boolean;
}

export function AssignDefinitionDialog({
  open,
  onOpenChange,
  assignTargetGroup,
  unassignedDefinitions,
  selectedDefIds,
  onToggleDef,
  onSubmit,
  isAssigning,
}: AssignDefinitionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Gán trường vào nhóm</DialogTitle>
          <DialogDescription>
            {assignTargetGroup
              ? `Chọn các trường chưa có nhóm để gán vào "${assignTargetGroup.name}"`
              : ""}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto">
          {(() => {
            const targetPropTypeId = assignTargetGroup?.propertyType?.id;
            const eligibleDefs = targetPropTypeId
              ? unassignedDefinitions.filter((d) => !d.propertyType?.id || d.propertyType?.id === targetPropTypeId)
              : unassignedDefinitions;
            if (eligibleDefs.length === 0) {
              return (
                <p className="text-sm text-foreground-muted py-4 text-center">
                  Không có trường nào phù hợp để gán
                </p>
              );
            }
            return eligibleDefs.map((def) => (
              <label
                key={def.id}
                className="flex items-center gap-2 rounded-md border border-border px-3 py-2 cursor-pointer hover:bg-surface-muted"
              >
                <input
                  type="checkbox"
                  checked={selectedDefIds.includes(def.id)}
                  onChange={() => onToggleDef(def.id)}
                  className="h-4 w-4"
                />
                <div className="flex flex-1 items-center gap-2">
                  <span className="text-sm font-medium">{def.fieldLabel}</span>
                  <code className="rounded bg-surface-muted px-1 py-0.5 font-mono text-xs">
                    {def.fieldKey}
                  </code>
                </div>
              </label>
            ));
          })()}
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            Hủy
          </DialogClose>
          <Button onClick={onSubmit} disabled={isAssigning || selectedDefIds.length === 0}>
            {isAssigning ? "Đang gán..." : `Gán ${selectedDefIds.length} trường`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
