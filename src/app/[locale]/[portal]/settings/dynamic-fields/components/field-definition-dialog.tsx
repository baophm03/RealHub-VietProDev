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

const entityTypeLabels: Record<string, string> = {
  PROPERTY: "Bất động sản",
  CUSTOMER_NEED: "Nhu cầu khách hàng",
  LEAD: "Nguồn khách hàng",
  DEAL: "Giao dịch",
  OWNER_PROFILE: "Hồ sơ chủ nhà",
};

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
  group?: { id: string; name: string } | null;
  propertyType?: { id: string; name: string; code: string } | null;
  isRequired?: boolean;
  isSearchable?: boolean;
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

interface FieldGroup {
  id: string;
  name: string;
  code: string;
  entityType: string;
}

interface FieldDefinitionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingDef?: FieldDefinition | null;
  entityType?: GetApiFieldDefinitionsEntityType;
  propertyTypeId?: string;
  propertyTypes: PropertyType[];
  availableGroups: FieldGroup[];
  isPending?: boolean;
  onSubmit: (data: {
    editingId: string | null;
    form: {
      fieldKey: string;
      fieldLabel: string;
      fieldType: string;
      entityType: string;
      propertyTypeId: string;
      groupId: string;
      isRequired: boolean;
      isSearchable: boolean;
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
  propertyTypeId: "",
  groupId: "",
  isRequired: false,
  isSearchable: false,
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
  propertyTypeId,
  propertyTypes,
  availableGroups,
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
        propertyTypeId: editingDef.propertyType?.id || "",
        groupId: editingDef.group?.id || "",
        isRequired: editingDef.isRequired || false,
        isSearchable: editingDef.isSearchable || false,
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
        propertyTypeId: propertyTypeId || "",
      });
      setOptions([]);
    }
    setNewOption({ label: "", value: "" });
  }, [open, editingDef, entityType, propertyTypeId]);

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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{editingId ? "Chỉnh sửa định nghĩa trường" : "Tạo định nghĩa trường"}</DialogTitle>
          <DialogDescription>{editingId ? "Cập nhật thông tin trường dữ liệu" : "Định nghĩa một trường dữ liệu mới cho đối tượng"}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Tên hiển thị" required>
              <Input
                placeholder="VD: Số tầng"
                value={form.fieldLabel}
                onChange={(e) => setForm({ ...form, fieldLabel: e.target.value })}
              />
            </FormField>
            <FormField label="Field key" required>
              <Input
                placeholder="VD: bedroom_count"
                value={form.fieldKey}
                onChange={(e) => setForm({ ...form, fieldKey: e.target.value })}
                disabled={!!editingId}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Loại trường" required>
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
          </div>

          {form.entityType === "PROPERTY" && (
            <FormField label="Loại bất động sản" helper="Để trống nếu áp dụng cho tất cả loại BĐS">
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

          <FormField label="Nhóm trường" helper="Chọn nhóm mà trường này thuộc về">
            <Select
              value={form.groupId || "__none__"}
              onValueChange={(v) => setForm({ ...form, groupId: !v || v === "__none__" ? "" : v })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Không chọn nhóm">
                  {(value: string) =>
                    value === "__none__"
                      ? "Không chọn nhóm"
                      : availableGroups.find((g) => g.id === value)?.name || "Không chọn nhóm"
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__" label="-- Không chọn nhóm --">-- Không chọn nhóm --</SelectItem>
                {availableGroups.map((g) => (
                  <SelectItem key={g.id} value={g.id} label={g.name}>{g.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

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

          <div className="grid grid-cols-2 gap-3 rounded-lg border border-border p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Bắt buộc</span>
              <Switch
                checked={form.isRequired}
                onCheckedChange={(v) => setForm({ ...form, isRequired: v })}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Tìm kiếm được</span>
              <Switch
                checked={form.isSearchable}
                onCheckedChange={(v) => setForm({ ...form, isSearchable: v })}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Lọc được</span>
              <Switch
                checked={form.isFilterable}
                onCheckedChange={(v) => setForm({ ...form, isFilterable: v })}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Public</span>
              <Switch
                checked={form.isPublic}
                onCheckedChange={(v) => setForm({ ...form, isPublic: v })}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Nhạy cảm</span>
              <Switch
                checked={form.isSensitive}
                onCheckedChange={(v) => setForm({ ...form, isSensitive: v })}
              />
            </div>
          </div>

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
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            Hủy
          </DialogClose>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? "Đang lưu..." : editingId ? "Cập nhật" : "Tạo trường"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
