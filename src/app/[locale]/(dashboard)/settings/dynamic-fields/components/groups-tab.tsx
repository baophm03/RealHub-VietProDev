"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, PencilSimple, Trash } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  useGetApiFieldGroups,
  usePostApiFieldGroup,
  usePatchApiFieldGroup,
  useDeleteApiFieldGroup,
} from "@/lib/api/endpoints/dynamic-fields";
import type { CreateFieldGroupDto, UpdateFieldGroupDto } from "@/lib/api/models";
import type { GetApiFieldGroupsEntityType } from "@/lib/api/models/getApiFieldGroupsEntityType";

const entityTypeLabels: Record<string, string> = {
  PROPERTY: "Bất động sản",
  CUSTOMER_NEED: "Nhu cầu khách hàng",
  LEAD: "Khách tiềm năng",
  DEAL: "Giao dịch",
  OWNER_PROFILE: "Hồ sơ chủ nhà",
};

interface FieldGroup {
  id: string;
  name: string;
  code: string;
  entityType: GetApiFieldGroupsEntityType;
  propertyTypeId?: string | null;
  sortOrder?: number;
  status?: string;
  definitions?: unknown[];
}

interface GroupsTabProps {
  entityType?: GetApiFieldGroupsEntityType;
}

export function GroupsTab({ entityType }: GroupsTabProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    code: "",
    entityType: entityType || "PROPERTY",
    sortOrder: 0,
  });

  const { data, isLoading, refetch } = useGetApiFieldGroups(
    entityType ? { entityType } : undefined,
  );
  const groups = ((data as any)?.data as FieldGroup[]) || [];

  const { mutateAsync: createGroup, isPending: isCreating } = usePostApiFieldGroup({
    mutation: {
      onSuccess: () => {
        toast.success("Tạo nhóm trường thành công");
        closeDialog();
        refetch();
      },
      onError: (err: any) => {
        toast.error(err?.message || "Có lỗi xảy ra khi tạo nhóm trường");
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
        toast.error(err?.message || "Có lỗi xảy ra khi cập nhật nhóm trường");
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
        toast.error(err?.message || "Có lỗi xảy ra khi xóa nhóm trường");
      },
    },
  });

  const isPending = isCreating || isUpdating;

  const openCreateDialog = () => {
    setEditingId(null);
    setForm({ name: "", code: "", entityType: entityType || "PROPERTY", sortOrder: 0 });
    setDialogOpen(true);
  };

  const openEditDialog = (group: FieldGroup) => {
    setEditingId(group.id);
    setForm({
      name: group.name,
      code: group.code,
      entityType: group.entityType,
      sortOrder: group.sortOrder || 0,
    });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingId(null);
    setForm({ name: "", code: "", entityType: entityType || "PROPERTY", sortOrder: 0 });
  };

  const handleDelete = (group: FieldGroup) => {
    if (!confirm(`Xóa nhóm "${group.name}"?`)) return;
    deleteGroup({ id: group.id });
  };

  const handleSubmit = () => {
    if (!form.name || !form.code) {
      toast.error("Vui lòng nhập tên và mã nhóm");
      return;
    }
    if (editingId) {
      const dto: UpdateFieldGroupDto = {
        name: form.name,
        sortOrder: form.sortOrder,
      };
      updateGroup({ id: editingId, data: dto });
    } else {
      const dto: CreateFieldGroupDto = {
        name: form.name,
        code: form.code,
        entityType: form.entityType as any,
        sortOrder: form.sortOrder,
      };
      createGroup({ data: dto });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-end">
        <Button size="sm" onClick={openCreateDialog}>
          <Plus size={16} />
          Thêm nhóm
        </Button>
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
          <Button variant="outline" size="sm" onClick={openCreateDialog}>
            <Plus size={16} />
            Tạo nhóm đầu tiên
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {groups.map((group) => (
            <Card key={group.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base truncate">{group.name}</CardTitle>
                  <div className="flex gap-1 shrink-0">
                    <Button variant="ghost" size="icon-sm" onClick={() => openEditDialog(group)}>
                      <PencilSimple size={14} />
                    </Button>
                    <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(group)}>
                      <Trash size={14} />
                    </Button>
                  </div>
                </div>
                <div className="mt-1 flex flex-wrap gap-1">
                  <Badge variant="default">
                    <code className="font-mono">{group.code}</code>
                  </Badge>
                  <Badge variant="blue">{entityTypeLabels[group.entityType] || group.entityType}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1">
                  {group.definitions && group.definitions.length > 0 ? (
                    <Badge variant="default">{group.definitions.length} trường</Badge>
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingId ? "Chỉnh sửa nhóm trường" : "Tạo nhóm trường"}</DialogTitle>
            <DialogDescription>Nhóm các trường động theo logic nghiệp vụ</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <FormField label="Tên nhóm" required>
              <Input
                placeholder="VD: Thông tin cơ bản"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </FormField>
            <FormField label="Mã nhóm" required helper="Unique trong tenant + entityType">
              <Input
                placeholder="VD: basic_info"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                disabled={!!editingId}
              />
            </FormField>
            <FormField label="Đối tượng" required>
              <Select
                value={form.entityType}
                onValueChange={(v) => setForm({ ...form, entityType: v as GetApiFieldGroupsEntityType })}
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
            <FormField label="Thứ tự hiển thị">
              <Input
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
              />
            </FormField>
          </div>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Hủy
            </DialogClose>
            <Button onClick={handleSubmit} disabled={isPending}>
              {isPending ? "Đang lưu..." : editingId ? "Cập nhật" : "Tạo nhóm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
