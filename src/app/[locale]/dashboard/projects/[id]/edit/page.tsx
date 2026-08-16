"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormSection, FormField } from "@/components/shared/form-section";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  useGetApiProjectId,
  usePatchApiProject,
  getGetApiProjectIdQueryKey,
} from "@/lib/api/endpoints/projects";
import { useGetApiLocations } from "@/lib/api/endpoints/locations";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import type { Location } from "@/lib/api/types/locations";
import { Project } from "@/lib/api/types/projects";
import { ProjectMediaManager } from "@/components/shared/project-media-manager";

const projectSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập tên dự án"),
  code: z.string().min(1, "Vui lòng nhập mã dự án"),
  developer: z.string().optional(),
  provinceId: z.string().optional(),
  districtId: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

type ProjectFormData = z.infer<typeof projectSchema>;

const statusLabels: Record<string, string> = {
  ACTIVE: "Đang hoạt động",
  INACTIVE: "Ngừng hoạt động",
};

export default function ProjectEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProvinceId, setSelectedProvinceId] = useState<string | undefined>(undefined);

  const { data: projectData, isLoading } = useGetApiProjectId(id);
  const project = (projectData as unknown as { data: Project })?.data;

  const queryClient = useQueryClient();
  const { mutateAsync: updateProject } = usePatchApiProject();

  const { data: provincesData, isLoading: provincesLoading } = useGetApiLocations({ type: "PROVINCE", limit: 100 });
  const provinces = ((provincesData as unknown as { data: Location[] })?.data) || [];
  const provinceItems = Object.fromEntries(provinces.map((p) => [p.id, p.name]));

  const { data: districtsData, isLoading: districtsLoading } = useGetApiLocations(
    selectedProvinceId ? { type: "WARD", parentId: selectedProvinceId, limit: 100 } : undefined,
  );
  const districts = ((districtsData as unknown as { data: Location[] })?.data) || [];
  const districtItems = Object.fromEntries(districts.map((d) => [d.id, d.name]));

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      status: "ACTIVE",
    },
  });

  const watchedProvinceId = watch("provinceId");
  const watchedDistrictId = watch("districtId");

  useEffect(() => {
    if (project) {
      const provinceId = (project as any).provinceId || project.province?.id || "";
      const districtId = (project as any).districtId || project.district?.id || "";
      setSelectedProvinceId(provinceId || undefined);
      reset({
        name: project.name || "",
        code: project.code || "",
        developer: project.developer || "",
        provinceId,
        districtId,
        status: (project.status as ProjectFormData["status"]) || "ACTIVE",
      });
    }
  }, [project, reset]);

  const onSubmit = async (data: ProjectFormData) => {
    setLoading(true);
    setError(null);
    try {
      await updateProject({ id, data });
      await queryClient.invalidateQueries({ queryKey: getGetApiProjectIdQueryKey(id) });
      toast.success("Cập nhật dự án thành công");
      router.push(`/dashboard/projects/${id}`);
    } catch (err) {
      setError("Có lỗi xảy ra khi cập nhật dự án. Vui lòng thử lại.");
      toast.error("Có lỗi xảy ra khi cập nhật dự án");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 animate-pulse rounded-md bg-surface-muted" />
          <div className="h-8 w-64 animate-pulse rounded-lg bg-surface-muted" />
        </div>
        <div className="h-96 animate-pulse rounded-lg bg-surface-muted" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push(`/dashboard/projects/${id}`)}
          className="rounded-md p-2 text-foreground-muted hover:bg-surface-muted"
          aria-label="Quay lại"
        >
          <ArrowLeft size={20} />
        </button>
        <PageHeader
          eyebrow="Dự án"
          title="Chỉnh sửa dự án"
          description="Cập nhật thông tin dự án"
        />
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormSection title="Thông tin cơ bản" description="Nhập thông tin chính của dự án">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField label="Tên dự án" htmlFor="name" required error={errors.name?.message}>
              <Input id="name" placeholder="Vinhomes Central Park" {...register("name")} />
            </FormField>
            <FormField label="Mã dự án" htmlFor="code" required error={errors.code?.message}>
              <Input id="code" placeholder="VCP" {...register("code")} />
            </FormField>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField label="Chủ đầu tư" htmlFor="developer">
              <Input id="developer" placeholder="Vingroup" {...register("developer")} />
            </FormField>
            <FormField label="Trạng thái" required>
              <Select
                value={watch("status")}
                items={statusLabels}
                onValueChange={(v) => setValue("status", v as ProjectFormData["status"])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE" label="Đang hoạt động">Đang hoạt động</SelectItem>
                  <SelectItem value="INACTIVE" label="Ngừng hoạt động">Ngừng hoạt động</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Vị trí" description="Địa điểm của dự án">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField label="Tỉnh/Thành phố">
              <Select
                value={watchedProvinceId ?? ""}
                items={provinceItems}
                onValueChange={(v) => {
                  const val = v as string;
                  setValue("provinceId", val);
                  setSelectedProvinceId(val);
                  setValue("districtId", "");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder={provincesLoading ? "Đang tải..." : "Chọn tỉnh/thành phố"} />
                </SelectTrigger>
                <SelectContent>
                  {provinces.map((loc) => (
                    <SelectItem key={loc.id} value={loc.id} label={loc.name}>
                      {loc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Phường/Xã">
              <Select
                value={watchedDistrictId ?? ""}
                items={districtItems}
                disabled={!selectedProvinceId}
                onValueChange={(v) => setValue("districtId", v as string)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={
                    !selectedProvinceId
                      ? "Chọn tỉnh/thành phố trước"
                      : districtsLoading
                        ? "Đang tải..."
                        : "Chọn phường/xã"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {districts.map((loc) => (
                    <SelectItem key={loc.id} value={loc.id} label={loc.name}>
                      {loc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Quản lý hình ảnh & media" description="Upload, sắp xếp và quản lý ảnh/video của dự án">
          <ProjectMediaManager projectId={id} />
        </FormSection>

        <div className="flex items-center justify-end gap-2">
          <Button type="button" variant="secondary" onClick={() => router.push(`/dashboard/projects/${id}`)}>
            Hủy
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Đang lưu..." : "Cập nhật dự án"}
          </Button>
        </div>
      </form>
    </div>
  );
}
