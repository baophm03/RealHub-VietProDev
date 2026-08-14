"use client";

import { type ReactNode, useState } from "react";
import { cn } from "@/lib/utils";

export interface KanbanColumn<T> {
  id: string;
  title: string;
  variant?: "default" | "blue" | "green" | "yellow" | "red" | "purple";
  items: T[];
}

interface KanbanBoardProps<T> {
  columns: KanbanColumn<T>[];
  renderCard: (item: T) => ReactNode;
  onCardClick?: (item: T) => void;
  onDrop?: (item: T, targetColumnId: string) => void;
}

const variantStyles: Record<string, string> = {
  default: "bg-surface-muted text-foreground-muted",
  blue: "bg-accent-blue text-accent-blue-text",
  green: "bg-accent-green text-accent-green-text",
  yellow: "bg-accent-yellow text-accent-yellow-text",
  red: "bg-accent-red text-accent-red-text",
  purple: "bg-accent-purple text-accent-purple-text",
};

export function KanbanBoard<T extends { id: string }>({
  columns,
  renderCard,
  onCardClick,
  onDrop,
}: KanbanBoardProps<T>) {
  const [draggedItem, setDraggedItem] = useState<T | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  return (
    <div className="relative flex gap-3 overflow-x-auto pb-4 scrollbar-none">
      {columns.map((column) => (
        <div
          key={column.id}
          className="flex w-72 shrink-0 flex-col gap-3 max-[768px]:w-64"
          onDragOver={(e) => {
            e.preventDefault();
            setDragOverColumn(column.id);
          }}
          onDragLeave={() => setDragOverColumn(null)}
          onDrop={() => {
            if (draggedItem && onDrop) {
              onDrop(draggedItem, column.id);
            }
            setDraggedItem(null);
            setDragOverColumn(null);
          }}
        >
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "inline-flex items-center rounded-lg px-2.5 py-0.5 text-xs font-medium",
                  variantStyles[column.variant ?? "default"]
                )}
              >
                {column.title}
              </span>
              <span className="text-xs font-medium tabular-nums text-foreground-muted">
                {column.items.length}
              </span>
            </div>
          </div>

          <div
            className={cn(
              "flex flex-1 flex-col gap-2 rounded-lg border border-border bg-surface-muted/30 p-2 transition-colors",
              dragOverColumn === column.id && "border-border-strong bg-surface-muted/50"
            )}
          >
            {column.items.length === 0 ? (
              <div className="flex items-center justify-center py-8 text-xs text-foreground-muted">
                Kéo thẻ vào đây
              </div>
            ) : (
              column.items.map((item) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={() => setDraggedItem(item)}
                  onDragEnd={() => setDraggedItem(null)}
                  onClick={() => onCardClick?.(item)}
                  className={cn(
                    "cursor-pointer rounded-lg border border-border bg-surface p-3 transition-shadow hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)]",
                    draggedItem?.id === item.id && "opacity-50"
                  )}
                >
                  {renderCard(item)}
                </div>
              ))
            )}
          </div>
        </div>
      ))}
      {/* Scroll fade indicator for mobile */}
      <div className="absolute right-0 top-0 h-full w-8 bg-linear-to-l from-surface to-transparent pointer-events-none hidden max-[768px]:block" />
    </div>
  );
}
