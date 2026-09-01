"use client";

import { useState, useEffect } from "react";
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
import type { FieldOptionDto } from "@/lib/api/models";
import type { GetApiFieldDefinitionsEntityType } from "@/lib/api/models/getApiFieldDefinitionsEntityType";
import type { CreateFieldDefinitionDtoFieldType } from "@/lib/api/models/createFieldDefinitionDtoFieldType";
import { entityTypeOptions, getEntityTypeLabel } from "./entity-type.constants";

const fieldTypeLabels: Record<string, string> = {
  TEXT: "Text ngắn",
  TEXTAREA: "Text dài",
  NUMBER: "Số",
  MONEY: "Tiền tệ",
  BOOLEAN: "Đúng/Sai",
  DATE: "Ngày",
  DATETIME: "Ngày + giờ",
  SELECT: "Chọn 1",
  MULTI_SELECT: "Chọn nhiều",
  RADIO: "Radio",
  CHECKBOX: "Checkbox",
  FILE: "File",
  IMAGE: "Hình ảnh",
  LOCATION: "Vị trí",
  JSON: "JSON",
};

const fieldTypesWithOptions = ["SELECT", "MULTI_SELECT", "RADIO", "CHECKBOX"];

interface FieldDefinition {
  id: string;
  fieldKey: string;
  fieldLabel: string;
  fieldType: string;
  entityType: string;
  isRequired?: boolean;
  isFilterable?: boolean;
  isPublic?: boolean;
  isSensitive?: boolean;
  defaultValue?: string | null;
  sortOrder?: number;
  options?: { id: string; label: string; value: string; sortOrder?: number }[];
}

interface PropertyType {
  id: string;
  name: string;
  code: string;
}

interface FieldDefinitionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingDef?: FieldDefinition | null;
  entityType?: GetApiFieldDefinitionsEntityType;
  propertyTypes: PropertyType[];
  isPending?: boolean;
  onSubmit: (data: {
    editingId: string | null;
    form: {
      fieldKey: string;
      fieldLabel: string;
      fieldType: string;
      entityType: string;
      isRequired: boolean;
      isFilterable: boolean;
      isPublic: boolean;
      isSensitive: boolean;
      defaultValue: string;
      sortOrder: number;
    };
    options: FieldOptionDto[];
  }) => void;
}

const emptyForm = {
  fieldKey: "",
  fieldLabel: "",
  fieldType: "TEXT",
  entityType: "PROPERTY" as string,
  isRequired: false,
  isFilterable: false,
  isPublic: true,
  isSensitive: false,
  defaultValue: "",
  sortOrder: 0,
};

