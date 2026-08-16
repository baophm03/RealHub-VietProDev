"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormSection, FormField } from "@/components/shared/form-section";
import {
  useGetApiNewsCategoryId,
  usePostApiNewsCategory,
  usePatchApiNewsCategory,
  getGetApiNewsCategoryIdQueryKey,
} from "@/lib/api/endpoints/news-categories";
import type { GetNewsCategoryItemResponse } from "@/lib/api/types/news";

const categorySchema = z.object({
  name: z.string().min(1, "Vui lòng nhập tên chuyên mục"),
  description: z.string().optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

export default function CategoryFormPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const id = params.id as string;
  const isCreate = id === "new";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  const { data: categoryData, isLoading } = useGetApiNewsCategoryId(id, {
    query: { enabled: !isCreate },
  });
  const category = (categoryData as unknown as GetNewsCategoryItemResponse)?.data;

  const { mutateAsync: createCategory } = usePostApiNewsCategory();
  const { mutateAsync: updateCategory } = usePatchApiNewsCategory();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {},
  });

  useEffect(() => {
    if (category && !initialized) {
      reset({
        name: category.name,
        description: category.description ?? "",
      });
      setInitialized(true);
    }
  }, [category, initialized, reset]);

  const onSubmit = async (data: CategoryFormData) => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        name: data.name,
        description: data.description || undefined,
      };
      if (isCreate) {
        await createCategory({ data: payload });
        await queryClient.invalidateQueries({ queryKey: ["/api/news-categories"] });
        toast.success("Tạo chuyên mục thành công");
      } else {
        await updateCategory({ id, data: payload });
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["/api/news-categories"] }),
          queryClient.invalidateQueries({ queryKey: getGetApiNewsCategoryIdQueryKey(id) }),
        ]);
        toast.success("Cập nhật chuyên mục thành công");
      }
      router.push("/dashboard/news");
    } catch (err) {
      setError(
        isCreate
          ? "Có lỗi xảy ra khi tạo chuyên mục. Vui lòng thử lại."
          : "Có lỗi xảy ra khi cập nhật chuyên mục. Vui lòng thử lại.",
      );
      toast.error(isCreate ? "Có lỗi xảy ra khi tạo chuyên mục" : "Có lỗi xảy ra khi cập nhật chuyên mục");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isCreate && isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <Loader2 size={28} className="animate-spin text-primary" />
      </div>
    );
  }

  if (!isCreate && !category) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <p className="text-sm text-foreground-muted">Không tìm thấy chuyên mục.</p>
        <Button variant="outline" onClick={() => router.push("/dashboard/news")}>
          Quay lại
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push("/dashboard/news")}
          className="rounded-md p-2 text-foreground-muted hover:bg-surface-muted"
          aria-label="Quay lại"
        >
          <ArrowLeft size={20} />
        </button>
        <PageHeader
          eyebrow="Tin tức"
          title={isCreate ? "Thêm chuyên mục" : "Chỉnh sửa chuyên mục"}
          description={isCreate ? "Tạo chuyên mục tin tức mới" : category?.name}
        />
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormSection title="Thông tin chuyên mục" description="Nhập tên và mô tả chuyên mục">
          <FormField label="Tên chuyên mục" htmlFor="name" required error={errors.name?.message}>
            <Input id="name" placeholder="Thị trường" {...register("name")} />
          </FormField>

          <FormField label="Mô tả" htmlFor="description" error={errors.description?.message}>
            <Textarea
              id="description"
              rows={3}
              placeholder="Mô tả ngắn về chuyên mục..."
              {...register("description")}
            />
          </FormField>
        </FormSection>

        <div className="flex items-center justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.push("/dashboard/news")}>
            Hủy
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Đang lưu..." : isCreate ? "Tạo chuyên mục" : "Lưu thay đổi"}
          </Button>
        </div>
      </form>
    </div>
  );
}
