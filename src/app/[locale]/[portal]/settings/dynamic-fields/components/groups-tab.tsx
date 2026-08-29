"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  MoveHorizontal,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GroupFormDialog } from "./group-form-dialog";
import { AssignDefinitionDialog } from "./assign-definition-dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  useGetApiFieldGroups,
  useGetApiFieldDefinitions,
  usePostApiFieldGroup,
  usePatchApiFieldGroup,
  useDeleteApiFieldGroup,
  patchApiFieldDefinition,
} from "@/lib/api/endpoints/dynamic-fields";
import { useGetApiPropertyTypes } from "@/lib/api/endpoints/properties";
import type { CreateFieldGroupDto, UpdateFieldGroupDto } from "@/lib/api/models";
import type { GetApiFieldGroupsEntityType } from "@/lib/api/models/getApiFieldGroupsEntityType";

const entityTypeLabels: Record<string, string> = {
  PROPERTY: "Bất động sản",
  CUSTOMER_NEED: "Nhu cầu khách hàng",
  LEAD: "Nguồn khách hàng",
  DEAL: "Giao dịch",
  OWNER_PROFILE: "Hồ sơ chủ nhà",
};

interface FieldGroup {
  id: string;
  name: string;
  code: string;
  entityType: GetApiFieldGroupsEntityType;
  propertyType?: { id: string; name: string; code: string } | null;
  sortOrder?: number;
  status?: string;
  definitions?: FieldDefinition[];
}

type PropertyType = {
  id: string;
  name: string;
  code: string;
};

interface FieldDefinition {
  id: string;
  fieldKey: string;
  fieldLabel: string;
  fieldType: string;
  entityType: string;
  group?: { id: string; name: string } | null;
  propertyType?: { id: string; name: string; code: string } | null;
  isRequired?: boolean;
  status?: string;
}

const entityTypeOptions: { value: string; label: string }[] = [
  { value: "PROPERTY", label: "Bất động sản" },
  { value: "CUSTOMER_NEED", label: "Nhu cầu khách hàng" },
  { value: "LEAD", label: "Nguồn khách hàng" },
  { value: "DEAL", label: "Giao dịch" },
  { value: "OWNER_PROFILE", label: "Hồ sơ chủ nhà" },
];

interface GroupsTabProps {
  canCreate?: boolean;
  canUpdate?: boolean;
  canDelete?: boolean;
}

