"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, PencilSimple, Trash, X } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  useGetApiFormSchemas,
  usePostApiFormSchema,
  usePatchApiFormSchema,
  useDeleteApiFormSchema,
  useGetApiFieldDefinitions,
} from "@/lib/api/endpoints/dynamic-fields";
import type { CreateFormSchemaDto, UpdateFormSchemaDto, FormSchemaFieldDto } from "@/lib/api/models";
import type { GetApiFormSchemasEntityType } from "@/lib/api/models/getApiFormSchemasEntityType";

const entityTypeLabels: Record<string, string> = {
  PROPERTY: "Bất động sản",
  CUSTOMER_NEED: "Nhu cầu khách hàng",
  LEAD: "Khách tiềm năng",
  DEAL: "Giao dịch",
};

interface FormSchema {
  id: string;
  name: string;
  entityType: string;
  propertyTypeId?: string | null;
  status?: string;
  version?: number;
  fields?: {
    id: string;
    fieldId?: string;
    groupId?: string;
    isRequired?: boolean;
    isVisible?: boolean;
    isReadonly?: boolean;
    sortOrder?: number;
    field?: { id: string; fieldLabel: string; fieldKey: string; fieldType: string };
    group?: { id: string; name: string } | null;
  }[];
}

interface FieldDefinition {
  id: string;
  fieldKey: string;
  fieldLabel: string;
  fieldType: string;
  entityType: string;
  group?: { id: string; name: string } | null;
}

interface FormSchemasTabProps {
  entityType?: GetApiFormSchemasEntityType;
}

export function FormSchemasTab({ entityType }: FormSchemasTabProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    entityType: entityType || "PROPERTY" as GetApiFormSchemasEntityType,
  });
  const [selectedFields, setSelectedFields] = useState<FormSchemaFieldDto[]>([]);

  const { data, isLoading, refetch } = useGetApiFormSchemas(
    entityType ? { entityType } : undefined,
  );
  const schemas = ((data as any)?.data as FormSchema[]) || [];

  const { data: definitionsData } = useGetApiFieldDefinitions(
    entityType ? { entityType } : undefined,
  );
  const definitions = ((definitionsData as any)?.data as FieldDefinition[]) || [];

  const { mutateAsync: createSchema, isPending: isCreating } = usePostApiFormSchema({
    mutation: {
      onSuccess: () => {
        toast.success("Tạo form schema thành công");
        closeDialog();
        refetch();
      },
      onError: (err: any) => {
        toast.error(err?.message || "Có lỗi xảy ra khi tạo form schema");
      },
    },
  });

  const { mutateAsync: updateSchema, isPending: isUpdating } = usePatchApiFormSchema({
    mutation: {
      onSuccess: () => {
        toast.success("Cập nhật form schema thành công");
        closeDialog();
        refetch();
      },
      onError: (err: any) => {
        toast.error(err?.message || "Có lỗi xảy ra khi cập nhật form schema");
      },
    },
  });

  const { mutateAsync: deleteSchema } = useDeleteApiFormSchema({
    mutation: {
      onSuccess: () => {
        toast.success("Xóa form schema thành công");
        refetch();
      },
      onError: (err: any) => {
        toast.error(err?.message || "Có lỗi xảy ra khi xóa form schema");
      },
    },
  });

  const isPending = isCreating || isUpdating;

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

  const openCreateDialog = () => {
    setEditingId(null);
    setForm({ name: "", entityType: entityType || "PROPERTY" as GetApiFormSchemasEntityType });
    setSelectedFields([]);
    setDialogOpen(true);
  };

  const openEditDialog = (schema: FormSchema) => {
    setEditingId(schema.id);
    setForm({ name: schema.name, entityType: schema.entityType as GetApiFormSchemasEntityType });
    setSelectedFields(
      (schema.fields || []).map((f) => ({
        fieldId: f.fieldId,
        groupId: f.groupId,
        isRequired: f.isRequired,
        isVisible: f.isVisible,
        isReadonly: f.isReadonly,
        sortOrder: f.sortOrder,
      })),
    );
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingId(null);
    setForm({ name: "", entityType: entityType || "PROPERTY" as GetApiFormSchemasEntityType });
    setSelectedFields([]);
  };

  const handleDelete = (schema: FormSchema) => {
    if (!confirm(`Xóa form schema "${schema.name}"?`)) return;
    deleteSchema({ id: schema.id });
  };

  const handleSubmit = () => {
    if (!form.name) {
      toast.error("Vui lòng nhập tên form schema");
      return;
    }
    if (editingId) {
      const dto: UpdateFormSchemaDto = {
        name: form.name,
        fields: selectedFields,
      };
      updateSchema({ id: editingId, data: dto });
    } else {
      const dto: CreateFormSchemaDto = {
        name: form.name,
        entityType: form.entityType,
        fields: selectedFields.length > 0 ? selectedFields : undefined,
      };
      createSchema({ data: dto });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-end">
        <Button size="sm" onClick={openCreateDialog}>
          <Plus size={16} />
          Thêm form schema
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg bg-surface-muted" />
          ))}
        </div>
      ) : schemas.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border py-12 text-center">
          <p className="text-sm text-foreground-muted">Chưa có form schema nào</p>
          <Button variant="outline" size="sm" onClick={openCreateDialog}>
            <Plus size={16} />
            Tạo form schema đầu tiên
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {schemas.map((schema) => (
            <Card key={schema.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base truncate">{schema.name}</CardTitle>
                  <div className="flex gap-1 shrink-0">
                    <Button variant="ghost" size="icon-sm" onClick={() => openEditDialog(schema)}>
                      <PencilSimple size={14} />
                    </Button>
                    <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(schema)}>
                      <Trash size={14} />
                    </Button>
                  </div>
                </div>
                <div className="mt-1">
                  <Badge variant="blue">{entityTypeLabels[schema.entityType] || schema.entityType}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1">
                  {schema.fields && schema.fields.length > 0 ? (
                    <>
                      {schema.fields.slice(0, 5).map((f) => (
                        <Badge key={f.id} variant="default">
                          {f.field?.fieldLabel || f.fieldId}
                        </Badge>
                      ))}
                      {schema.fields.length > 5 && (
                        <Badge variant="default">+{schema.fields.length - 5}</Badge>
                      )}
                    </>
                  ) : (
                    <span className="text-sm text-foreground-muted">Chưa có trường nào</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>{editingId ? "Chỉnh sửa form schema" : "Tạo form schema"}</DialogTitle>
            <DialogDescription>Ráp các định nghĩa trường thành form hoàn chỉnh</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <FormField label="Tên form schema" required>
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
                    {(value: string) => entityTypeLabels[value] || value}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(entityTypeLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

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
            <Button onClick={handleSubmit} disabled={isPending}>
              {isPending ? "Đang lưu..." : editingId ? "Cập nhật" : "Tạo form schema"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
