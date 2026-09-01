"use client";

import { ArrowRight, Flag, PlayCircle, Square } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useGetApiWorkflowEntityStatusFields } from "@/lib/api/endpoints/workflow";
import { entityTypeConfig, statusConfig, type WorkflowDefinition } from "./types";

interface StatusFieldValue {
  code: string;
  label: string;
  color?: string;
}

interface StatusField {
  fieldKey: string;
  label: string;
  values: StatusFieldValue[];
}

export function WorkflowDetailDialog({
  workflow,
  open,
  onOpenChange,
}: {
  workflow: WorkflowDefinition | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { data: statusFieldsData } = useGetApiWorkflowEntityStatusFields(
    { entityType: (workflow?.entityType ?? "PROPERTY") as any },
    { query: { enabled: !!workflow } },
  );
  const raw = statusFieldsData as any;
  const statusFields: StatusField[] = Array.isArray(raw) ? raw : (raw?.data ?? []);

  // Build label lookups
  const fieldLabelMap = new Map<string, string>();
  const valueLabelMap = new Map<string, Map<string, string>>();
  for (const sf of statusFields) {
    fieldLabelMap.set(sf.fieldKey, sf.label);
    const inner = new Map<string, string>();
    for (const v of sf.values) inner.set(v.code, v.label);
    valueLabelMap.set(sf.fieldKey, inner);
  }
  const getStateLabel = (col: string, name: string) =>
    valueLabelMap.get(col)?.get(name) ?? name;
  const getColumnLabel = (col: string) =>
    fieldLabelMap.get(col) ?? col;

  if (!workflow) return null;

  const status = statusConfig[workflow.status] ?? statusConfig.ACTIVE;
  const entityCfg = entityTypeConfig[workflow.entityType];
  const sortedStates = workflow.states?.slice().sort((a, b) => a.sortOrder - b.sortOrder) ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {workflow.name}
            <Badge variant="default">v{workflow.version}</Badge>
            <Badge variant={status.variant}>{status.label}</Badge>
          </DialogTitle>
          <DialogDescription>
            {entityCfg?.label ?? workflow.entityType}
            {entityCfg && <span className="block mt-0.5">{entityCfg.description}</span>}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6 overflow-y-auto pr-1">
          {/* States section */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">
              Trạng thái ({sortedStates.length})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {sortedStates.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center gap-3 rounded-lg border border-border bg-surface px-3 py-2.5"
                >
                  <div
                    className="size-3 rounded-full shrink-0"
                    style={{ backgroundColor: s.color ?? "#6b7280" }}
                  />
                  <div className="flex flex-col gap-1 min-w-0 flex-1">
                    <span className="text-sm font-medium truncate">
                      {getStateLabel(s.columnName, s.stateName)}
                    </span>
                    <Badge variant="default" className="text-[10px] w-fit">
                      {getColumnLabel(s.columnName)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {s.isInitial && (
                      <Badge variant="blue" className="gap-1">
                        <PlayCircle size={10} />
                        Bắt đầu
                      </Badge>
                    )}
                    {s.isFinal && (
                      <Badge variant="purple" className="gap-1">
                        <Flag size={10} />
                        Kết thúc
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transitions section */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">
              Chuyển trạng thái ({workflow.transitions?.length ?? 0})
            </h4>
            {workflow.transitions?.length ? (
              <div className="flex flex-col gap-2">
                {workflow.transitions.map((t) => (
                  <div
                    key={t.id}
                    className="flex flex-col gap-2 rounded-lg border border-border bg-surface-muted/30 px-3 py-2.5 sm:flex-row sm:items-center"
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="text-sm font-medium truncate">
                          {getStateLabel(t.fromState.columnName, t.fromState.stateName)}
                        </span>
                        <span className="text-[10px] text-foreground-muted truncate">
                          {getColumnLabel(t.fromState.columnName)}
                        </span>
                      </div>
                      <ArrowRight size={14} className="text-foreground-muted shrink-0" />
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="text-sm font-medium truncate">
                          {getStateLabel(t.toState.columnName, t.toState.stateName)}
                        </span>
                        <span className="text-[10px] text-foreground-muted truncate">
                          {getColumnLabel(t.toState.columnName)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant="default">{t.actionLabel}</Badge>
                      {t.requireReason && (
                        <Badge variant="yellow" className="gap-1">
                          <Square size={8} />
                          Lý do
                        </Badge>
                      )}
                      {t.requireAttachment && (
                        <Badge variant="yellow" className="gap-1">
                          <Square size={8} />
                          Tệp
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-foreground-muted">Chưa có chuyển trạng thái nào.</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
