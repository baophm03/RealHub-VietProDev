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

const dealSchema = z.object({
  title: z.string().min(5, "Tieu de phai co it nhat 5 ky tu"),
  customerId: z.string().min(1, "Vui long chon khach hang"),
  propertyId: z.string().min(1, "Vui long chon BÄS"),
  transactionType: z.enum(["SALE", "RENT", "TRANSFER"]),
  transactionValueEstimated: z.number().min(0, "Gia tri phai lon hon 0"),
  note: z.string().optional(),
});

type DealFormData = z.infer<typeof dealSchema>;

export default function DealFormPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<DealFormData>({
    resolver: zodResolver(dealSchema),
    defaultValues: { transactionType: "SALE" },
  });

  const onSubmit = async (data: DealFormData) => {
    setLoading(true);
    try {
      console.log(data);
      router.push("/deals");
    } finally {
      setLoading(false);
    }
  };

  return (
          <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/deals")} className="rounded-md p-2 text-foreground-muted hover:bg-surface-muted" aria-label="Quay lai">
            <ArrowLeft size={20} />
          </button>
          <PageHeader eyebrow="Giao dich" title="Tao giao dich" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormSection title="Thong tin giao dich">
            <FormField label="Tieu de" htmlFor="title" required error={errors.title?.message}>
              <Input id="title" placeholder="Ban Vinhomes Central Park 2PN" {...register("title")} />
            </FormField>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField label="Khach hang" htmlFor="customerId" required error={errors.customerId?.message}>
                <Input id="customerId" placeholder="Chon khach hang" {...register("customerId")} />
              </FormField>
              <FormField label="Bat dong san" htmlFor="propertyId" required error={errors.propertyId?.message}>
                <Input id="propertyId" placeholder="Chon BÄS" {...register("propertyId")} />
              </FormField>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField label="Loai giao dich" required>
                <Select defaultValue="SALE" onValueChange={(v) => setValue("transactionType", v as DealFormData["transactionType"])}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SALE">Ban</SelectItem>
                    <SelectItem value="RENT">Cho thue</SelectItem>
                    <SelectItem value="TRANSFER">Chuyen nhuong</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Gia tri giao dich (VND)" htmlFor="transactionValueEstimated" required error={errors.transactionValueEstimated?.message}>
                <Input id="transactionValueEstimated" type="number" placeholder="5000000000" {...register("transactionValueEstimated")} />
              </FormField>
            </div>
            <FormField label="Ghi chu" htmlFor="note">
              <Textarea id="note" placeholder="Ghi chu ve giao dich..." {...register("note")} />
            </FormField>
          </FormSection>

          <div className="flex items-center justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => router.push("/deals")}>Huy</Button>
            <Button type="submit" disabled={loading}>{loading ? "Dang luu..." : "Luu giao dich"}</Button>
          </div>
        </form>
      </div>  );
}
