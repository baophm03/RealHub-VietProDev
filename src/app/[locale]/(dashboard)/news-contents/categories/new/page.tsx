"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft } from "@phosphor-icons/react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormSection, FormField } from "@/components/shared/form-section";
import { usePostApiNewsCategory } from "@/lib/api/endpoints/news-categories";

const categorySchema = z.object({
  name: z.string().min(1, "Vui lòng nhập tên chuyên mục"),
  description: z.string().optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

export default function NewNewsCategoryPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { mutateAsync: createCategory } = usePostApiNewsCategory();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {},
  });

  const onSubmit = async (data: CategoryFormData) => {
    setLoading(true);
    setError(null);
    try {
      await createCategory({
        data: {
          name: data.name,
          description: data.description || undefined,
        },
      });
      await queryClient.invalidateQueries({ queryKey: ["/api/news-categories"] });
      toast.success("Tạo chuyên mục thành công");
      router.push("/news-contents");
    } catch (err) {
      setError("Có lỗi xảy ra khi tạo chuyên mục. Vui lòng thử lại.");
      toast.error("Có lỗi xảy ra khi tạo chuyên mục");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push("/news-contents")}
          className="rounded-md p-2 text-foreground-muted hover:bg-surface-muted"
          aria-label="Quay lại"
        >
          <ArrowLeft size={20} />
        </button>
        <PageHeader
          eyebrow="Tin tức"
          title="Thêm chuyên mục"
          description="Tạo chuyên mục tin tức mới"
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
          <Button type="button" variant="outline" onClick={() => router.push("/news-contents")}>
            Hủy
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Đang lưu..." : "Tạo chuyên mục"}
          </Button>
        </div>
      </form>
    </div>
  );
}