export function GroupsTab({ canCreate = true, canUpdate = true, canDelete = true }: GroupsTabProps) {
  const [entityType, setEntityType] = useState<string>("");
  const [propertyTypeId, setPropertyTypeId] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [assignTargetGroup, setAssignTargetGroup] = useState<FieldGroup | null>(null);
  const [selectedDefIds, setSelectedDefIds] = useState<string[]>([]);
  const [form, setForm] = useState({
    name: "",
    code: "",
    entityType: "PROPERTY",
    propertyTypeId: "",
    sortOrder: 0,
  });

  const { data: propertyTypesData } = useGetApiPropertyTypes();
  const propertyTypes = ((propertyTypesData as any)?.data as PropertyType[]) || [];

  const { data, isLoading, refetch } = useGetApiFieldGroups(
    entityType ? { entityType: entityType as GetApiFieldGroupsEntityType, ...(propertyTypeId ? { propertyTypeId } : {}) } : undefined,
  );
  const groups = ((data as any)?.data as FieldGroup[]) || [];

  const { data: defsData, refetch: refetchDefs } = useGetApiFieldDefinitions(
    entityType ? { entityType: entityType as GetApiFieldGroupsEntityType, ...(propertyTypeId ? { propertyTypeId } : {}) } : undefined,
  );
  const allDefinitions = ((defsData as any)?.data as FieldDefinition[]) || [];
  const unassignedDefinitions = allDefinitions.filter((d) => !d.group?.id);

  const { mutateAsync: assignDefinition, isPending: isAssigning } = useMutation({
    mutationFn: (vars: { id: string; groupId: string }) =>
      patchApiFieldDefinition(vars.id, { groupId: vars.groupId } as any),
    onSuccess: () => {
      toast.success("Gán trường vào nhóm thành công");
      refetch();
      refetchDefs();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error?.message?.[0] || "Có lỗi xảy ra khi gán trường");
    },
  });

  const { mutateAsync: unassignDefinition } = useMutation({
    mutationFn: (vars: { id: string }) =>
      patchApiFieldDefinition(vars.id, { groupId: "null" } as any),
    onSuccess: () => {
      toast.success("Gỡ trường khỏi nhóm thành công");
      refetch();
      refetchDefs();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error?.message?.[0] || "Có lỗi xảy ra khi gỡ trường");
    },
  });

  const { mutateAsync: createGroup, isPending: isCreating } = usePostApiFieldGroup({
    mutation: {
      onSuccess: () => {
        toast.success("Tạo nhóm trường thành công");
        closeDialog();
        refetch();
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.error?.message?.[0] || "Có lỗi xảy ra khi tạo nhóm trường");
      },
    },
  });

  const { mutateAsync: updateGroup, isPending: isUpdating } = usePatchApiFieldGroup({
    mutation: {
      onSuccess: () => {
        toast.success("Cập nhật nhóm trường thành công");
        closeDialog();
        refetch();
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.error?.message?.[0] || "Có lỗi xảy ra khi cập nhật nhóm trường");
      },
    },
  });

  const { mutateAsync: deleteGroup } = useDeleteApiFieldGroup({
    mutation: {
      onSuccess: () => {
        toast.success("Xóa nhóm trường thành công");
        refetch();
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.error?.message?.[0] || "Có lỗi xảy ra khi xóa nhóm trường");
      },
    },
  });

  const isPending = isCreating || isUpdating;

  const openCreateDialog = () => {
    setEditingId(null);
    setForm({ name: "", code: "", entityType: entityType || "PROPERTY", propertyTypeId: propertyTypeId || "", sortOrder: 0 });
    setDialogOpen(true);
  };

  const openEditDialog = (group: FieldGroup) => {
    setEditingId(group.id);
    setForm({
      name: group.name,
      code: group.code,
      entityType: group.entityType,
      propertyTypeId: group.propertyType?.id || "",
      sortOrder: group.sortOrder || 0,
    });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingId(null);
    setForm({ name: "", code: "", entityType: entityType || "PROPERTY", propertyTypeId: "", sortOrder: 0 });
  };

  const handleDelete = (group: FieldGroup) => {
    if (!confirm(`Xóa nhóm "${group.name}"?`)) return;
    deleteGroup({ id: group.id });
  };

  const openAssignDialog = (group: FieldGroup) => {
    setAssignTargetGroup(group);
    setSelectedDefIds([]);
    setAssignDialogOpen(true);
  };

  const closeAssignDialog = () => {
    setAssignDialogOpen(false);
    setAssignTargetGroup(null);
    setSelectedDefIds([]);
  };

  const handleToggleDef = (id: string) => {
    setSelectedDefIds((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id],
    );
  };

  const handleAssignSubmit = async () => {
    if (!assignTargetGroup || selectedDefIds.length === 0) {
      toast.error("Chọn ít nhất một trường để gán");
      return;
    }
    for (const defId of selectedDefIds) {
      await assignDefinition({ id: defId, groupId: assignTargetGroup.id });
    }
    closeAssignDialog();
  };

  const handleUnassign = async (defId: string) => {
    await unassignDefinition({ id: defId });
  };

  const handleSubmit = () => {
    if (!form.name || !form.code) {
      toast.error("Vui lòng nhập tên và mã nhóm");
      return;
    }
    if (editingId) {
      const dto: UpdateFieldGroupDto = {
        name: form.name,
        code: form.code,
        propertyTypeId: form.propertyTypeId || "null",
        sortOrder: form.sortOrder,
      };
      updateGroup({ id: editingId, data: dto });
    } else {
      const dto: CreateFieldGroupDto = {
        name: form.name,
        code: form.code,
        entityType: form.entityType as any,
        propertyTypeId: form.propertyTypeId || "null",
        sortOrder: form.sortOrder,
      };
      createGroup({ data: dto });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-foreground-muted">
          <span className="font-medium text-foreground">{groups.length}</span> nhóm trường
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
              Thêm nhóm
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-lg bg-surface-muted" />
          ))}
        </div>
      ) : groups.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border py-12 text-center">
          <p className="text-sm text-foreground-muted">Chưa có nhóm trường nào</p>
          {canCreate && (
            <Button variant="outline" size="sm" onClick={openCreateDialog}>
              <Plus size={16} />
              Tạo nhóm đầu tiên
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <Card key={group.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base truncate">{group.name}</CardTitle>
                  <div className="flex gap-1 shrink-0">
                    {canUpdate && (
                      <Button variant="ghost" size="icon-sm" onClick={() => openAssignDialog(group)} title="Gán trường vào nhóm">
                        <MoveHorizontal size={14} />
                      </Button>
                    )}
                    {canUpdate && (
                      <Button variant="ghost" size="icon-sm" onClick={() => openEditDialog(group)}>
                        <Pencil size={14} />
                      </Button>
                    )}
                    {canDelete && (
                      <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(group)}>
                        <Trash2 size={14} />
                      </Button>
                    )}
                  </div>
                </div>
                <div className="mt-1 flex flex-wrap gap-1">
                  <Badge variant="default">
                    <code className="font-mono">{group.code}</code>
                  </Badge>
                  <Badge variant="blue">{entityTypeLabels[group.entityType] || group.entityType}</Badge>
                  {group.entityType === "PROPERTY" && (
                    <Badge variant="default">
                      {propertyTypes.find((p) => p.id === group.propertyType?.id)?.name || "Tất cả loại BĐS"}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  {group.definitions && group.definitions.length > 0 ? (
                    <div className="flex flex-col gap-1">
                      {group.definitions.map((def) => (
                        <div key={def.id} className="flex items-center justify-between rounded-md border border-border px-2 py-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{def.fieldLabel}</span>
                            <code className="rounded bg-surface-muted px-1 py-0.5 font-mono text-xs">{def.fieldKey}</code>
                            {def.isRequired && <Badge variant="red">Bắt buộc</Badge>}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => handleUnassign(def.id)}
                            title="Gỡ khỏi nhóm"
                          >
                            <X size={12} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-sm text-foreground-muted">Chưa có trường nào trong nhóm</span>
                  )}
                  <Button variant="outline" size="sm" className="mt-1" onClick={() => openAssignDialog(group)}>
                    <Plus size={14} />
                    Gán trường vào nhóm
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <GroupFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editingId={editingId}
        form={form}
        setForm={setForm}
        propertyTypes={propertyTypes}
        isPending={isPending}
        onSubmit={handleSubmit}
        onClose={closeDialog}
      />

      <AssignDefinitionDialog
        open={assignDialogOpen}
        onOpenChange={setAssignDialogOpen}
        assignTargetGroup={assignTargetGroup}
        unassignedDefinitions={unassignedDefinitions}
        selectedDefIds={selectedDefIds}
        onToggleDef={handleToggleDef}
        onSubmit={handleAssignSubmit}
        isAssigning={isAssigning}
      />
    </div>
  );
}
