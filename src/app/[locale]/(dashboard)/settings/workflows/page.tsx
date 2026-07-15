"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const workflows = [
  { id: "1", name: "Deal Workflow", entity: "DEAL", states: 6, transitions: 10 },
  { id: "2", name: "Lead Workflow", entity: "LEAD", states: 7, transitions: 12 },
  { id: "3", name: "Property Workflow", entity: "PROPERTY", states: 5, transitions: 8 },
];

export default function WorkflowsPage() {
  return (
          <div className="flex flex-col gap-6">
        <PageHeader eyebrow="Cai dat" title="Workflow" description="Dinh nghia luong trang thai cho deal, lead, property" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {workflows.map((wf) => (
            <Card key={wf.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{wf.name}</CardTitle>
                  <Badge variant="blue">{wf.entity}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 text-sm text-foreground-muted">
                  <span>{wf.states} trang thai</span>
                  <span>{wf.transitions} chuyen doi</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>  );
}
