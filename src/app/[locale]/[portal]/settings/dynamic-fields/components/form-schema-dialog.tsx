"use client";

import { toast } from "sonner";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
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

const entityTypeLabels: Record<string, string> = {
  PROPERTY: "Bất động sản",
  CUSTOMER_NEED: "Nhu cầu khách hàng",
  LEAD: "Nguồn khách hàng",
  DEAL: "Giao dịch",
};

interface FieldDefinition {
  id: string;
  fieldKey: string;
  fieldLabel: string;
  fieldType: string;
  entityType: string;
  group?: { id: string; name: string } | null;
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
        groupId: def.group?.id,
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

  const handleToggleField = (idx: number, key: "isRequired" | "isVisible" | "isReadonly") => {
    const next = [...selectedFields];
    next[idx] = { ...next[idx], [key]: !next[idx][key] };
    setSelectedFields(next);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); onOpenChange(v); }}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{editingId ? "Chỉnh sửa nhóm đối tượng" : "Tạo nhóm đối tượng"}</DialogTitle>
          <DialogDescription>Ráp các trường dữ liệu thành form hoàn chỉnh</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <FormField label="Tên nhóm đối tượng" required>
            <Input
              placeholder="VD: Form tạo bất động sản"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </FormField>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Đối tượng" required>
              <Select
                value={form.entityType}
                onValueChange={(v) => setForm({ ...form, entityType: v as GetApiFormSchemasEntityType })}
                disabled={!!editingId}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn đối tượng">
                    {(value: string) => entityTypeLabels[value] || value}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(entityTypeLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value} label={label}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            {form.entityType === "PROPERTY" && (
              <FormField label="Loại bất động sản">
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

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Chọn trường" helper="Nhấn Thêm để đưa vào form">
              <div className="flex flex-col gap-2 max-h-80 overflow-y-auto rounded-lg border border-border p-3">
                {definitions.length === 0 ? (
                  <p className="text-sm text-foreground-muted text-center py-4">
                    Chưa có định nghĩa trường nào
                  </p>
                ) : (
                  definitions.map((def) => {
                    const isAdded = selectedFields.some((f) => f.fieldId === def.id);
                    return (
                      <div
                        key={def.id}
                        className="flex items-center justify-between gap-2 rounded-md border border-border px-3 py-2"
                      >
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-medium truncate">{def.fieldLabel}</span>
                          <span className="text-xs text-foreground-muted truncate">
                            {def.fieldKey} · {def.fieldType}
                            {def.group?.name ? ` · ${def.group.name}` : ""}
                          </span>
                        </div>
                        <Button
                          variant={isAdded ? "secondary" : "outline"}
                          size="sm"
                          disabled={isAdded}
                          onClick={() => handleAddField(def)}
                        >
                          {isAdded ? "Đã thêm" : (
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
            </FormField>

            <FormField label={`Trường đã chọn (${selectedFields.length})`}>
              <div className="flex flex-col gap-2 max-h-80 overflow-y-auto rounded-lg border border-border p-3">
                {selectedFields.length === 0 ? (
                  <p className="text-sm text-foreground-muted text-center py-4">
                    Chưa chọn trường nào
                  </p>
                ) : (
                  selectedFields.map((sf, idx) => {
                    const def = definitions.find((d) => d.id === sf.fieldId);
                    return (
                      <div key={idx} className="flex flex-col gap-2 rounded-md border border-border p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium truncate">
                            {def?.fieldLabel || sf.fieldId}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => handleRemoveField(idx)}
                          >
                            <X size={14} />
                          </Button>
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <label className="flex items-center gap-1.5 text-xs">
                            <Switch
                              checked={sf.isRequired || false}
                              onCheckedChange={() => handleToggleField(idx, "isRequired")}
                            />
                            Bắt buộc
                          </label>
                          <label className="flex items-center gap-1.5 text-xs">
                            <Switch
                              checked={sf.isVisible !== false}
                              onCheckedChange={() => handleToggleField(idx, "isVisible")}
                            />
                            Hiển thị
                          </label>
                          <label className="flex items-center gap-1.5 text-xs">
                            <Switch
                              checked={sf.isReadonly || false}
                              onCheckedChange={() => handleToggleField(idx, "isReadonly")}
                            />
                            Chỉ đọc
                          </label>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </FormField>
          </div>
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            Hủy
          </DialogClose>
          <Button onClick={onSubmit} disabled={isPending}>
            {isPending ? "Đang lưu..." : editingId ? "Cập nhật" : "Tạo form schema"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
