"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, MapPin } from "lucide-react";

interface LocationItem {
  id: string;
  name: string;
  type: string;
  children?: LocationItem[];
}

const locations: LocationItem[] = [
  { id: "1", name: "Viet Nam", type: "COUNTRY", children: [
    { id: "2", name: "TP. Ho Chi Minh", type: "PROVINCE", children: [
      { id: "3", name: "Quan 1", type: "DISTRICT", children: [
        { id: "4", name: "Phuong Ben Nghe", type: "WARD" },
        { id: "5", name: "Phuong Da Kao", type: "WARD" },
      ]},
      { id: "6", name: "Binh Thanh", type: "DISTRICT", children: [] },
    ]},
    { id: "7", name: "Ha Noi", type: "PROVINCE", children: [] },
  ]},
];

function LocationTree({ items, depth = 0 }: { items: LocationItem[]; depth?: number }) {
  return (
    <div className="flex flex-col gap-1">
      {items.map((item) => (
        <div key={item.id}>
          <div
            className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 hover:bg-surface-muted"
            style={{ paddingLeft: `${depth * 20 + 8}px` }}
          >
            {item.children?.length ? <ChevronRight size={14} className="text-foreground-muted" /> : <MapPin size={14} className="text-foreground-muted" />}
            <span className="text-sm">{item.name}</span>
            <span className="text-xs text-foreground-muted uppercase">{item.type}</span>
          </div>
          {item.children?.length && <LocationTree items={item.children} depth={depth + 1} />}
        </div>
      ))}
    </div>
  );
}

export default function LocationsPage() {
  return (
          <div className="flex flex-col gap-6">
        <PageHeader eyebrow="Cai dat" title="Dia ly" description="Cay dia ly: Tinh -> Quan -> Phuong -> Duong" />
        <Card>
          <CardContent className="py-4">
            <LocationTree items={locations} />
          </CardContent>
        </Card>
      </div>  );
}
