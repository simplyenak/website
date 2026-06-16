"use client";

import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  closestCorners,
  pointerWithin,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Link from "next/link";
import React, { useCallback, useRef, useState } from "react";
import type { PaginatedDocs } from "payload";

// ─── Types ────────────────────────────────────────────────────────────────────

type WorkflowStatus = "draft" | "in_review" | "approved" | "published";

type Tour = {
  id: number;
  name: string;
  slug: string;
  price?: number;
  duration?: string;
  featured?: boolean;
  popular?: boolean;
  workflowStatus: WorkflowStatus;
  heroImage?: { id: string; url?: string } | string | null;
  _order?: string;
};

type ColumnDef = {
  id: WorkflowStatus;
  label: string;
  color: string;
};

type ColumnState = PaginatedDocs<Tour>;

// ─── Column definitions ───────────────────────────────────────────────────────

const COLUMNS: ColumnDef[] = [
  { id: "draft", label: "Draft", color: "#6b7280" },
  { id: "in_review", label: "In Review", color: "#f59e0b" },
  { id: "approved", label: "Approved", color: "#3b82f6" },
  { id: "published", label: "Published", color: "#10b981" },
];

// ─── API helpers ──────────────────────────────────────────────────────────────

async function updateTour(
  id: number,
  data: { workflowStatus?: WorkflowStatus; _order?: string },
): Promise<void> {
  await fetch(`/api/tours/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify(data),
  });
}

async function fetchMoreTours(
  status: WorkflowStatus,
  page: number,
): Promise<ColumnState> {
  const params = new URLSearchParams({
    "where[workflowStatus][equals]": status,
    limit: "10",
    page: String(page),
    depth: "0",
  });
  const res = await fetch(`/api/tours?${params}`, { credentials: "same-origin" });
  return res.json();
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isColumnId(id: string | number): id is WorkflowStatus {
  return typeof id === "string" && COLUMNS.some((c) => c.id === id);
}

function resolveColumn(
  overId: string | number,
  columns: Record<WorkflowStatus, ColumnState>,
): WorkflowStatus | null {
  if (isColumnId(overId)) return overId;
  for (const col of COLUMNS) {
    if (columns[col.id].docs.some((t) => t.id === overId)) return col.id;
  }
  return null;
}

function hasImage(tour: Tour): boolean {
  return !!tour.heroImage;
}

// ─── Tour card ────────────────────────────────────────────────────────────────

function TourCard({
  tour,
  isDragging = false,
  listeners,
  attributes,
  setNodeRef,
  style,
}: {
  tour: Tour;
  isDragging?: boolean;
  listeners?: ReturnType<typeof useSortable>["listeners"];
  attributes?: ReturnType<typeof useSortable>["attributes"];
  setNodeRef?: (node: HTMLElement | null) => void;
  style?: React.CSSProperties;
}) {
  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        opacity: isDragging ? 0.3 : 1,
        background: "var(--theme-elevation-50)",
        border: "1px solid var(--theme-elevation-150)",
        borderRadius: "4px",
        padding: "12px",
        cursor: "grab",
        userSelect: "none",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
      }}
      {...attributes}
      {...listeners}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
        <p style={{ fontWeight: 600, fontSize: "13px", color: "var(--theme-elevation-1000)", margin: 0, lineHeight: "1.3" }}>
          {tour.name}
        </p>
        <span
          title={hasImage(tour) ? "Has hero image" : "Missing hero image"}
          style={{ fontSize: "14px", flexShrink: 0 }}
        >
          {hasImage(tour) ? "🖼" : "⚠️"}
        </span>
      </div>

      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
        {tour.price && (
          <span style={{ fontSize: "11px", color: "var(--theme-elevation-600)" }}>
            RM {tour.price}
          </span>
        )}
        {tour.duration && (
          <span style={{ fontSize: "11px", color: "var(--theme-elevation-500)" }}>
            · {tour.duration}
          </span>
        )}
      </div>

      <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
        {tour.featured && (
          <span style={{ fontSize: "10px", background: "#fef3c7", color: "#92400e", padding: "1px 6px", borderRadius: "9999px" }}>
            Featured
          </span>
        )}
        {tour.popular && (
          <span style={{ fontSize: "10px", background: "#dbeafe", color: "#1e40af", padding: "1px 6px", borderRadius: "9999px" }}>
            Popular
          </span>
        )}
      </div>

      <Link
        href={`/admin/collections/tours/${tour.id}`}
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        style={{ fontSize: "11px", color: "var(--theme-text)", textDecoration: "underline", alignSelf: "flex-end" }}
      >
        Edit →
      </Link>
    </div>
  );
}

// ─── Sortable card wrapper ────────────────────────────────────────────────────

function SortableTourCard({ tour }: { tour: Tour }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: tour.id,
    data: { type: "tour", tour },
  });

  return (
    <TourCard
      tour={tour}
      isDragging={isDragging}
      setNodeRef={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      listeners={listeners}
      attributes={attributes}
    />
  );
}

// ─── Column ───────────────────────────────────────────────────────────────────

function KanbanColumn({
  column,
  state,
  isOver,
  onLoadMore,
}: {
  column: ColumnDef;
  state: ColumnState;
  isOver: boolean;
  onLoadMore: () => void;
}) {
  const { setNodeRef } = useDroppable({ id: column.id });

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "240px", flexShrink: 0, height: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
        <span style={{ fontWeight: 600, fontSize: "13px", color: "var(--theme-elevation-800)" }}>
          {column.label}
        </span>
        <span style={{
          fontSize: "11px",
          fontFamily: "monospace",
          padding: "1px 8px",
          borderRadius: "9999px",
          background: column.color + "20",
          color: column.color,
        }}>
          {state.totalDocs}
        </span>
      </div>

      <SortableContext items={state.docs.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div
          ref={setNodeRef}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            minHeight: "80px",
            padding: "8px",
            borderRadius: "6px",
            border: `1px solid ${isOver ? "#10b981" : "var(--theme-elevation-150)"}`,
            background: isOver ? "#ecfdf520" : "var(--theme-elevation-25, var(--theme-elevation-50))",
            transition: "border-color 0.15s, background 0.15s",
            overflowY: "auto",
            maxHeight: "calc(100vh - 220px)",
          }}
        >
          {state.docs.length === 0 ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60px", fontSize: "12px", fontStyle: "italic", color: "var(--theme-elevation-350)" }}>
              {isOver ? "Drop here" : "Empty"}
            </div>
          ) : (
            state.docs.map((tour) => <SortableTourCard key={tour.id} tour={tour} />)
          )}
        </div>
      </SortableContext>

      {state.hasNextPage && (
        <button
          onClick={onLoadMore}
          style={{
            marginTop: "8px",
            width: "100%",
            fontSize: "11px",
            padding: "6px",
            borderRadius: "4px",
            border: "1px solid var(--theme-elevation-150)",
            background: "transparent",
            color: "var(--theme-elevation-500)",
            cursor: "pointer",
          }}
        >
          Load more ({state.docs.length}/{state.totalDocs})
        </button>
      )}
    </div>
  );
}

// ─── Main board ───────────────────────────────────────────────────────────────

export type KanbanProps = {
  initialColumns: Record<WorkflowStatus, PaginatedDocs<Tour>>;
};

export function Kanban({ initialColumns }: KanbanProps) {
  const [columns, setColumns] = useState<Record<WorkflowStatus, ColumnState>>(
    () => ({ ...initialColumns }),
  );
  const [activeTour, setActiveTour] = useState<Tour | null>(null);
  const [overColumn, setOverColumn] = useState<WorkflowStatus | null>(null);

  const isDragging = useRef(false);
  const sourceCol = useRef<WorkflowStatus | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const handleLoadMore = useCallback(
    async (status: WorkflowStatus) => {
      const nextPage = (columns[status].page ?? 1) + 1;
      const result = await fetchMoreTours(status, nextPage);
      setColumns((prev) => ({
        ...prev,
        [status]: { ...result, docs: [...prev[status].docs, ...result.docs] },
      }));
    },
    [columns],
  );

  const handleDragStart = useCallback(({ active }: DragStartEvent) => {
    isDragging.current = true;
    setColumns((prev) => {
      for (const col of COLUMNS) {
        const tour = prev[col.id].docs.find((t) => t.id === active.id);
        if (tour) {
          sourceCol.current = col.id;
          setActiveTour(tour);
          break;
        }
      }
      return prev;
    });
  }, []);

  const handleDragOver = useCallback(({ over }: DragOverEvent) => {
    if (!isDragging.current || !over) {
      setOverColumn(null);
      return;
    }
    setColumns((prev) => {
      const col = resolveColumn(over.id as string | number, prev);
      setOverColumn(col !== sourceCol.current ? col : null);
      return prev;
    });
  }, []);

  const handleDragEnd = useCallback(({ active, over }: DragEndEvent) => {
    isDragging.current = false;
    setActiveTour(null);
    setOverColumn(null);

    const draggedId = active.id as number;
    const from = sourceCol.current;
    sourceCol.current = null;

    if (!over || !from) return;

    const overId = over.id as string | number;

    setColumns((prev) => {
      const to = resolveColumn(overId, prev);
      if (!to) return prev;

      if (from === to) {
        // Within-column reorder
        if (isColumnId(overId)) return prev;
        const docs = prev[from].docs;
        const oldIdx = docs.findIndex((t) => t.id === draggedId);
        const newIdx = docs.findIndex((t) => t.id === overId);
        if (oldIdx < 0 || newIdx < 0 || oldIdx === newIdx) return prev;
        return { ...prev, [from]: { ...prev[from], docs: arrayMove(docs, oldIdx, newIdx) } };
      } else {
        // Cross-column move — update workflowStatus
        const tour = prev[from].docs.find((t) => t.id === draggedId);
        if (!tour) return prev;

        const newFromDocs = prev[from].docs.filter((t) => t.id !== draggedId);
        const toDocs = [...prev[to].docs];
        const overIdx = isColumnId(overId) ? toDocs.length : toDocs.findIndex((t) => t.id === overId);
        const insertIdx = overIdx >= 0 ? overIdx : toDocs.length;
        toDocs.splice(insertIdx, 0, { ...tour, workflowStatus: to });

        updateTour(draggedId, { workflowStatus: to }).catch(console.error);

        return {
          ...prev,
          [from]: { ...prev[from], docs: newFromDocs, totalDocs: prev[from].totalDocs - 1 },
          [to]: { ...prev[to], docs: toDocs, totalDocs: prev[to].totalDocs + 1 },
        };
      }
    });
  }, []);

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <DndContext
        sensors={sensors}
        collisionDetection={(args) => {
          const hits = pointerWithin(args);
          return hits.length > 0 ? hits : closestCorners(args);
        }}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div style={{ display: "flex", gap: "16px", minWidth: "max-content", alignItems: "stretch", paddingBottom: "16px" }}>
          {COLUMNS.map((col) => (
            <KanbanColumn
              key={col.id}
              column={col}
              state={columns[col.id]}
              isOver={activeTour !== null && overColumn === col.id}
              onLoadMore={() => handleLoadMore(col.id)}
            />
          ))}
        </div>

        <DragOverlay dropAnimation={{ duration: 120, easing: "ease" }}>
          {activeTour && (
            <div style={{ transform: "rotate(1deg)", boxShadow: "0 8px 24px rgba(0,0,0,0.2)" }}>
              <TourCard tour={activeTour} />
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
