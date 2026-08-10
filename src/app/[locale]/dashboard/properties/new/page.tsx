"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft } from "@phosphor-icons/react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/shared/rich-text-editor";
import { FormSection, FormField } from "@/components/shared/form-section";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { usePostApiProperty, useGetApiPropertyTypes } from "@/lib/api/endpoints/properties";
import { useGetApiProjects } from "@/lib/api/endpoints/projects";
import { toast } from "sonner";
import { useGetApiLocations } from "@/lib/api/endpoints/locations";
import type { Location } from "@/lib/api/types/locations";
import { GetProjectsResponse, Project } from "@/lib/api/types/projects";
import { DynamicFieldsSection } from "@/components/shared/dynamic-fields-section";

type PropertyType = {
  id: string;
  name: string;
  code: string;
  group?: string | null;
};

const propertySchema = z.object({
  propertyCode: z.string().min(1, "Vui lòng nhập mã BĐS"),
  title: z.string().min(5, "Tiêu đề phải có ít nhất 5 ký tự"),
  description: z.string().min(1, "Vui lòng nhập mô tả"),
  slug: z.string().min(1, "Vui lòng nhập slug"),
  propertyTypeId: z.string().min(1, "Vui lòng chọn loại BĐS"),
  transactionType: z.enum(["SALE", "RENT", "TRANSFER", "INVESTMENT"]),
  sellingMode: z.enum(["SELF_SELL", "SALES_DISTRIBUTION", "HYBRID"]),
  provinceId: z.string().optional(),
  districtId: z.string().optional(),
  price: z.number().min(0, "Giá phải lớn hơn 0"),
  priceUnit: z.string(),
  area: z.number().min(0, "Diện tích phải lớn hơn 0"),
  areaUnit: z.string(),
  projectId: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  publicationStatus: z.enum(["PRIVATE", "PUBLIC", "ARCHIVED"]),
  businessStatus: z.enum(["AVAILABLE", "RESERVED", "SOLD", "RENTED", "OFF_MARKET"]),
});

type PropertyFormData = z.infer<typeof propertySchema>;

const transactionTypeLabels: Record<string, string> = {
  SALE: "Bán",
  RENT: "Cho thuê",
  TRANSFER: "Chuyển nhượng",
  INVESTMENT: "Đầu tư",
};

const sellingModeLabels: Record<string, string> = {
  SELF_SELL: "Bán tự hành",
  SALES_DISTRIBUTION: "Phân phối bán",
  HYBRID: "Kết hợp",
};

const businessStatusLabels: Record<string, string> = {
  AVAILABLE: "Sẵn có",
  RESERVED: "Đặt cọc",
  SOLD: "Đã bán",
  RENTED: "Đã thuê",
  OFF_MARKET: "Không còn",
};

const publicationStatusLabels: Record<string, string> = {
  PRIVATE: "Riêng tư",
  PUBLIC: "Công khai",
  ARCHIVED: "Lưu trữ",
};

const priceUnitLabels: Record<string, string> = {
  VND: "VND",
  USD: "USD",
};

export default function PropertyFormPage() {
  return (
    <Suspense>
      <PropertyFormContent />
    </Suspense>
  );
}

function PropertyFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProvinceId, setSelectedProvinceId] = useState<string | undefined>(undefined);
  const [dynamicValues, setDynamicValues] = useState<Record<string, unknown>>({});

  const projectIdFromUrl = searchParams.get("projectId");

  // mutation
  const { mutateAsync: createProperty } = usePostApiProperty();

  // property types
  const { data: propertyTypesData, isLoading: propertyTypesLoading } = useGetApiPropertyTypes();
  const propertyTypes = ((propertyTypesData as unknown as { data?: PropertyType[] })?.data) || [];
  const propertyTypeItems = Object.fromEntries(propertyTypes.map((t) => [t.id, t.name]));

  // projects
  const { data: projectsData } = useGetApiProjects();
  const projects = ((projectsData as unknown as GetProjectsResponse)?.data) || [];
  const projectItems = Object.fromEntries(projects.map((p) => [p.id, p.name]));

  // locations
  const { data: provincesData, isLoading: provincesLoading } = useGetApiLocations({ type: "PROVINCE", limit: 100 });
  const provinces = ((provincesData as unknown as { data?: Location[] })?.data) || [];
  const provinceItems = Object.fromEntries(provinces.map((p) => [p.id, p.name]));

  const { data: districtsData, isLoading: districtsLoading } = useGetApiLocations(
    selectedProvinceId ? { type: "WARD", parentId: selectedProvinceId, limit: 100 } : undefined,
  );
  const districts = ((districtsData as unknown as { data?: Location[] })?.data) || [];
  const districtItems = Object.fromEntries(districts.map((d) => [d.id, d.name]));

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      transactionType: "SALE",
      sellingMode: "SELF_SELL",
      publicationStatus: "PRIVATE",
      businessStatus: "AVAILABLE",
      priceUnit: "VND",
      areaUnit: "SQM",
      projectId: projectIdFromUrl || undefined,
    },
  });

  const watchedPropertyTypeId = watch("propertyTypeId");
  const watchedProvinceId = watch("provinceId");
  const watchedDistrictId = watch("districtId");
  const watchedProjectId = watch("projectId");

  useEffect(() => {
    if (projectIdFromUrl) {
      setValue("projectId", projectIdFromUrl);
    }
  }, [projectIdFromUrl, setValue]);

  const onSubmit = async (data: PropertyFormData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await createProperty({ data: { ...data, dynamicValuesJson: Object.keys(dynamicValues).length > 0 ? dynamicValues : undefined } });
      const newId = (result as any)?.id || (result as any)?.data?.id;
      toast.success("Tạo bất động sản thành công");
      if (newId) {
        router.push(`/dashboard/properties/${newId}/edit`);
      } else {
        router.push("/dashboard/properties");
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi tạo bất động sản. Vui lòng thử lại.");
      toast.error("Có lỗi xảy ra khi tạo bất động sản");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push("/dashboard/properties")}
          className="rounded-md p-2 text-foreground-muted hover:bg-surface-muted"
          aria-label="Quay lại"
        >
          <ArrowLeft size={20} />
        </button>
        <PageHeader
          eyebrow="Bất động sản"
          title="Thêm bất động sản"
          description="Tạo bất động sản mới với trường động"
        />
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormSection title="Thông tin cơ bản" description="Nhập thông tin chính của bất động sản">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField label="Mã BĐS" htmlFor="propertyCode" required error={errors.propertyCode?.message}>
              <Input id="propertyCode" placeholder="PROP-001" {...register("propertyCode")} />
            </FormField>
            <FormField label="Tiêu đề" htmlFor="title" required error={errors.title?.message}>
              <Input id="title" placeholder="Vinhomes Central Park - 2PN" {...register("title")} />
            </FormField>
          </div>

          <FormField label="Mô tả" htmlFor="description" required error={errors.description?.message}>
            <RichTextEditor
              value={watch("description") ?? ""}
              onChange={(val) => setValue("description", val)}
              placeholder="Nhập mô tả chi tiết về bất động sản..."
              height={300}
            />
          </FormField>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField label="Slug" htmlFor="slug" required error={errors.slug?.message}>
              <Input id="slug" placeholder="vinhomes-central-park-2pn" {...register("slug")} />
            </FormField>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField label="Loại giao dịch" required>
              <Select
                defaultValue="SALE"
                items={transactionTypeLabels}
                onValueChange={(v) => setValue("transactionType", v as PropertyFormData["transactionType"])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại giao dịch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SALE">Bán</SelectItem>
                  <SelectItem value="RENT">Cho thuê</SelectItem>
                  <SelectItem value="TRANSFER">Chuyển nhượng</SelectItem>
                  <SelectItem value="INVESTMENT">Đầu tư</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Loại BĐS" required error={errors.propertyTypeId?.message}>
              <Select
                value={watchedPropertyTypeId ?? ""}
                items={propertyTypeItems}
                onValueChange={(v) => setValue("propertyTypeId", v as string)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={propertyTypesLoading ? "Đang tải..." : "Chọn loại BĐS"} />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypes.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField label="Hình thức bán" required>
              <Select
                defaultValue="SELF_SELL"
                items={sellingModeLabels}
                onValueChange={(v) => setValue("sellingMode", v as PropertyFormData["sellingMode"])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn hình thức bán" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SELF_SELL">Bán tự hành</SelectItem>
                  <SelectItem value="SALES_DISTRIBUTION">Phân phối bán</SelectItem>
                  <SelectItem value="HYBRID">Kết hợp</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
          </div>

        </FormSection>

        <FormSection title="Giá & Diện tích" description="Thông tin giá và kích thước">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex items-center gap-4">
              <FormField label="Giá" htmlFor="price" required error={errors.price?.message}>
                <Input
                  id="price"
                  type="number"
                  placeholder="5000000000"
                  className="w-full"
                  {...register("price", { setValueAs: (v) => v === "" ? undefined : Number(v) })}
                />
              </FormField>
              <FormField label="Đơn vị tiền">
                <Select
                  value={watch("priceUnit")}
                  items={priceUnitLabels}
                  onValueChange={(v) => setValue("priceUnit", v ?? "")}
                >
                  <SelectTrigger>
                    <SelectValue className="w-[100px]" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VND">VND</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
            </div>
            <FormField label="Diện tích (m2)" htmlFor="area" required error={errors.area?.message}>
              <Input id="area" type="number" placeholder="80" {...register("area", { setValueAs: (v) => v === "" ? undefined : Number(v) })} />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Vị trí" description="Địa điểm của bất động sản">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField label="Dự án">
              <Select
                value={watchedProjectId ?? ""}
                items={projectItems}
                onValueChange={(v) => setValue("projectId", v as string)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn dự án (không bắt buộc)" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          </div>
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
                    <SelectItem key={loc.id} value={loc.id}>
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
                    <SelectItem key={loc.id} value={loc.id}>
                      {loc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField label="Vĩ độ">
              <Input type="number" step="any" placeholder="10.7769" {...register("latitude", { setValueAs: (v) => v === "" ? undefined : Number(v) })} />
            </FormField>
            <FormField label="Kinh độ">
              <Input type="number" step="any" placeholder="106.7009" {...register("longitude", { setValueAs: (v) => v === "" ? undefined : Number(v) })} />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Trạng thái" description="Trạng thái kinh doanh và xuất bản">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField label="Trạng thái kinh doanh">
              <Select
                defaultValue="AVAILABLE"
                items={businessStatusLabels}
                onValueChange={(v) => setValue("businessStatus", v as PropertyFormData["businessStatus"])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AVAILABLE">Sẵn có</SelectItem>
                  <SelectItem value="RESERVED">Đặt cọc</SelectItem>
                  <SelectItem value="SOLD">Đã bán</SelectItem>
                  <SelectItem value="RENTED">Đã thuê</SelectItem>
                  <SelectItem value="OFF_MARKET">Không còn</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Trạng thái xuất bản">
              <Select
                defaultValue="PRIVATE"
                items={publicationStatusLabels}
                onValueChange={(v) => setValue("publicationStatus", v as PropertyFormData["publicationStatus"])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PRIVATE">Riêng tư</SelectItem>
                  <SelectItem value="PUBLIC">Công khai</SelectItem>
                  <SelectItem value="ARCHIVED">Lưu trữ</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
          </div>
        </FormSection>

        <DynamicFieldsSection
          entityType="PROPERTY"
          propertyTypeId={watchedPropertyTypeId}
          initialValues={dynamicValues}
          onChange={setDynamicValues}
        />

        <div className="flex items-center justify-end gap-2">
          <Button type="button" variant="secondary" onClick={() => router.push("/dashboard/properties")}>
            Hủy
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Đang lưu..." : "Lưu bất động sản"}
          </Button>
        </div>
      </form>
    </div >);
}
