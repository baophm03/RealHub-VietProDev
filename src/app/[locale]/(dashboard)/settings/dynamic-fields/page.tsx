"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const groups = [
  { id: "1", name: "Thong tin co ban", fields: 8 },
  { id: "2", name: "Thong tin gia", fields: 5 },
  { id: "3", name: "Tien ich", fields: 12 },
  { id: "4", name: "Hinh anh", fields: 3 },
];

export default function DynamicFieldsPage() {
  return (
          <div className="flex flex-col gap-6">
        <PageHeader eyebrow="Cai dat" title="Truong dong" description="Nhom truong, dinh nghia va form schema" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {groups.map((group) => (
            <Card key={group.id}>
              <CardHeader>
                <CardTitle>{group.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground-muted">{group.fields} truong</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>  );
}
