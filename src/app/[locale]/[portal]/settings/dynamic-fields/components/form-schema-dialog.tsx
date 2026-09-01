"use client";

import { toast } from "sonner";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { FormField } from "@/components/shared/form-section";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import type { FormSchemaFieldDto } from "@/lib/api/models";
import type { GetApiFormSchemasEntityType } from "@/lib/api/models/getApiFormSchemasEntityType";
import { entityTypeOptions, getEntityTypeLabel } from "./entity-type.constants";

interface FieldDefinition {
  id: string;
  fieldKey: string;
  fieldLabel: string;
  fieldType: string;
  entityType: string;
  groupItems?: { id: string; group: { id: string; name: string } }[];
}

type PropertyType = {
  id: string;
  name: string;
  code: string;
};

interface FormSchemaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingId: string | null;
  form: { name: string; entityType: GetApiFormSchemasEntityType; propertyTypeId: string };
  setForm: React.Dispatch<
    React.SetStateAction<{ name: string; entityType: GetApiFormSchemasEntityType; propertyTypeId: string }>
  >;
  propertyTypes: PropertyType[];
  definitions: FieldDefinition[];
  selectedFields: FormSchemaFieldDto[];
  setSelectedFields: React.Dispatch<React.SetStateAction<FormSchemaFieldDto[]>>;
  isPending: boolean;
  onSubmit: () => void;
  onClose: () => void;
}

export function FormSchemaDialog({
  open,
  onOpenChange,
  editingId,
  form,
  setForm,
  propertyTypes,
  definitions,
  selectedFields,
  setSelectedFields,
  isPending,
  onSubmit,
  onClose,
}: FormSchemaDialogProps) {
  const handleAddField = (def: FieldDefinition) => {
    const existing = selectedFields.find((f) => f.fieldId === def.id);
    if (existing) {
      toast.error("Trường này đã được thêm");
      return;
    }
    setSelectedFields([
      ...selectedFields,
      {
        fieldId: def.id,
        groupId: def.groupItems?.[0]?.group.id,
        isRequired: false,
        isVisible: true,
        isReadonly: false,
        sortOrder: selectedFields.length,
      },
    ]);
  };

  const handleRemoveField = (idx: number) => {
    setSelectedFields(selectedFields.filter((_, i) => i !== idx));
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); onOpenChange(v); }}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{editingId ? "Chỉnh sửa đối tượng áp dụng" : "Tạo đối tượng áp dụng"}</DialogTitle>
          <DialogDescription>Ráp các loại dữ liệu thành form hoàn chỉnh</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[40fr_60fr]">
          {/* Cột trái: Thông tin cơ bản */}
          <div className="flex flex-col gap-4">
            <FormField label="Tên đối tượng áp dụng" required>
              <Input
                placeholder="VD: Form tạo bất động sản"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </FormField>

            <FormField label="Đối tượng" required>
              <Select
                value={form.entityType}
                onValueChange={(v) => setForm({ ...form, entityType: v as GetApiFormSchemasEntityType })}
                disabled={!!editingId}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn đối tượng">
                    {(value: string) => getEntityTypeLabel(value)}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {entityTypeOptions.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      label={opt.label}
                    >
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            {form.entityType === "PROPERTY" && (
              <FormField label="Loại BĐS">
                <Select
                  value={form.propertyTypeId || "__all__"}
                  onValueChange={(v) => setForm({ ...form, propertyTypeId: !v || v === "__all__" ? "" : v })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Tất cả loại BĐS">
                      {(value: string) =>
                        !value || value === "__all__"
                          ? "Tất cả loại BĐS"
                          : propertyTypes.find((p) => p.id === value)?.name || "Tất cả loại BĐS"
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__" label="-- Tất cả loại BĐS --">-- Tất cả loại BĐS --</SelectItem>
                    {propertyTypes.map((pt) => (
                      <SelectItem key={pt.id} value={pt.id} label={pt.name}>{pt.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
            )}
          </div>

          {/* Cột phải: Chọn trường */}
          <div className="flex flex-col gap-3">
            <div className="text-sm font-semibold text-foreground">
              Chọn trường ({selectedFields.length} đã chọn)
            </div>
            <div className="flex flex-col gap-2 max-h-[600px] overflow-y-auto rounded-lg border border-border p-3">
              {definitions.length === 0 ? (
                <p className="text-sm text-foreground-muted text-center py-4">
                  Chưa có định nghĩa trường nào
                </p>
              ) : (
                definitions.map((def) => {
                  const selectedIdx = selectedFields.findIndex((f) => f.fieldId === def.id);
                  const isAdded = selectedIdx >= 0;
                  const groupNames = (def.groupItems || []).map((gi) => gi.group.name).join(", ");
                  return (
                    <div
                      key={def.id}
                      className={`flex items-center justify-between gap-2 rounded-md border px-3 py-2 ${isAdded ? "border-primary bg-primary/5" : "border-border"
                        }`}
                    >
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-sm font-medium truncate">{def.fieldLabel}</span>
                        <span className="text-xs text-foreground-muted truncate">
                          {def.fieldKey} · {def.fieldType}
                          {groupNames ? ` · ${groupNames}` : ""}
                        </span>
                      </div>
                      <Button
                        variant={isAdded ? "destructive" : "default"}
                        size="sm"
                        onClick={() => isAdded ? handleRemoveField(selectedIdx) : handleAddField(def)}
                      >
                        {isAdded ? (
                          <>
                            <X size={14} />
                            Hủy
                          </>
                        ) : (
                          <>
                            <Plus size={14} />
                            Thêm
                          </>
                        )}
                      </Button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            Hủy
          </DialogClose>
          <Button onClick={onSubmit} disabled={isPending}>
            {isPending ? "Đang lưu..." : editingId ? "Cập nhật" : "Tạo đối tượng áp dụng"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
