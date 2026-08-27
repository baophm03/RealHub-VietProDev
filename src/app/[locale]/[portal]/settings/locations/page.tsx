"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { ChevronRight, MapPin, ChevronDown } from "lucide-react";
import {
  useGetApiLocations,
  useGetApiLocationTree,
} from "@/lib/api/endpoints/locations";
import type { Location } from "@/lib/api/types/locations";

interface TreeNode extends Location {
  children?: TreeNode[];
}

const typeLabel: Record<string, string> = {
  COUNTRY: "Quốc gia",
  PROVINCE: "Tỉnh/Thành",
  DISTRICT: "Quận/Huyện",
  WARD: "Phường/Xã",
  STREET: "Đường",
};

function TreeView({ nodes, depth = 0 }: { nodes: TreeNode[]; depth?: number }) {
  return (
    <div className="flex flex-col">
      {nodes.map((node) => (
        <TreeRow key={node.id} node={node} depth={depth} />
      ))}
    </div>
  );
}

function TreeRow({ node, depth }: { node: TreeNode; depth: number }) {
  const [open, setOpen] = useState(depth < 1);
  const hasChildren = !!node.children?.length;

  return (
    <div>
      <div
        className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 hover:bg-surface-muted transition-colors"
        style={{ paddingLeft: `${depth * 20 + 8}px` }}
        onClick={() => hasChildren && setOpen((v) => !v)}
      >
        {hasChildren ? (
          open ? (
            <ChevronDown size={14} className="text-foreground-muted shrink-0" />
          ) : (
            <ChevronRight size={14} className="text-foreground-muted shrink-0" />
          )
        ) : (
          <MapPin size={14} className="text-foreground-muted shrink-0" />
        )}
        <span className="text-sm">{node.name}</span>
        <span className="text-[10px] uppercase tracking-wide text-foreground-muted">
          {typeLabel[node.type] ?? node.type}
        </span>
        {node.code && (
          <span className="ml-auto font-mono text-[10px] text-foreground-muted">
            {node.code}
          </span>
        )}
      </div>
      {hasChildren && open && (
        <TreeView nodes={node.children!} depth={depth + 1} />
      )}
    </div>
  );
}

export default function LocationsPage() {
  const [selectedProvinceId, setSelectedProvinceId] = useState<string | null>(null);

  const { data: provincesRaw, isLoading: loadingProvinces } = useGetApiLocations({
    type: "PROVINCE",
  });
  const provinces = ((provincesRaw as { data?: Location[] } | undefined)?.data) ?? [];

  const { data: treeRaw, isLoading: loadingTree } = useGetApiLocationTree(
    selectedProvinceId ? { parentId: selectedProvinceId } : undefined,
    { query: { enabled: !!selectedProvinceId } },
  );
  const tree = ((treeRaw as { data?: TreeNode[] } | undefined)?.data) ?? [];

  const selectedProvince = provinces.find((p) => p.id === selectedProvinceId);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Cài đặt"
        title="Địa lý"
        description="Cây địa lý: Tỉnh/Thành → Quận/Huyện → Phường/Xã → Đường"
      />

      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        {/* Province list */}
        <Card className="py-1">
          <CardContent className="p-0">
            <div className="border-b border-border px-4 py-3">
              <p className="text-sm font-medium">Tỉnh / Thành phố</p>
              <p className="text-xs text-foreground-muted">
                {provinces.length} tỉnh/thành
              </p>
            </div>
            <div className="max-h-[600px] overflow-y-auto">
              {loadingProvinces ? (
                <div className="px-4 py-8 text-center text-sm text-foreground-muted">
                  Đang tải...
                </div>
              ) : provinces.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-foreground-muted">
                  Chưa có tỉnh/thành nào
                </div>
              ) : (
                <div className="flex flex-col py-1">
                  {provinces.map((p) => {
                    const active = p.id === selectedProvinceId;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setSelectedProvinceId(p.id)}
                        className={
                          "flex items-center gap-2 px-4 py-2 text-left text-sm transition-colors " +
                          (active
                            ? "bg-primary/10 text-primary font-medium"
                            : "hover:bg-surface-muted")
                        }
                      >
                        <MapPin size={14} className="shrink-0 opacity-60" />
                        <span className="truncate">{p.name}</span>
                        {!!p._count?.children && (
                          <span className="ml-auto text-[10px] text-foreground-muted">
                            {p._count.children}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tree panel */}
        <Card className="py-1">
          <CardContent className="p-0">
            <div className="border-b border-border px-4 py-3">
              <p className="text-sm font-medium">
                {selectedProvince ? selectedProvince.name : "Chọn tỉnh/thành"}
              </p>
              <p className="text-xs text-foreground-muted">
                {selectedProvince
                  ? `Cây địa lý thuộc ${selectedProvince.name}`
                  : "Bấm vào 1 tỉnh/thành bên trái để xem cây địa lý"}
              </p>
            </div>
            <div className="max-h-[600px] overflow-y-auto p-2">
              {!selectedProvinceId ? (
                <EmptyState
                  icon={<MapPin size={24} />}
                  title="Chưa chọn tỉnh/thành"
                  description="Chọn 1 tỉnh/thành từ danh sách bên trái để xem cây địa lý"
                  className="mx-2 my-4"
                />
              ) : loadingTree ? (
                <div className="px-4 py-8 text-center text-sm text-foreground-muted">
                  Đang tải cây địa lý...
                </div>
              ) : tree.length === 0 ? (
                <EmptyState
                  icon={<MapPin size={24} />}
                  title="Chưa có dữ liệu"
                  description={`Chưa có quận/huyện nào dưới ${selectedProvince?.name ?? "tỉnh/thành này"}`}
                  className="mx-2 my-4"
                />
              ) : (
                <TreeView nodes={tree} />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
