"use client";

import { createProject, updateProject, uploadProjectImage } from "@/app/admin/projects/actions";
import { sanitizeSlugForStorage } from "@/lib/supabase/project-images";
import type { Project } from "@/types";
import Link from "next/link";
import { useActionState, useRef, useState } from "react";

const IMAGE_ACCEPT = "image/jpeg,image/jpg,image/png,image/webp,image/gif,image/svg+xml";

export default function ProjectForm({ project }: { project?: Project }) {
  const isEdit = Boolean(project);
  const action = isEdit ? updateProject : createProject;
  const [state, formAction, pending] = useActionState(action, null);

  const [slug, setSlug] = useState(project?.slug ?? "");
  const [thumbnail, setThumbnail] = useState(project?.thumbnail ?? "");
  const [imagesText, setImagesText] = useState(
    project?.images?.join("\n") ?? "",
  );
  const [uploadBusy, setUploadBusy] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const thumbInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  async function runUpload(file: File) {
    setUploadError(null);
    const fd = new FormData();
    fd.set("file", file);
    fd.set("slug", slug);
    const res = await uploadProjectImage(fd);
    if (!res.ok) {
      setUploadError(res.error);
      return null;
    }
    return res.url;
  }

  async function onThumbnailFiles(files: FileList | null) {
    if (!files?.length) return;
    const file = files[0];
    if (!file) return;
    setUploadBusy(true);
    const url = await runUpload(file);
    setUploadBusy(false);
    thumbInputRef.current && (thumbInputRef.current.value = "");
    if (url) setThumbnail(url);
  }

  async function onGalleryFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploadBusy(true);
    setUploadError(null);
    const urls: string[] = [];
    for (const file of Array.from(files)) {
      const url = await runUpload(file);
      if (url) urls.push(url);
    }
    setUploadBusy(false);
    galleryInputRef.current && (galleryInputRef.current.value = "");
    if (urls.length) {
      setImagesText((prev) => {
        const base = prev.trim();
        const joiner = base ? "\n" : "";
        return `${base}${joiner}${urls.join("\n")}`;
      });
    }
  }

  const folderHint = sanitizeSlugForStorage(slug) || "draft";

  return (
    <form action={formAction} className="max-w-3xl space-y-6">
      {state?.error && (
        <p className="rounded-lg bg-red-50 text-red-700 px-4 py-3 text-sm">
          {state.error}
        </p>
      )}
      {uploadError && (
        <p className="rounded-lg bg-amber-50 text-amber-900 px-4 py-3 text-sm">
          {uploadError}
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
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="ridgecrest-residence"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
          />
          <p className="mt-1 text-xs text-slate-500">
            Uploaded files are stored under{" "}
            <code className="rounded bg-slate-100 px-1">project-images/{folderHint}/</code>
          </p>
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
        <div className="sm:col-span-2 space-y-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Thumbnail (URL or upload)
          </label>
          <input
            name="thumbnail"
            required
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
            placeholder="https://… or upload an image"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
          />
          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={thumbInputRef}
              type="file"
              accept={IMAGE_ACCEPT}
              className="hidden"
              id="thumb-upload"
              disabled={uploadBusy || pending}
              onChange={(e) => void onThumbnailFiles(e.target.files)}
            />
            <label
              htmlFor="thumb-upload"
              className={`inline-flex cursor-pointer rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 ${
                uploadBusy || pending ? "pointer-events-none opacity-50" : ""
              }`}
            >
              {uploadBusy ? "Uploading…" : "Upload thumbnail"}
            </label>
          </div>
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

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Gallery images (URLs, one per line — or upload files)
        </label>
        <textarea
          name="images_text"
          rows={6}
          value={imagesText}
          onChange={(e) => setImagesText(e.target.value)}
          placeholder="https://…"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm text-slate-900"
        />
        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={galleryInputRef}
            type="file"
            accept={IMAGE_ACCEPT}
            multiple
            className="hidden"
            id="gallery-upload"
            disabled={uploadBusy || pending}
            onChange={(e) => void onGalleryFiles(e.target.files)}
          />
          <label
            htmlFor="gallery-upload"
            className={`inline-flex cursor-pointer rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 ${
              uploadBusy || pending ? "pointer-events-none opacity-50" : ""
            }`}
          >
            {uploadBusy ? "Uploading…" : "Upload gallery images"}
          </label>
          <span className="text-xs text-slate-500">
            Stored in Supabase Storage; public URLs are appended to the list.
          </span>
        </div>
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
          disabled={pending || uploadBusy}
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
