"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { FormField } from "@/components/shared/form-section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import type { CreateCommissionPlanDto } from "@/lib/api/models/createCommissionPlanDto";
import {
  emptyRule,
  emptySplit,
  type Rule,
  type Split,
} from "./types";
import { RuleSection } from "./rule-section";

interface CreatePlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (dto: CreateCommissionPlanDto) => Promise<void>;
  isSubmitting: boolean;
}

export function CreatePlanDialog({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
}: CreatePlanDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState(0);
  const [effectiveFrom, setEffectiveFrom] = useState("");
  const [effectiveTo, setEffectiveTo] = useState("");
  const [rules, setRules] = useState<Rule[]>([emptyRule()]);
  const [collapsedRules, setCollapsedRules] = useState<Set<number>>(new Set());

  const toggleRule = (idx: number) =>
    setCollapsedRules((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });

  const reset = () => {
    setName("");
    setDescription("");
    setPriority(0);
    setEffectiveFrom("");
    setEffectiveTo("");
    setRules([emptyRule()]);
    setCollapsedRules(new Set());
  };

  const handleClose = (open: boolean) => {
    onOpenChange(open);
    if (!open) reset();
  };

  const addRule = () => setRules((r) => [...r, emptyRule()]);
  const removeRule = (idx: number) =>
    setRules((r) => (r.length === 1 ? r : r.filter((_, i) => i !== idx)));
  const updateRule = (idx: number, patch: Partial<Rule>) =>
    setRules((r) => r.map((rule, i) => (i === idx ? { ...rule, ...patch } : rule)));

  const addSplit = (ruleIdx: number) =>
    updateRule(ruleIdx, {
      splits: [...(rules[ruleIdx].splits ?? []), emptySplit()],
    });
  const removeSplit = (ruleIdx: number, splitIdx: number) =>
    updateRule(ruleIdx, {
      splits:
        (rules[ruleIdx].splits?.length ?? 0) <= 1
          ? rules[ruleIdx].splits
          : rules[ruleIdx].splits?.filter((_, i) => i !== splitIdx),
    });
  const updateSplit = (ruleIdx: number, splitIdx: number, patch: Partial<Split>) =>
    updateRule(ruleIdx, {
      splits: rules[ruleIdx].splits?.map((s, i) => (i === splitIdx ? { ...s, ...patch } : s)),
    });

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Vui lòng nhập tên plan");
      return;
    }
    if (!effectiveFrom) {
      toast.error("Vui lòng chọn ngày bắt đầu");
      return;
    }
    for (const rule of rules) {
      if (!rule.name.trim()) {
        toast.error("Mọi rule cần có tên");
        return;
      }
      if (!rule.splits?.length) {
        toast.error(`Rule "${rule.name}" cần ít nhất 1 split`);
        return;
      }
    }

    const dto: CreateCommissionPlanDto = {
      name: name.trim(),
      description: description.trim() || undefined,
      priority,
      effectiveFrom: new Date(effectiveFrom).toISOString(),
      effectiveTo: effectiveTo ? new Date(effectiveTo).toISOString() : undefined,
      rules: rules.map((r) => ({
        name: r.name.trim(),
        priority: r.priority ?? 0,
        conditionsJson: r.conditionsJson,
        calculationType: r.calculationType,
        calculationValue: Number(r.calculationValue) || 0,
        calculationBase: r.calculationBase,
        minCommissionAmount: r.minCommissionAmount ? Number(r.minCommissionAmount) : undefined,
        maxCommissionAmount: r.maxCommissionAmount ? Number(r.maxCommissionAmount) : undefined,
        splits: r.splits.map((s) => ({
          receiverType: s.receiverType,
          receiverRole: s.receiverType === "ROLE" ? s.receiverRole : undefined,
          receiverUserId: s.receiverType === "USER" ? s.receiverUserId : undefined,
          splitType: s.splitType,
          splitValue: Number(s.splitValue) || 0,
          minAmount: s.minAmount ? Number(s.minAmount) : undefined,
          maxAmount: s.maxAmount ? Number(s.maxAmount) : undefined,
          priority: s.priority,
        })),
      })),
    };

    await onSubmit(dto);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-7xl h-[96vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Tạo plan hoa hồng</DialogTitle>
          <DialogDescription>
            Plan chứa nhiều rule — mỗi rule áp dụng theo điều kiện và chia hoa hồng cho các role
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 flex-1 min-h-0">
          {/* Left column: Plan info */}
          <div className="flex flex-col gap-3 col-span-3 overflow-y-auto pr-1">
            <FormField label="Tên plan" required>
              <Input
                placeholder="VD: Hoa hồng 2026"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormField>
            <FormField label="Mô tả">
              <Textarea
                placeholder="Mô tả ngắn gọn..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="field-sizing-fixed min-h-25"
              />
            </FormField>
            <FormField label="Ngày bắt đầu" required>
              <Input
                type="date"
                value={effectiveFrom}
                onChange={(e) => setEffectiveFrom(e.target.value)}
              />
            </FormField>
            <FormField label="Ngày kết thúc" helper="Để trống = vô thời hạn">
              <Input
                type="date"
                value={effectiveTo}
                onChange={(e) => setEffectiveTo(e.target.value)}
              />
            </FormField>
            <FormField label="Ưu tiên" helper="Số cao hơn áp dụng trước">
              <Input
                type="number"
                value={priority}
                onChange={(e) => setPriority(Number(e.target.value))}
              />
            </FormField>
          </div>

          {/* Right column: Rule sections */}
          <div className="flex flex-col gap-4 col-span-7 overflow-y-auto pr-1">
            {rules.map((rule, rIdx) => (
              <RuleSection
                key={rIdx}
                rule={rule}
                ruleIdx={rIdx}
                rulesCount={rules.length}
                collapsed={collapsedRules.has(rIdx)}
                onToggleCollapse={() => toggleRule(rIdx)}
                onRuleChange={(patch) => updateRule(rIdx, patch)}
                onRemoveRule={() => removeRule(rIdx)}
                onAddSplit={() => addSplit(rIdx)}
                onSplitChange={(sIdx, patch) => updateSplit(rIdx, sIdx, patch)}
                onSplitRemove={(sIdx) => removeSplit(rIdx, sIdx)}
              />
            ))}

            {/* Add rule button at the bottom of the rules column */}
            <Button variant="outline" className="w-full" onClick={addRule}>
              <Plus size={14} />
              Tạo rule
            </Button>
          </div>
        </div>

        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Hủy</DialogClose>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Đang tạo..." : "Tạo plan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
