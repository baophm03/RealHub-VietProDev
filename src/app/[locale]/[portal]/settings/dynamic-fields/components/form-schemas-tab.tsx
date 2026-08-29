"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { useGetApiPropertyTypes } from "@/lib/api/endpoints/properties";
import type { CreateFormSchemaDto, UpdateFormSchemaDto, FormSchemaFieldDto } from "@/lib/api/models";
import type { GetApiFormSchemasEntityType } from "@/lib/api/models/getApiFormSchemasEntityType";
import { FormSchemaDialog } from "./form-schema-dialog";

const entityTypeLabels: Record<string, string> = {
  PROPERTY: "Bất động sản",
  CUSTOMER_NEED: "Nhu cầu khách hàng",
  LEAD: "Nguồn khách hàng",
  DEAL: "Giao dịch",
};

interface FormSchema {
  id: string;
  name: string;
  entityType: string;
  propertyType?: { id: string; name: string; code: string } | null;
  status?: string;
  version?: number;
  fields?: {
    id: string;
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

type PropertyType = {
  id: string;
  name: string;
  code: string;
};

const entityTypeOptions: { value: string; label: string }[] = [
  { value: "PROPERTY", label: "Bất động sản" },
  { value: "CUSTOMER_NEED", label: "Nhu cầu khách hàng" },
  { value: "LEAD", label: "Nguồn khách hàng" },
  { value: "DEAL", label: "Giao dịch" },
  { value: "OWNER_PROFILE", label: "Hồ sơ chủ nhà" },
];

interface FormSchemasTabProps {
  canCreate?: boolean;
  canUpdate?: boolean;
  canDelete?: boolean;
}

export function FormSchemasTab({ canCreate = true, canUpdate = true, canDelete = true }: FormSchemasTabProps) {
  const [entityType, setEntityType] = useState<string>("");
  const [propertyTypeId, setPropertyTypeId] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    entityType: "PROPERTY" as GetApiFormSchemasEntityType,
    propertyTypeId: "",
  });
  const [selectedFields, setSelectedFields] = useState<FormSchemaFieldDto[]>([]);

  const { data: propertyTypesData } = useGetApiPropertyTypes();
  const propertyTypes = ((propertyTypesData as any)?.data as PropertyType[]) || [];

  const { data, isLoading, refetch } = useGetApiFormSchemas(
    entityType ? { entityType: entityType as GetApiFormSchemasEntityType, ...(propertyTypeId ? { propertyTypeId } : {}) } : undefined,
  );
  const schemas = ((data as any)?.data as FormSchema[]) || [];

  const { data: definitionsData } = useGetApiFieldDefinitions(
    form.entityType
      ? {
        entityType: form.entityType as GetApiFormSchemasEntityType,
        ...(form.propertyTypeId ? { propertyTypeId: form.propertyTypeId } : {}),
      }
      : undefined,
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
        toast.error(err?.response?.data?.error?.message?.[0] || "Có lỗi xảy ra khi tạo form schema");
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
        toast.error(err?.response?.data?.error?.message?.[0] || "Có lỗi xảy ra khi cập nhật form schema");
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
        toast.error(err?.response?.data?.error?.message?.[0] || "Có lỗi xảy ra khi xóa form schema");
      },
    },
  });

  const isPending = isCreating || isUpdating;

  const openCreateDialog = () => {
    setEditingId(null);
    setForm({ name: "", entityType: (entityType || "PROPERTY") as GetApiFormSchemasEntityType, propertyTypeId: propertyTypeId || "" });
    setSelectedFields([]);
    setDialogOpen(true);
  };

  const openEditDialog = (schema: FormSchema) => {
    setEditingId(schema.id);
    setForm({ name: schema.name, entityType: schema.entityType as GetApiFormSchemasEntityType, propertyTypeId: schema.propertyType?.id || "" });
    setSelectedFields(
      (schema.fields || []).map((f) => ({
        fieldId: f.field?.id,
        groupId: f.group?.id,
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
    setForm({ name: "", entityType: (entityType || "PROPERTY") as GetApiFormSchemasEntityType, propertyTypeId: "" });
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
        propertyTypeId: form.propertyTypeId || "null",
        fields: selectedFields,
      };
      updateSchema({ id: editingId, data: dto });
    } else {
      const dto: CreateFormSchemaDto = {
        name: form.name,
        entityType: form.entityType,
        propertyTypeId: form.propertyTypeId || "null",
        fields: selectedFields.length > 0 ? selectedFields : undefined,
      };
      createSchema({ data: dto });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-foreground-muted">
          <span className="font-medium text-foreground">{schemas.length}</span> nhóm đối tượng
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
              Thêm nhóm đối tượng
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg bg-surface-muted" />
          ))}
        </div>
      ) : schemas.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border py-12 text-center">
          <p className="text-sm text-foreground-muted">Chưa có nhóm đối tượng nào</p>
          {canCreate && (
            <Button variant="outline" size="sm" onClick={openCreateDialog}>
              <Plus size={16} />
              Tạo nhóm đối tượng đầu tiên
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {schemas.map((schema) => (
            <Card key={schema.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base truncate">{schema.name}</CardTitle>
                  <div className="flex gap-1 shrink-0">
                    {canUpdate && (
                      <Button variant="ghost" size="icon-sm" onClick={() => openEditDialog(schema)}>
                        <Pencil size={14} />
                      </Button>
                    )}
                    {canDelete && (
                      <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(schema)}>
                        <Trash2 size={14} />
                      </Button>
                    )}
                  </div>
                </div>
                <div className="mt-1 flex flex-wrap gap-1">
                  <Badge variant="blue">{entityTypeLabels[schema.entityType] || schema.entityType}</Badge>
                  {schema.entityType === "PROPERTY" && (
                    <Badge variant="default">
                      {propertyTypes.find((p) => p.id === schema.propertyType?.id)?.name || "Tất cả loại BĐS"}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1">
                  {schema.fields && schema.fields.length > 0 ? (
                    <>
                      {schema.fields.slice(0, 5).map((f) => (
                        <Badge key={f.id} variant="default">
                          {f.field?.fieldLabel || f.field?.id}
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

      <FormSchemaDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editingId={editingId}
        form={form}
        setForm={setForm}
        propertyTypes={propertyTypes}
        definitions={definitions}
        selectedFields={selectedFields}
        setSelectedFields={setSelectedFields}
        isPending={isPending}
        onSubmit={handleSubmit}
        onClose={closeDialog}
      />
    </div>
  );
}
