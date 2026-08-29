"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePortalPath } from "@/lib/hooks/use-portal";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormSection, FormField } from "@/components/shared/form-section";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { usePostApiCommissionPlan } from "@/lib/api/endpoints/commission";

interface SplitRow {
  id: string;
  role: string;
  type: string;
  value: string;
}

export default function CommissionPlanFormPage() {
  const router = useRouter();
  const portalPath = usePortalPath();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [effectiveFrom, setEffectiveFrom] = useState("");
  const [effectiveTo, setEffectiveTo] = useState("");
  const [priority, setPriority] = useState("0");
  const [splits, setSplits] = useState<SplitRow[]>([
    { id: "1", role: "Sales chinh", type: "PERCENT", value: "60" },
    { id: "2", role: "Truong nhom", type: "PERCENT", value: "25" },
  ]);

  const { mutate: createPlan } = usePostApiCommissionPlan();

  const addSplit = () => setSplits([...splits, { id: Date.now().toString(), role: "", type: "PERCENT", value: "" }]);
  const removeSplit = (id: string) => setSplits(splits.filter((s) => s.id !== id));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const rules = [{
        name: "Rule 1",
        calculationType: "PERCENT",
        calculationValue: 3,
        calculationBase: "ACTUAL_VALUE",
        splits: splits.map((s) => ({
          receiverType: "ROLE",
          receiverRole: s.role,
          splitType: s.type,
          splitValue: parseFloat(s.value) || 0,
        })),
      }];
      const data = {
        name,
        description: description || undefined,
        priority: parseInt(priority) || 0,
        effectiveFrom,
        effectiveTo: effectiveTo || undefined,
        rules,
      };
      await createPlan({ data });
      router.refresh();
      router.push(portalPath("/commission/plans"));
    } catch (err) {
      setError("Co loi xay ra khi tao ke hoach. Vui long thu lai.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.push(portalPath("/commission/plans"))} className="rounded-md p-2 text-foreground-muted hover:bg-surface-muted" aria-label="Quay lai">
          <ArrowLeft size={20} />
        </button>
        <PageHeader eyebrow="Hoa hong" title="Tao ke hoach hoa hong" />
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <FormSection title="Thong tin co ban">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField label="Ten ke hoach" required>
              <Input placeholder="Hoa hong ban nha dat - 2025" value={name} onChange={(e) => setName(e.target.value)} />
            </FormField>
            <FormField label="Do uu tien">
              <Input type="number" placeholder="0" value={priority} onChange={(e) => setPriority(e.target.value)} />
            </FormField>
          </div>
          <FormField label="Mo ta">
            <Textarea placeholder="Mo ta ke hoach hoa hong..." value={description} onChange={(e) => setDescription(e.target.value)} />
          </FormField>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField label="Ngay hieu luc" required>
              <Input type="date" value={effectiveFrom} onChange={(e) => setEffectiveFrom(e.target.value)} />
            </FormField>
            <FormField label="Ngay ket thuc">
              <Input type="date" value={effectiveTo} onChange={(e) => setEffectiveTo(e.target.value)} />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Phan chia hoa hong" description="Dinh nghia ty le phan chia cho tung vai tro">
          <div className="flex flex-col gap-3">
            {splits.map((split) => (
              <div key={split.id} className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Input placeholder="Vai tro (vd: Sales chinh)" defaultValue={split.role} className="w-full sm:flex-1" />
                <Select defaultValue={split.type}>
                  <SelectTrigger className="w-full sm:w-32"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PERCENT" label="Theo %">Theo %</SelectItem>
                    <SelectItem value="FIXED" label="Co dinh">Co dinh</SelectItem>
                  </SelectContent>
                </Select>
                <Input type="number" placeholder="60" defaultValue={split.value} className="w-full sm:w-24" />
                <Button type="button" variant="ghost" size="icon" onClick={() => removeSplit(split.id)} aria-label="Xoa" className="self-end sm:self-auto">
                  <Trash2 size={16} />
                </Button>
              </div>
            ))}
            <Button type="button" variant="secondary" onClick={addSplit} className="w-fit">
              <Plus size={16} />
              Them phan chia
            </Button>
          </div>
        </FormSection>

        <div className="flex items-center justify-end gap-2">
          <Button type="button" variant="secondary" onClick={() => router.push(portalPath("/commission/plans"))}>Huy</Button>
          <Button type="submit" disabled={loading}>{loading ? "Dang luu..." : "Luu ke hoach"}</Button>
        </div>
      </form>
    </div>);
}
