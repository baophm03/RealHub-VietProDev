"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useDeleteApiProject,
  getGetApiProjectsAdminQueryKey,
} from "@/lib/api/endpoints/projects";
import type { Project } from "@/lib/api/types/projects";

interface DeleteProjectDialogProps {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRefetch?: () => void;
}

export function DeleteProjectDialog({
  project,
  open,
  onOpenChange,
  onRefetch,
}: DeleteProjectDialogProps) {
  const queryClient = useQueryClient();
  const { mutateAsync: deleteProject, isPending } = useDeleteApiProject();
  const [deleting, setDeleting] = useState(false);

  const handleConfirm = async () => {
    if (!project) return;
    setDeleting(true);
    try {
      await deleteProject({ id: project.id });
      await queryClient.invalidateQueries({
        queryKey: getGetApiProjectsAdminQueryKey(),
      });
      toast.success(`Đã xóa "${project.name}"`);
      onOpenChange(false);
      onRefetch?.();
    } catch (err) {
      console.error(err);
      toast.error((err as any)?.response?.data?.error?.message?.[0] || "Có lỗi xảy ra khi xóa dự án");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xóa dự án</DialogTitle>
          <DialogDescription>
            {project && (
              <span className="flex flex-col gap-1">
                <span>
                  Bạn có chắc muốn xóa{" "}
                  <strong className="text-foreground">
                    {project.name}
                  </strong>
                  ?
                </span>
                <span className="mt-2 text-xs text-foreground-muted">
                  Hành động này không thể hoàn tác. Dự án sẽ bị ẩn (soft delete) và
                  không hiển thị trên hệ thống.
                </span>
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending || deleting}
          >
            Hủy
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            loading={isPending || deleting}
          >
            <Trash2 size={14} />
            Xóa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
