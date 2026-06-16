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

type Story = {
  id: number;
  title: string;
  slug: string;
  publishedDate?: string;
  workflowStatus: WorkflowStatus;
  featuredImage?: { id: string; url?: string } | string | null;
  author?: { id: number; email: string; name?: string } | number | null;
};

type ColumnDef = {
  id: WorkflowStatus;
  label: string;
  color: string;
};

type ColumnState = PaginatedDocs<Story>;

// ─── Column definitions ───────────────────────────────────────────────────────

const COLUMNS: ColumnDef[] = [
  { id: "draft", label: "Draft", color: "#6b7280" },
  { id: "in_review", label: "In Review", color: "#f59e0b" },
  { id: "approved", label: "Approved", color: "#3b82f6" },
  { id: "published", label: "Published", color: "#10b981" },
];

// ─── API helpers ──────────────────────────────────────────────────────────────

async function updateStory(
  id: number,
  data: { workflowStatus?: WorkflowStatus },
): Promise<void> {
  await fetch(`/api/stories/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify(data),
  });
}

async function fetchMoreStories(
  status: WorkflowStatus,
  page: number,
): Promise<ColumnState> {
  const params = new URLSearchParams({
    "where[workflowStatus][equals]": status,
    limit: "10",
    page: String(page),
    depth: "1",
  });
  const res = await fetch(`/api/stories?${params}`, { credentials: "same-origin" });
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
    if (columns[col.id].docs.some((s) => s.id === overId)) return col.id;
  }
  return null;
}

function getAuthorName(author: Story["author"]): string {
  if (!author) return "—";
  if (typeof author === "number") return `#${author}`;
  return author.name || author.email || `#${author.id}`;
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

// ─── Story card ────────────────────────────────────────────────────────────────

function StoryCard({
  story,
  isDragging = false,
  listeners,
  attributes,
  setNodeRef,
  style,
}: {
  story: Story;
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
          {story.title}
        </p>
        <span
          title={story.featuredImage ? "Has featured image" : "Missing featured image"}
          style={{ fontSize: "14px", flexShrink: 0 }}
        >
          {story.featuredImage ? "🖼" : "⚠️"}
        </span>
      </div>

      <div style={{ fontSize: "11px", color: "var(--theme-elevation-500)" }}>
        {getAuthorName(story.author)}
        {story.publishedDate && ` · ${formatDate(story.publishedDate)}`}
      </div>

      <Link
        href={`/admin/collections/stories/${story.id}`}
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        style={{ fontSize: "11px", color: "var(--theme-text)", textDecoration: "underline", alignSelf: "flex-end" }}
      >
        Edit →
      </Link>
    </div>
  );
}

// ─── Sortable wrapper ─────────────────────────────────────────────────────────

function SortableStoryCard({ story }: { story: Story }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: story.id,
    data: { type: "story", story },
  });

  return (
    <StoryCard
      story={story}
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

      <SortableContext items={state.docs.map((s) => s.id)} strategy={verticalListSortingStrategy}>
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
            state.docs.map((story) => <SortableStoryCard key={story.id} story={story} />)
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
  initialColumns: Record<WorkflowStatus, PaginatedDocs<Story>>;
};

export function Kanban({ initialColumns }: KanbanProps) {
  const [columns, setColumns] = useState<Record<WorkflowStatus, ColumnState>>(
    () => ({ ...initialColumns }),
  );
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [overColumn, setOverColumn] = useState<WorkflowStatus | null>(null);

  const isDragging = useRef(false);
  const sourceCol = useRef<WorkflowStatus | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const handleLoadMore = useCallback(
    async (status: WorkflowStatus) => {
      const nextPage = (columns[status].page ?? 1) + 1;
      const result = await fetchMoreStories(status, nextPage);
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
        const story = prev[col.id].docs.find((s) => s.id === active.id);
        if (story) {
          sourceCol.current = col.id;
          setActiveStory(story);
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
    setActiveStory(null);
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
        if (isColumnId(overId)) return prev;
        const docs = prev[from].docs;
        const oldIdx = docs.findIndex((s) => s.id === draggedId);
        const newIdx = docs.findIndex((s) => s.id === overId);
        if (oldIdx < 0 || newIdx < 0 || oldIdx === newIdx) return prev;
        return { ...prev, [from]: { ...prev[from], docs: arrayMove(docs, oldIdx, newIdx) } };
      } else {
        const story = prev[from].docs.find((s) => s.id === draggedId);
        if (!story) return prev;

        const newFromDocs = prev[from].docs.filter((s) => s.id !== draggedId);
        const toDocs = [...prev[to].docs];
        const overIdx = isColumnId(overId) ? toDocs.length : toDocs.findIndex((s) => s.id === overId);
        const insertIdx = overIdx >= 0 ? overIdx : toDocs.length;
        toDocs.splice(insertIdx, 0, { ...story, workflowStatus: to });

        updateStory(draggedId, { workflowStatus: to }).catch(console.error);

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
              isOver={activeStory !== null && overColumn === col.id}
              onLoadMore={() => handleLoadMore(col.id)}
            />
          ))}
        </div>

        <DragOverlay dropAnimation={{ duration: 120, easing: "ease" }}>
          {activeStory && (
            <div style={{ transform: "rotate(1deg)", boxShadow: "0 8px 24px rgba(0,0,0,0.2)" }}>
              <StoryCard story={activeStory} />
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