export function FieldDefinitionDialog({
  open,
  onOpenChange,
  editingDef,
  entityType,
  propertyTypes,
  isPending,
  onSubmit,
}: FieldDefinitionDialogProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyForm, entityType: entityType || "PROPERTY" });
  const [options, setOptions] = useState<FieldOptionDto[]>([]);
  const [newOption, setNewOption] = useState({ label: "", value: "" });

  useEffect(() => {
    if (!open) return;
    if (editingDef) {
      setEditingId(editingDef.id);
      setForm({
        fieldKey: editingDef.fieldKey,
        fieldLabel: editingDef.fieldLabel,
        fieldType: editingDef.fieldType,
        entityType: editingDef.entityType as GetApiFieldDefinitionsEntityType,
        isRequired: editingDef.isRequired || false,
        isFilterable: editingDef.isFilterable || false,
        isPublic: editingDef.isPublic ?? true,
        isSensitive: editingDef.isSensitive || false,
        defaultValue: editingDef.defaultValue || "",
        sortOrder: editingDef.sortOrder || 0,
      });
      setOptions(
        (editingDef.options || []).map((o) => ({
          label: o.label,
          value: o.value,
          sortOrder: o.sortOrder,
        })),
      );
    } else {
      setEditingId(null);
      setForm({
        ...emptyForm,
        entityType: entityType || "PROPERTY",
      });
      setOptions([]);
    }
    setNewOption({ label: "", value: "" });
  }, [open, editingDef, entityType]);

  const handleAddOption = () => {
    if (!newOption.label || !newOption.value) return;
    setOptions([...options, { ...newOption, sortOrder: options.length }]);
    setNewOption({ label: "", value: "" });
  };

  const handleRemoveOption = (idx: number) => {
    setOptions(options.filter((_, i) => i !== idx));
  };

  const handleSubmit = () => {
    onSubmit({ editingId, form, options });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{editingId ? "Chỉnh sửa loại dữ liệu" : "Tạo loại dữ liệu"}</DialogTitle>
          <DialogDescription>{editingId ? "Cập nhật thông tin loại dữ liệu" : "Định nghĩa một loại dữ liệu mới cho đối tượng"}</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Cột trái: Thông tin field */}
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Tên trường" required>
                <Input
                  placeholder="VD: Số tầng"
                  value={form.fieldLabel}
                  onChange={(e) => setForm({ ...form, fieldLabel: e.target.value })}
                />
              </FormField>
              <FormField label="Mã định dạng" required>
                <Input
                  placeholder="VD: bedroom_count"
                  value={form.fieldKey}
                  onChange={(e) => setForm({ ...form, fieldKey: e.target.value })}
                  disabled={!!editingId}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Loại" required>
                <Select
                  value={form.fieldType}
                  onValueChange={(v) => setForm({ ...form, fieldType: v as CreateFieldDefinitionDtoFieldType })}
                  disabled={!!editingId}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn loại">
                      {(value: string) => fieldTypeLabels[value] || value}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(fieldTypeLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value} label={label}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Đối tượng" required>
                <Select
                  value={form.entityType}
                  onValueChange={(v) => setForm({ ...form, entityType: v as GetApiFieldDefinitionsEntityType })}
                  disabled={!!editingId}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn đối tượng">
                      {(value: string) => getEntityTypeLabel(value)}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {entityTypeOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value} label={opt.label}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
            </div>

            <FormField label="Giá trị mặc định">
              <Input
                placeholder="VD: 1"
                value={form.defaultValue}
                onChange={(e) => setForm({ ...form, defaultValue: e.target.value })}
              />
            </FormField>

            <FormField label="Thứ tự hiển thị">
              <Input
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
              />
            </FormField>

            {fieldTypesWithOptions.includes(form.fieldType) && (
              <FormField label="Options" helper="Thêm các lựa chọn cho trường dạng select/radio/checkbox">
                <div className="flex flex-col gap-2">
                  {options.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Input
                        className="flex-1"
                        value={opt.label}
                        onChange={(e) => {
                          const next = [...options];
                          next[idx] = { ...next[idx], label: e.target.value };
                          setOptions(next);
                        }}
                        placeholder="Label"
                      />
                      <Input
                        className="flex-1"
                        value={opt.value}
                        onChange={(e) => {
                          const next = [...options];
                          next[idx] = { ...next[idx], value: e.target.value };
                          setOptions(next);
                        }}
                        placeholder="Value"
                      />
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleRemoveOption(idx)}
                      >
                        <X size={14} />
                      </Button>
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    <Input
                      className="flex-1"
                      value={newOption.label}
                      onChange={(e) => setNewOption({ ...newOption, label: e.target.value })}
                      placeholder="Label"
                    />
                    <Input
                      className="flex-1"
                      value={newOption.value}
                      onChange={(e) => setNewOption({ ...newOption, value: e.target.value })}
                      placeholder="Value"
                    />
                    <Button variant="outline" size="sm" onClick={handleAddOption}>
                      <Plus size={14} />
                      Thêm
                    </Button>
                  </div>
                </div>
              </FormField>
            )}
          </div>

          {/* Cột phải: Flags + description */}
          <div className="flex flex-col gap-3">
            <div className="text-sm font-semibold text-foreground">Cờ dữ liệu</div>

            <div className="flex items-center justify-between gap-3 rounded-lg border border-border p-3">
              <div className="flex flex-col gap-0.5 border-r pr-2">
                <span className="text-sm font-medium">Bắt buộc</span>
                <p className="text-xs text-foreground-muted">
                  Trường phải có giá trị khi tạo/sửa. Form sẽ báo lỗi nếu bỏ trống.
                </p>
              </div>
              <Switch
                checked={form.isRequired}
                onCheckedChange={(v) => setForm({ ...form, isRequired: v })}
              />
            </div>

            <div className="flex items-center justify-between gap-3 rounded-lg border border-border p-3">
              <div className="flex flex-col gap-0.5 border-r pr-2">
                <span className="text-sm font-medium">Lọc được</span>
                <p className="text-xs text-foreground-muted">
                  Cho phép hiển thị trong danh sách bộ lọc để người dùng lọc theo giá trị.
                </p>
              </div>
              <Switch
                checked={form.isFilterable}
                onCheckedChange={(v) => setForm({ ...form, isFilterable: v })}
              />
            </div>

            <div className="flex items-center justify-between gap-3 rounded-lg border border-border p-3">
              <div className="flex flex-col gap-0.5 border-r pr-2">
                <span className="text-sm font-medium">Công khai</span>
                <p className="text-xs text-foreground-muted">
                  Hiện giá trị công khai cho toàn người dùng trên sàn.
                </p>
              </div>
              <Switch
                checked={form.isPublic}
                onCheckedChange={(v) => setForm({ ...form, isPublic: v })}
              />
            </div>

            <div className="flex items-center justify-between gap-3 rounded-lg border border-border p-3">
              <div className="flex flex-col gap-0.5 border-r pr-2">
                <span className="text-sm font-medium">Nhạy cảm</span>
                <p className="text-xs text-foreground-muted">
                  Ẩn giá trị theo quyền. VD: giá nội bộ, thông tin chủ nhà.
                </p>
              </div>
              <Switch
                checked={form.isSensitive}
                onCheckedChange={(v) => setForm({ ...form, isSensitive: v })}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            Hủy
          </DialogClose>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? "Đang lưu..." : editingId ? "Cập nhật" : "Tạo loại dữ liệu"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
