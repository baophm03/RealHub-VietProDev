"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft } from "@phosphor-icons/react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormSection, FormField } from "@/components/shared/form-section";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useGetApiPropertyId, usePatchApiProperty } from "@/lib/api/endpoints/properties";
import { Property } from "@/lib/api/types/properties";

const propertySchema = z.object({
  propertyCode: z.string().min(1, "Vui long nhap ma BÄS"),
  title: z.string().min(5, "Tieu de phai co it nhat 5 ky tu"),
  slug: z.string().optional(),
  propertyTypeId: z.string().min(1, "Vui long chon loai BÄS"),
  transactionType: z.enum(["SALE", "RENT", "TRANSFER", "INVESTMENT"]),
  sellingMode: z.enum(["SELF_SELL", "SALES_DISTRIBUTION", "HYBRID"]),
  provinceId: z.string().optional(),
  districtId: z.string().optional(),
  price: z.number().min(0, "Gia phai lon hon 0"),
  priceUnit: z.string(),
  area: z.number().min(0, "Dien tich phai lon hon 0"),
  areaUnit: z.string(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  publicationStatus: z.enum(["PRIVATE", "PUBLIC", "ARCHIVED"]),
  businessStatus: z.enum(["AVAILABLE", "RESERVED", "SOLD", "RENTED", "OFF_MARKET"]),
  description: z.string().optional(),
});

type PropertyFormData = z.infer<typeof propertySchema>;

export default function PropertyEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: propertyData, isLoading } = useGetApiPropertyId(id);
  const property = (propertyData as unknown as { data: Property })?.data;

  // mutation
  const { mutate: updateProperty } = usePatchApiProperty();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
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
    },
  });

  useEffect(() => {
    if (property) {
      reset({
        propertyCode: property.propertyCode || "",
        title: property.title || "",
        slug: property.slug || "",
        propertyTypeId: property.propertyType?.id || "",
        transactionType: (property.transactionType as PropertyFormData["transactionType"]) || "SALE",
        sellingMode: (property.sellingMode as PropertyFormData["sellingMode"]) || "SELF_SELL",
        provinceId: "",
        districtId: "",
        price: Number(property.price) || 0,
        priceUnit: property.priceUnit || "VND",
        area: property.area || 0,
        areaUnit: property.areaUnit || "SQM",
        publicationStatus: (property.publicationStatus as PropertyFormData["publicationStatus"]) || "PRIVATE",
        businessStatus: (property.businessStatus as PropertyFormData["businessStatus"]) || "AVAILABLE",
        description: "",
      });
    }
  }, [property, reset]);

  const onSubmit = async (data: PropertyFormData) => {
    setLoading(true);
    setError(null);
    try {
      await updateProperty({ id, data });
      router.push(`/properties/${id}`);
    } catch (err) {
      setError("Co loi xay ra khi cap nhat bat dong san. Vui long thu lai.");
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
          onClick={() => router.push(`/properties/${id}`)}
          className="rounded-md p-2 text-foreground-muted hover:bg-surface-muted"
          aria-label="Quay lai"
        >
          <ArrowLeft size={20} />
        </button>
        <PageHeader
          eyebrow="Bat dong san"
          title="Chinh sua bat dong san"
          description="Cap nhat thong tin bat dong san"
        />
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormSection title="Thong tin co ban" description="Nhap thong tin chinh cua bat dong san">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField label="Ma BÄS" htmlFor="propertyCode" required error={errors.propertyCode?.message}>
              <Input id="propertyCode" placeholder="PROP-001" {...register("propertyCode")} />
            </FormField>
            <FormField label="Tieu de" htmlFor="title" required error={errors.title?.message}>
              <Input id="title" placeholder="Vinhomes Central Park - 2PN" {...register("title")} />
            </FormField>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField label="Loai giao dich" required>
              <Select
                defaultValue="SALE"
                onValueChange={(v) => setValue("transactionType", v as PropertyFormData["transactionType"])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chon loai giao dich" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SALE">Ban</SelectItem>
                  <SelectItem value="RENT">Cho thue</SelectItem>
                  <SelectItem value="TRANSFER">Chuyen nhuong</SelectItem>
                  <SelectItem value="INVESTMENT">Dau tu</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Loai BÄS" htmlFor="propertyTypeId" required error={errors.propertyTypeId?.message}>
              <Input id="propertyTypeId" placeholder="Chon loai BÄS" {...register("propertyTypeId")} />
            </FormField>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField label="Hinh thuc ban" required>
              <Select
                defaultValue="SELF_SELL"
                onValueChange={(v) => setValue("sellingMode", v as PropertyFormData["sellingMode"])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chon hinh thuc ban" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SELF_SELL">Ban tu hanh</SelectItem>
                  <SelectItem value="SALES_DISTRIBUTION">Phan phoi ban</SelectItem>
                  <SelectItem value="HYBRID">Ket hop</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
          </div>

          <FormField label="Mo ta" htmlFor="description">
            <Textarea id="description" placeholder="Mo ta chi tiet ve bat dong san..." {...register("description")} />
          </FormField>
        </FormSection>

        <FormSection title="Gia & Dien tich" description="Thong tin gia va kich thuoc">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField label="Gia" htmlFor="price" required error={errors.price?.message}>
              <Input id="price" type="number" placeholder="5000000000" {...register("price")} />
            </FormField>
            <FormField label="Don vi tien">
              <Select defaultValue="VND" onValueChange={(v) => setValue("priceUnit", v ?? "")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VND">VND</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField label="Dien tich (m2)" htmlFor="area" required error={errors.area?.message}>
              <Input id="area" type="number" placeholder="80" {...register("area")} />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Vi tri" description="Dia diem cua bat dong san">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField label="Tinh/Thanh pho">
              <Input placeholder="Chon tinh" {...register("provinceId")} />
            </FormField>
            <FormField label="Quan/Huyen">
              <Input placeholder="Chon quan" {...register("districtId")} />
            </FormField>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField label="Vi do">
              <Input type="number" step="any" placeholder="10.7769" {...register("latitude")} />
            </FormField>
            <FormField label="Kinh do">
              <Input type="number" step="any" placeholder="106.7009" {...register("longitude")} />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Trang thai" description="Trang thai kinh doanh va xuat ban">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField label="Trang thai kinh doanh">
              <Select
                defaultValue="AVAILABLE"
                onValueChange={(v) => setValue("businessStatus", v as PropertyFormData["businessStatus"])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AVAILABLE">San co</SelectItem>
                  <SelectItem value="RESERVED">Dat coc</SelectItem>
                  <SelectItem value="SOLD">Da ban</SelectItem>
                  <SelectItem value="RENTED">Da thue</SelectItem>
                  <SelectItem value="OFF_MARKET">Khoi ban</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Trang thai xuat ban">
              <Select
                defaultValue="PRIVATE"
                onValueChange={(v) => setValue("publicationStatus", v as PropertyFormData["publicationStatus"])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PRIVATE">Rieng tu</SelectItem>
                  <SelectItem value="PUBLIC">Cong khai</SelectItem>
                  <SelectItem value="ARCHIVED">Luu tru</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Truong dong" description="Truong duoc render dong tu FormSchema API">
          <p className="text-sm text-foreground-muted">
            Cac truong dong se tu dong hien thi tai day sau khi fetch tu{" "}
            <code className="rounded bg-surface-muted px-1.5 py-0.5 font-mono text-xs">
              /api/dynamic-fields/form-schemas?entityType=PROPERTY
            </code>
          </p>
        </FormSection>

        <div className="flex items-center justify-end gap-2">
          <Button type="button" variant="secondary" onClick={() => router.push(`/properties/${id}`)}>
            Huy
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Dang luu..." : "Cap nhat bat dong san"}
          </Button>
        </div>
      </form>
    </div>);
}
