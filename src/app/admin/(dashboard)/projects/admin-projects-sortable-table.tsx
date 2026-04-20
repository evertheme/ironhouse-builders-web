"use client";

import { reorderProjects } from "@/app/admin/projects/actions";
import DeleteProjectForm from "./delete-project-form";
import type { ProjectRow } from "@/lib/projects";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

function DragHandle(props: React.HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className="inline-flex h-8 w-8 shrink-0 cursor-grab touch-none items-center justify-center rounded border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 active:cursor-grabbing"
      aria-label="Drag to reorder"
      {...props}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden
      >
        <circle cx="9" cy="6" r="1.5" />
        <circle cx="15" cy="6" r="1.5" />
        <circle cx="9" cy="12" r="1.5" />
        <circle cx="15" cy="12" r="1.5" />
        <circle cx="9" cy="18" r="1.5" />
        <circle cx="15" cy="18" r="1.5" />
      </svg>
    </button>
  );
}

function SortableProjectRow({
  row,
  index,
}: {
  row: ProjectRow;
  index: number;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: row.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.55 : 1,
    position: "relative",
    zIndex: isDragging ? 1 : 0,
    background: isDragging ? "rgb(248 250 252)" : undefined,
  };

  return (
    <tr ref={setNodeRef} style={style} className="hover:bg-slate-50/80">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <DragHandle {...attributes} {...listeners} />
          <span className="text-slate-400 text-xs tabular-nums">{index}</span>
        </div>
      </td>
      <td className="px-4 py-3 font-medium text-slate-900">{row.title}</td>
      <td className="px-4 py-3 text-slate-600 font-mono text-xs">{row.slug}</td>
      <td className="px-4 py-3 capitalize text-slate-600">
        {row.status.replace("-", " ")}
      </td>
      <td className="px-4 py-3 text-right">
        <div className="flex flex-wrap justify-end gap-2">
          <a
            href={`/projects/${row.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline text-xs font-medium"
          >
            Preview
          </a>
          <Link
            href={`/admin/projects/${row.id}/edit`}
            className="text-blue-600 hover:underline text-xs font-medium"
          >
            Edit
          </Link>
          <DeleteProjectForm id={row.id} />
        </div>
      </td>
    </tr>
  );
}

export default function AdminProjectsSortableTable({
  rows: initialRows,
}: {
  rows: ProjectRow[];
}) {
  const router = useRouter();
  const [items, setItems] = useState(initialRows);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setItems(initialRows);
  }, [initialRows]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setError(null);
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((r) => r.id === active.id);
    const newIndex = items.findIndex((r) => r.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    const previous = items;
    const next = arrayMove(items, oldIndex, newIndex);
    setItems(next);

    startTransition(async () => {
      try {
        await reorderProjects(next.map((r) => r.id));
        router.refresh();
      } catch (e) {
        setItems(previous);
        setError(e instanceof Error ? e.message : "Reorder failed.");
      }
    });
  }

  const ids = items.map((r) => r.id);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div>
        {error && (
          <p className="mb-3 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
            {error}
          </p>
        )}
        {pending && (
          <p className="mb-3 text-sm text-slate-500">Saving order…</p>
        )}
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 font-medium w-28">Order</th>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <SortableContext
                items={ids}
                strategy={verticalListSortingStrategy}
              >
                {items.map((row, index) => (
                  <SortableProjectRow key={row.id} row={row} index={index} />
                ))}
              </SortableContext>
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Drag the handle in the Order column to change display order on the site.
        </p>
      </div>
    </DndContext>
  );
}
