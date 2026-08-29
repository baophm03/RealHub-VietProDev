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

type PropertyType = {
  id: string;
  name: string;
  code: string;
};

const entityTypeLabels: Record<string, string> = {
  PROPERTY: "Bất động sản",
  CUSTOMER_NEED: "Nhu cầu khách hàng",
  LEAD: "Nguồn khách hàng",
  DEAL: "Giao dịch",
  OWNER_PROFILE: "Hồ sơ chủ nhà",
};

export interface GroupFormState {
  name: string;
  code: string;
  entityType: string;
  propertyTypeId: string;
  sortOrder: number;
}

interface GroupFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingId: string | null;
  form: GroupFormState;
  setForm: React.Dispatch<React.SetStateAction<GroupFormState>>;
  propertyTypes: PropertyType[];
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
  propertyTypes,
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
          <FormField label="Loại nhóm" required>
            <Select
              value={form.code}
              onValueChange={(v) => setForm({ ...form, code: v ?? "" })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn loại nhóm">
                  {(value: string) =>
                    value === "basic_info"
                      ? "Thông tin cơ bản"
                      : value === "special"
                        ? "Thông tin nổi bật"
                        : value === "contact_info"
                          ? "Thông tin liên hệ"
                          : "Chọn loại nhóm"
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic_info" label="Thông tin cơ bản">Thông tin cơ bản</SelectItem>
                <SelectItem value="special" label="Thông tin nổi bật">Thông tin nổi bật</SelectItem>
                <SelectItem value="contact_info" label="Thông tin liên hệ">Thông tin liên hệ</SelectItem>
              </SelectContent>
            </Select>
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
                  <SelectItem key={value} value={value} label={label}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
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
