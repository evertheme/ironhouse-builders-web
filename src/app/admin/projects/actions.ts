"use server";

import { createClient } from "@/lib/supabase/server";
import {
  PROJECT_IMAGES_BUCKET,
  sanitizeSlugForStorage,
} from "@/lib/supabase/project-images";
import { SEED_PROJECTS } from "@/lib/project-seed-data";
import { getAllProjectRows } from "@/lib/projects-db";
import type { Project } from "@/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function revalidateProjectPaths(slug?: string) {
  revalidatePath("/");
  revalidatePath("/projects");
  if (slug) {
    revalidatePath(`/projects/${slug}`);
  }
}

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    redirect("/admin");
  }
  return { supabase, user };
}

function lines(text: string): string[] {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

function parseFormToPayload(
  formData: FormData,
  sortOrder: number,
): Record<string, unknown> {
  const slug = String(formData.get("slug") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const thumbnail = String(formData.get("thumbnail") ?? "").trim();
  const year = Number(formData.get("year"));
  const status = String(formData.get("status") ?? "completed").trim();

  if (!slug || !title || !address || !description || !thumbnail) {
    throw new Error("Slug, title, address, description, and thumbnail are required.");
  }
  if (!Number.isFinite(year)) {
    throw new Error("Year must be a number.");
  }
  if (
    status !== "completed" &&
    status !== "in-progress" &&
    status !== "upcoming"
  ) {
    throw new Error("Invalid status.");
  }

  let images = lines(String(formData.get("images_text") ?? ""));
  if (images.length === 0 && thumbnail) {
    images = [thumbnail];
  }
  const features = lines(String(formData.get("features_text") ?? ""));

  const bedroomsRaw = String(formData.get("bedrooms") ?? "").trim();
  const bathroomsRaw = String(formData.get("bathrooms") ?? "").trim();
  const sqftRaw = String(formData.get("sqft") ?? "").trim();
  const lotSize = String(formData.get("lotSize") ?? "").trim();

  const specs: Project["specs"] = {};
  if (bedroomsRaw) {
    const n = Number(bedroomsRaw);
    if (Number.isFinite(n)) specs.bedrooms = n;
  }
  if (bathroomsRaw) {
    const n = Number(bathroomsRaw);
    if (Number.isFinite(n)) specs.bathrooms = n;
  }
  if (sqftRaw) {
    const n = Number(sqftRaw);
    if (Number.isFinite(n)) specs.sqft = n;
  }
  if (lotSize) specs.lotSize = lotSize;

  return {
    sort_order: sortOrder,
    slug,
    title,
    address,
    description,
    thumbnail,
    year,
    status,
    images,
    features,
    specs,
  };
}

export async function createProject(
  _prev: { error?: string } | null,
  formData: FormData,
): Promise<{ error?: string } | null> {
  const { supabase } = await requireUser();

  let payload: Record<string, unknown>;
  try {
    const rows = await getAllProjectRows();
    const maxOrder = rows.length
      ? Math.max(...rows.map((r) => r.sort_order))
      : -1;
    payload = parseFormToPayload(formData, maxOrder + 1);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Something went wrong.";
    return { error: message };
  }

  const { error } = await supabase.from("projects").insert(payload);
  if (error) {
    return { error: error.message };
  }
  const slug = String(payload.slug);
  revalidateProjectPaths(slug);
  revalidatePath("/admin/projects");
  redirect("/admin/projects");
}

export async function updateProject(
  _prev: { error?: string } | null,
  formData: FormData,
): Promise<{ error?: string } | null> {
  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    return { error: "Missing project id." };
  }
  const { supabase } = await requireUser();

  const { data: existing, error: fetchErr } = await supabase
    .from("projects")
    .select("sort_order")
    .eq("id", id)
    .maybeSingle();

  if (fetchErr || !existing) {
    return { error: fetchErr?.message ?? "Project not found." };
  }

  let payload: Record<string, unknown>;
  try {
    const sortOrder =
      typeof existing.sort_order === "number" ? existing.sort_order : 0;
    payload = parseFormToPayload(formData, sortOrder);
    delete (payload as { sort_order?: number }).sort_order;
  } catch (e) {
    const message = e instanceof Error ? e.message : "Something went wrong.";
    return { error: message };
  }

  const { error } = await supabase.from("projects").update(payload).eq("id", id);

  if (error) {
    return { error: error.message };
  }
  const slug = String(payload.slug);
  revalidateProjectPaths(slug);
  revalidatePath("/admin/projects");
  redirect("/admin/projects");
}

export async function deleteProject(id: string) {
  const { supabase } = await requireUser();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
  revalidateProjectPaths();
  revalidatePath("/admin/projects");
  redirect("/admin/projects");
}

export async function seedDefaultProjects(formData: FormData) {
  void formData;
  const { supabase } = await requireUser();
  const upserts = SEED_PROJECTS.map((p, i) => ({
    sort_order: i,
    slug: p.slug,
    title: p.title,
    address: p.address,
    description: p.description,
    thumbnail: p.thumbnail,
    year: p.year,
    status: p.status,
    images: p.images,
    features: p.features,
    specs: p.specs,
  }));

  const { error } = await supabase.from("projects").upsert(upserts, {
    onConflict: "slug",
  });

  if (error) {
    throw new Error(error.message);
  }
  SEED_PROJECTS.forEach((p) => revalidateProjectPaths(p.slug));
  revalidatePath("/admin/projects");
  redirect("/admin/projects");
}

export async function reorderProjects(orderedIds: string[]) {
  const { supabase } = await requireUser();
  if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
    return;
  }

  for (let i = 0; i < orderedIds.length; i++) {
    const id = orderedIds[i]?.trim();
    if (!id) {
      throw new Error("Invalid project id in reorder list.");
    }
    const { error } = await supabase
      .from("projects")
      .update({ sort_order: i })
      .eq("id", id);
    if (error) {
      throw new Error(error.message);
    }
  }

  revalidateProjectPaths();
  revalidatePath("/admin/projects");
}

const MAX_PROJECT_IMAGE_BYTES = 5 * 1024 * 1024;

export async function uploadProjectImage(
  formData: FormData,
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  const { supabase } = await requireUser();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "No file provided." };
  }
  if (file.size > MAX_PROJECT_IMAGE_BYTES) {
    return { ok: false, error: "Image must be 5MB or smaller." };
  }

  const rawSlug = String(formData.get("slug") ?? "");
  const prefix = sanitizeSlugForStorage(rawSlug);

  const ext = (file.name.split(".").pop() || "bin").toLowerCase();
  const safeExt = /^[a-z0-9]{1,8}$/.test(ext) ? ext : "bin";
  const objectName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${safeExt}`;
  const path = `${prefix}/${objectName}`;

  try {
    const { error } = await supabase.storage
      .from(PROJECT_IMAGES_BUCKET)
      .upload(path, file, {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });

    if (error) {
      return { ok: false, error: error.message };
    }

    const { data } = supabase.storage
      .from(PROJECT_IMAGES_BUCKET)
      .getPublicUrl(path);

    if (!data.publicUrl) {
      return {
        ok: false,
        error: "Upload succeeded but public URL was not returned.",
      };
    }

    return { ok: true, url: data.publicUrl };
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Unexpected error during upload.";
    return { ok: false, error: message };
  }
}
