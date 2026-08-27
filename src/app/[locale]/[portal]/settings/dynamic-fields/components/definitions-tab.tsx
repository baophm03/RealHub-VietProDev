"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  useGetApiFieldDefinitions,
  useGetApiFieldGroups,
  usePostApiFieldDefinition,
  useDeleteApiFieldDefinition,
  patchApiFieldDefinition,
} from "@/lib/api/endpoints/dynamic-fields";
import { useGetApiPropertyTypes } from "@/lib/api/endpoints/properties";
import type { CreateFieldDefinitionDto, FieldOptionDto, UpdateFieldDefinitionDto } from "@/lib/api/models";
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
  status?: string;
  options?: { id: string; label: string; value: string; sortOrder?: number }[];
}

type PropertyType = {
  id: string;
  name: string;
  code: string;
};

interface FieldGroup {
  id: string;
  name: string;
  code: string;
  entityType: string;
}

interface DefinitionsTabProps {
  entityType?: GetApiFieldDefinitionsEntityType;
  propertyTypeId?: string;
  canCreate?: boolean;
  canUpdate?: boolean;
  canDelete?: boolean;
}

export function DefinitionsTab({ entityType, propertyTypeId, canCreate = true, canUpdate = true, canDelete = true }: DefinitionsTabProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    fieldKey: "",
    fieldLabel: "",
    fieldType: "TEXT",
    entityType: entityType || "PROPERTY",
    propertyTypeId: "",
    groupId: "",
    isRequired: false,
    isSearchable: false,
    isFilterable: false,
    isPublic: true,
    isSensitive: false,
    defaultValue: "",
    sortOrder: 0,
  });
  const [options, setOptions] = useState<FieldOptionDto[]>([]);
  const [newOption, setNewOption] = useState({ label: "", value: "" });

  const { data, isLoading, refetch } = useGetApiFieldDefinitions(
    entityType ? { entityType, ...(propertyTypeId ? { propertyTypeId } : {}) } : undefined,
  );
  const definitions = ((data as any)?.data as FieldDefinition[]) || [];

  const { data: propertyTypesData } = useGetApiPropertyTypes();
  const propertyTypes = ((propertyTypesData as any)?.data as PropertyType[]) || [];

  const { data: groupsData } = useGetApiFieldGroups(
    (form.entityType || entityType) ? { entityType: (form.entityType || entityType) as GetApiFieldDefinitionsEntityType } : undefined,
  );
  const availableGroups = ((groupsData as any)?.data as FieldGroup[]) || [];

  const { mutateAsync: createDefinition, isPending: isCreating } = usePostApiFieldDefinition({
    mutation: {
      onSuccess: () => {
        toast.success("Tạo định nghĩa trường thành công");
        closeDialog();
        refetch();
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.error?.message?.[0] || "Có lỗi xảy ra khi tạo định nghĩa trường");
      },
    },
  });

  const { mutateAsync: updateDefinition, isPending: isUpdating } = useMutation({
    mutationFn: (vars: { id: string; data: UpdateFieldDefinitionDto }) =>
      patchApiFieldDefinition(vars.id, vars.data),
    onSuccess: () => {
      toast.success("Cập nhật định nghĩa trường thành công");
      closeDialog();
      refetch();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error?.message?.[0] || "Có lỗi xảy ra khi cập nhật định nghĩa trường");
    },
  });

  const { mutateAsync: deleteDefinition } = useDeleteApiFieldDefinition({
    mutation: {
      onSuccess: () => {
        toast.success("Xóa định nghĩa trường thành công");
        refetch();
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.error?.message?.[0] || "Có lỗi xảy ra khi xóa định nghĩa trường");
      },
    },
  });

  const isPending = isCreating || isUpdating;

  const openCreateDialog = () => {
    setEditingId(null);
    setForm({
      fieldKey: "",
      fieldLabel: "",
      fieldType: "TEXT",
      entityType: entityType || "PROPERTY",
      propertyTypeId: propertyTypeId || "",
      groupId: "",
      isRequired: false,
      isSearchable: false,
      isFilterable: false,
      isPublic: true,
      isSensitive: false,
      defaultValue: "",
      sortOrder: 0,
    });
    setOptions([]);
    setNewOption({ label: "", value: "" });
    setDialogOpen(true);
  };

  const openEditDialog = (def: FieldDefinition) => {
    setEditingId(def.id);
    setForm({
      fieldKey: def.fieldKey,
      fieldLabel: def.fieldLabel,
      fieldType: def.fieldType,
      entityType: def.entityType as GetApiFieldDefinitionsEntityType,
      propertyTypeId: def.propertyType?.id || "",
      groupId: def.group?.id || "",
      isRequired: def.isRequired || false,
      isSearchable: def.isSearchable || false,
      isFilterable: def.isFilterable || false,
      isPublic: def.isPublic ?? true,
      isSensitive: def.isSensitive || false,
      defaultValue: def.defaultValue || "",
      sortOrder: def.sortOrder || 0,
    });
    setOptions(
      (def.options || []).map((o) => ({
        label: o.label,
        value: o.value,
        sortOrder: o.sortOrder,
      })),
    );
    setNewOption({ label: "", value: "" });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingId(null);
    setForm({
      fieldKey: "",
      fieldLabel: "",
      fieldType: "TEXT",
      entityType: entityType || "PROPERTY",
      propertyTypeId: "",
      groupId: "",
      isRequired: false,
      isSearchable: false,
      isFilterable: false,
      isPublic: true,
      isSensitive: false,
      defaultValue: "",
      sortOrder: 0,
    });
    setOptions([]);
    setNewOption({ label: "", value: "" });
  };

  const handleAddOption = () => {
    if (!newOption.label || !newOption.value) {
      toast.error("Nhập cả label và value cho option");
      return;
    }
    setOptions([...options, { ...newOption, sortOrder: options.length }]);
    setNewOption({ label: "", value: "" });
  };

  const handleRemoveOption = (idx: number) => {
    setOptions(options.filter((_, i) => i !== idx));
  };

  const handleSubmit = () => {
    if (!form.fieldKey || !form.fieldLabel) {
      toast.error("Vui lòng nhập field key và field label");
      return;
    }
    if (editingId) {
      const updateDto: UpdateFieldDefinitionDto = {
        propertyTypeId: form.propertyTypeId || "null",
        groupId: form.groupId || "null",
        fieldLabel: form.fieldLabel,
        isRequired: form.isRequired,
        isSearchable: form.isSearchable,
        isFilterable: form.isFilterable,
        isPublic: form.isPublic,
        isSensitive: form.isSensitive,
        defaultValue: form.defaultValue || undefined,
        sortOrder: form.sortOrder,
        options: fieldTypesWithOptions.includes(form.fieldType) && options.length > 0
          ? options
          : undefined,
      };
      updateDefinition({ id: editingId, data: updateDto });
    } else {
      const createDto: CreateFieldDefinitionDto = {
        fieldKey: form.fieldKey,
        fieldLabel: form.fieldLabel,
        fieldType: form.fieldType as any,
        entityType: form.entityType as any,
        propertyTypeId: form.propertyTypeId || "null",
        groupId: form.groupId || "null",
        isRequired: form.isRequired,
        isSearchable: form.isSearchable,
        isFilterable: form.isFilterable,
        isPublic: form.isPublic,
        isSensitive: form.isSensitive,
        defaultValue: form.defaultValue || undefined,
        sortOrder: form.sortOrder,
        options: fieldTypesWithOptions.includes(form.fieldType) && options.length > 0
          ? options
          : undefined,
      };
      createDefinition({ data: createDto });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-end">
        {canCreate && (
          <Button size="sm" onClick={openCreateDialog}>
            <Plus size={16} />
            Thêm trường
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 animate-pulse rounded-lg bg-surface-muted" />
          ))}
        </div>
      ) : definitions.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border py-12 text-center">
          <p className="text-sm text-foreground-muted">Chưa có định nghĩa trường nào</p>
          {canCreate && (
            <Button variant="outline" size="sm" onClick={openCreateDialog}>
              <Plus size={16} />
              Tạo trường đầu tiên
            </Button>
          )}
        </div>
      ) : (
        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên trường</TableHead>
                <TableHead>Key</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Loại BĐS</TableHead>
                <TableHead>Nhóm</TableHead>
                <TableHead>Flags</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {definitions.map((def) => (
                <TableRow key={def.id}>
                  <TableCell className="font-medium">{def.fieldLabel}</TableCell>
                  <TableCell>
                    <code className="rounded bg-surface-muted px-1.5 py-0.5 font-mono text-xs">
                      {def.fieldKey}
                    </code>
                  </TableCell>
                  <TableCell>
                    <Badge variant="blue">{fieldTypeLabels[def.fieldType] || def.fieldType}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-foreground-muted">
                    {def.entityType === "PROPERTY"
                      ? (propertyTypes.find((p) => p.id === def.propertyType?.id)?.name || "Tất cả loại BĐS")
                      : "-"}
                  </TableCell>
                  <TableCell className="text-sm text-foreground-muted">
                    {def.group?.name || "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {def.isRequired && <Badge variant="red">Bắt buộc</Badge>}
                      {def.isSearchable && <Badge variant="green">Tìm kiếm</Badge>}
                      {def.isFilterable && <Badge variant="yellow">Lọc</Badge>}
                      {def.isSensitive && <Badge variant="red">Nhạy cảm</Badge>}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {canUpdate && (
                        <Button variant="ghost" size="icon-sm" onClick={() => openEditDialog(def)}>
                          <Pencil size={14} />
                        </Button>
                      )}
                      {canDelete && (
                        <Button variant="ghost" size="icon-sm" onClick={() => {
                          if (confirm(`Xóa trường "${def.fieldLabel}"?`)) {
                            deleteDefinition({ id: def.id });
                          }
                        }}>
                          <Trash2 size={14} />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
    </div>
  );
}
