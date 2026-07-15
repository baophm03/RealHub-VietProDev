"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft } from "@phosphor-icons/react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormSection, FormField } from "@/components/shared/form-section";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const customerSchema = z.object({
  fullName: z.string().min(2, "Ho ten phai co it nhat 2 ky tu"),
  phone: z.string().min(10, "So dien thoai khong hop le"),
  email: z.string().email("Email khong hop le"),
  type: z.enum(["BUYER", "SELLER", "TENANT", "LANDLORD"]),
  note: z.string().optional(),
});

type CustomerFormData = z.infer<typeof customerSchema>;

export default function CustomerFormPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: { type: "BUYER" },
  });

  const onSubmit = async (data: CustomerFormData) => {
    setLoading(true);
    try {
      console.log(data);
      router.push("/customers");
    } finally {
      setLoading(false);
    }
  };

  return (
          <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/customers")} className="rounded-md p-2 text-foreground-muted hover:bg-surface-muted" aria-label="Quay lai">
            <ArrowLeft size={20} />
          </button>
          <PageHeader eyebrow="CRM" title="Them khach hang" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormSection title="Thong tin khach hang">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField label="Ho va ten" htmlFor="fullName" required error={errors.fullName?.message}>
                <Input id="fullName" placeholder="Nguyen Van An" {...register("fullName")} />
              </FormField>
              <FormField label="So dien thoai" htmlFor="phone" required error={errors.phone?.message}>
                <Input id="phone" placeholder="0901234567" {...register("phone")} />
              </FormField>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField label="Email" htmlFor="email" required error={errors.email?.message}>
                <Input id="email" type="email" placeholder="an.nguyen@email.com" {...register("email")} />
              </FormField>
              <FormField label="Loai khach hang" required>
                <Select defaultValue="BUYER" onValueChange={(v) => setValue("type", v as CustomerFormData["type"])}>
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
            <FormField label="Ghi chu" htmlFor="note">
              <Textarea id="note" placeholder="Ghi chu ve khach hang..." {...register("note")} />
            </FormField>
          </FormSection>

          <div className="flex items-center justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => router.push("/customers")}>Huy</Button>
            <Button type="submit" disabled={loading}>{loading ? "Dang luu..." : "Luu"}</Button>
          </div>
        </form>
      </div>  );
}
