"use client";

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
import type { GetApiFieldGroupsEntityType } from "@/lib/api/models/getApiFieldGroupsEntityType";
import { entityTypeOptions, getEntityTypeLabel } from "./entity-type.constants";

export interface GroupFormState {
  name: string;
  code: string;
  entityType: string;
  sortOrder: number;
}

interface GroupFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingId: string | null;
  form: GroupFormState;
  setForm: React.Dispatch<React.SetStateAction<GroupFormState>>;
  isPending: boolean;
  onSubmit: () => void;
  onClose?: () => void;
}

export function GroupFormDialog({
  open,
  onOpenChange,
  editingId,
  form,
  setForm,
  isPending,
  onSubmit,
  onClose,
}: GroupFormDialogProps) {
  const handleOpenChange = (next: boolean) => {
    if (!next && onClose) {
      onClose();
    }
    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editingId ? "Chỉnh sửa nhóm" : "Tạo nhóm"}</DialogTitle>
          <DialogDescription>Nhóm các loại dữ liệu theo logic nghiệp vụ</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <FormField label="Mã nhóm" required>
            <Input
              placeholder="VD: basic_info"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              disabled={!!editingId}
            />
          </FormField>
          <FormField label="Tên nhóm" required>
            <Input
              placeholder="VD: Thông tin cơ bản"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
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
          <Button onClick={onSubmit} disabled={isPending}>
            {isPending ? "Đang lưu..." : editingId ? "Cập nhật" : "Tạo nhóm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
