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
import { FormSection, FormField } from "@/components/shared/form-section";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useGetApiCustomerId, usePatchApiCustomer } from "@/lib/api/endpoints/customers";

interface Customer {
  id: string;
  fullName: string;
  phone?: string;
  email?: string;
  types?: string[];
}

const customerSchema = z.object({
  fullName: z.string().min(2, "Ho ten phai co it nhat 2 ky tu"),
  phone: z.string().optional(),
  email: z.string().email("Email khong hop le").optional().or(z.literal("")),
  types: z.array(z.string()).optional(),
});

type CustomerFormData = z.infer<typeof customerSchema>;

export default function CustomerEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: customerData, isLoading } = useGetApiCustomerId(id);
  const customer = (customerData as unknown as { data: Customer })?.data;

  const { mutate: updateCustomer } = usePatchApiCustomer();

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: { types: ["BUYER"] },
  });

  useEffect(() => {
    if (customer) {
      reset({
        fullName: customer.fullName || "",
        phone: customer.phone || "",
        email: customer.email || "",
        types: customer.types || ["BUYER"],
      });
    }
  }, [customer, reset]);

  const onSubmit = async (data: CustomerFormData) => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        fullName: data.fullName,
        phone: data.phone || undefined,
        email: data.email || undefined,
        types: data.types,
      };
      await updateCustomer({ id, data: payload });
      router.push(`/customers/${id}`);
    } catch (err) {
      setError("Co loi xay ra khi cap nhat khach hang. Vui long thu lai.");
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
        <button onClick={() => router.push("/customers")} className="rounded-md p-2 text-foreground-muted hover:bg-surface-muted" aria-label="Quay lai">
          <ArrowLeft size={20} />
        </button>
        <PageHeader eyebrow="CRM" title="Chỉnh sửa khach hang" />
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormSection title="Thong tin khach hang">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField label="Họ và tên" htmlFor="fullName" required error={errors.fullName?.message}>
              <Input id="fullName" placeholder="Nguyen Van An" {...register("fullName")} />
            </FormField>
            <FormField label="Số điện thoại" htmlFor="phone" error={errors.phone?.message}>
              <Input id="phone" placeholder="0901234567" {...register("phone")} />
            </FormField>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField label="Email" htmlFor="email" error={errors.email?.message}>
              <Input id="email" type="email" placeholder="an.nguyen@email.com" {...register("email")} />
            </FormField>
            <FormField label="Loai khach hang">
              <Select defaultValue="BUYER" onValueChange={(v) => v && setValue("types", [v])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="BUYER">Nguoi mua</SelectItem>
                  <SelectItem value="SELLER">Nguoi ban</SelectItem>
                  <SelectItem value="TENANT">Nguoi thue</SelectItem>
                  <SelectItem value="LANDLORD">Cho thue</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
          </div>
        </FormSection>

        <div className="flex items-center justify-end gap-2">
          <Button type="button" variant="secondary" onClick={() => router.push(`/customers/${id}`)}>Huy</Button>
          <Button type="submit" disabled={loading}>{loading ? "Dang luu..." : "Cap nhat"}</Button>
        </div>
      </form>
    </div>);
}
