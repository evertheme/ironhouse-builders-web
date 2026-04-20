"use client";

import { createProject, updateProject } from "@/app/admin/projects/actions";
import type { Project } from "@/types";
import Link from "next/link";
import { useActionState } from "react";

export default function ProjectForm({ project }: { project?: Project }) {
  const isEdit = Boolean(project);
  const action = isEdit ? updateProject : createProject;
  const [state, formAction, pending] = useActionState(action, null);

  return (
    <form action={formAction} className="max-w-3xl space-y-6">
      {state?.error && (
        <p className="rounded-lg bg-red-50 text-red-700 px-4 py-3 text-sm">
          {state.error}
        </p>
      )}

      {isEdit && project && (
        <input type="hidden" name="id" value={project.id} />
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Slug (URL)
          </label>
          <input
            name="slug"
            required
            defaultValue={project?.slug}
            placeholder="ridgecrest-residence"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Title
          </label>
          <input
            name="title"
            required
            defaultValue={project?.title}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Address
          </label>
          <input
            name="address"
            required
            defaultValue={project?.address}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            required
            rows={5}
            defaultValue={project?.description}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Thumbnail URL
          </label>
          <input
            name="thumbnail"
            required
            defaultValue={project?.thumbnail}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Year
          </label>
          <input
            name="year"
            type="number"
            required
            defaultValue={project?.year}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Status
          </label>
          <select
            name="status"
            required
            defaultValue={project?.status ?? "completed"}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
          >
            <option value="completed">Completed</option>
            <option value="in-progress">In progress</option>
            <option value="upcoming">Upcoming</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Image URLs (one per line)
        </label>
        <textarea
          name="images_text"
          rows={5}
          defaultValue={project?.images?.join("\n") ?? ""}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm text-slate-900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Features (one per line)
        </label>
        <textarea
          name="features_text"
          rows={6}
          defaultValue={project?.features?.join("\n") ?? ""}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
        />
      </div>

      <fieldset className="rounded-lg border border-slate-200 p-4 space-y-3">
        <legend className="text-sm font-semibold text-slate-800 px-1">
          Specifications
        </legend>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Bedrooms
            </label>
            <input
              name="bedrooms"
              type="number"
              step="any"
              defaultValue={project?.specs.bedrooms ?? ""}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Bathrooms
            </label>
            <input
              name="bathrooms"
              type="number"
              step="any"
              defaultValue={project?.specs.bathrooms ?? ""}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Sq ft
            </label>
            <input
              name="sqft"
              type="number"
              defaultValue={project?.specs.sqft ?? ""}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Lot size
            </label>
            <input
              name="lotSize"
              defaultValue={project?.specs.lotSize ?? ""}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
            />
          </div>
        </div>
      </fieldset>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold px-6 py-2.5"
        >
          {pending ? "Saving…" : isEdit ? "Save changes" : "Create project"}
        </button>
        <Link
          href="/admin/projects"
          className="rounded-lg border border-slate-300 px-6 py-2.5 font-medium text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
