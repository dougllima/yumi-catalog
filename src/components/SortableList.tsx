import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type SortableListProps = {
  ids: string[];
  layout: "list" | "grid";
  onReorder: (fromIndex: number, toIndex: number) => void;
  children: ReactNode;
};

/**
 * Lista reordenável por arraste com toque, mouse e teclado. O arraste só
 * começa pela alça (ver SortableItem), então rolar a página no celular
 * continua funcionando.
 */
export function SortableList({
  ids,
  layout,
  onReorder,
  children,
}: SortableListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) {
      return;
    }

    const fromIndex = ids.indexOf(String(active.id));
    const toIndex = ids.indexOf(String(over.id));

    if (fromIndex >= 0 && toIndex >= 0) {
      onReorder(fromIndex, toIndex);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={ids}
        strategy={
          layout === "grid" ? rectSortingStrategy : verticalListSortingStrategy
        }
      >
        {children}
      </SortableContext>
    </DndContext>
  );
}

type SortableItemProps = {
  id: string;
  disabled?: boolean;
  handleLabel: string;
  handleClassName?: string;
  className?: string;
  "data-testid"?: string;
  /** Recebe a alça de arraste para o item posicioná-la onde quiser. */
  children: (handle: ReactNode) => ReactNode;
};

export function SortableItem({
  id,
  disabled = false,
  handleLabel,
  handleClassName,
  className,
  children,
  ...rest
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled });

  const handle = (
    <button
      type="button"
      ref={setActivatorNodeRef}
      disabled={disabled}
      aria-label={handleLabel}
      className={cn(
        "grid size-8 shrink-0 cursor-grab touch-none place-items-center rounded-full text-muted-foreground transition hover:bg-accent/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-40",
        handleClassName,
      )}
      {...attributes}
      {...listeners}
    >
      <GripVertical className="size-4" aria-hidden="true" />
    </button>
  );

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "relative",
        isDragging && "z-10 opacity-80 shadow-xl",
        className,
      )}
      data-testid={rest["data-testid"]}
    >
      {children(handle)}
    </div>
  );
}
