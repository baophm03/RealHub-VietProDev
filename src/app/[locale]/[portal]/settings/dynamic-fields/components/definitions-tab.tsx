"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
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
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { FieldDefinitionDialog } from "./field-definition-dialog";

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

const entityTypeOptions: { value: string; label: string }[] = [
  { value: "PROPERTY", label: "Bất động sản" },
  { value: "CUSTOMER_NEED", label: "Nhu cầu khách hàng" },
  { value: "LEAD", label: "Nguồn khách hàng" },
  { value: "DEAL", label: "Giao dịch" },
  { value: "OWNER_PROFILE", label: "Hồ sơ chủ nhà" },
];

interface DefinitionsTabProps {
  canCreate?: boolean;
  canUpdate?: boolean;
  canDelete?: boolean;
}

export function DefinitionsTab({ canCreate = true, canUpdate = true, canDelete = true }: DefinitionsTabProps) {
  const [entityType, setEntityType] = useState<string>("");
  const [propertyTypeId, setPropertyTypeId] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDef, setEditingDef] = useState<FieldDefinition | null>(null);

  const { data, isLoading, refetch } = useGetApiFieldDefinitions(
    entityType ? { entityType: entityType as GetApiFieldDefinitionsEntityType, ...(propertyTypeId ? { propertyTypeId } : {}) } : undefined,
  );
  const definitions = ((data as any)?.data as FieldDefinition[]) || [];

  const { data: propertyTypesData } = useGetApiPropertyTypes();
  const propertyTypes = ((propertyTypesData as any)?.data as PropertyType[]) || [];

  const { data: groupsData } = useGetApiFieldGroups(
    entityType ? { entityType: entityType as GetApiFieldDefinitionsEntityType } : undefined,
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
    setEditingDef(null);
    setDialogOpen(true);
  };

  const openEditDialog = (def: FieldDefinition) => {
    setEditingDef(def);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingDef(null);
  };

  const handleSubmit = ({
    editingId,
    form,
    options,
  }: {
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
  }) => {
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-foreground-muted">
          <span className="font-medium text-foreground">{definitions.length}</span> trường
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={entityType}
            onValueChange={(v) => {
              setEntityType(v as string);
              setPropertyTypeId("");
            }}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Tất cả">
                {(value: string) => {
                  if (!value) return "Tất cả";
                  const opt = entityTypeOptions.find((o) => o.value === value);
                  return opt?.label || value;
                }}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="" label="Tất cả">Tất cả</SelectItem>
              {entityTypeOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} label={opt.label}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {entityType === "PROPERTY" && (
            <Select
              value={propertyTypeId}
              onValueChange={(v) => setPropertyTypeId(v as string)}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Tất cả loại BĐS">
                  {(value: string) => {
                    if (!value) return "Tất cả loại BĐS";
                    const pt = propertyTypes.find((p) => p.id === value);
                    return pt?.name || value;
                  }}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="" label="Tất cả loại BĐS">Tất cả loại BĐS</SelectItem>
                {propertyTypes.map((pt) => (
                  <SelectItem key={pt.id} value={pt.id} label={pt.name}>
                    {pt.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {canCreate && (
            <Button onClick={openCreateDialog}>
              <Plus size={16} />
              Thêm trường
            </Button>
          )}
        </div>
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

      <FieldDefinitionDialog
        open={dialogOpen}
        onOpenChange={(open) => !open && closeDialog()}
        editingDef={editingDef}
        entityType={entityType as GetApiFieldDefinitionsEntityType}
        propertyTypeId={propertyTypeId}
        propertyTypes={propertyTypes}
        availableGroups={availableGroups}
        isPending={isPending}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
