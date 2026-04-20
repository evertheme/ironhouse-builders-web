"use server";

import { createClient } from "@/lib/supabase/server";
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

  const images = lines(String(formData.get("images_text") ?? ""));
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

export async function moveProject(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  const direction = String(formData.get("direction") ?? "").trim();
  if (!id || (direction !== "up" && direction !== "down")) {
    return;
  }

  const { supabase } = await requireUser();
  const rows = await getAllProjectRows();
  const idx = rows.findIndex((r) => r.id === id);
  if (idx < 0) return;
  const j = direction === "up" ? idx - 1 : idx + 1;
  if (j < 0 || j >= rows.length) return;

  const a = rows[idx];
  const b = rows[j];
  const orderA = a.sort_order;
  const orderB = b.sort_order;

  const { error: e1 } = await supabase
    .from("projects")
    .update({ sort_order: orderB })
    .eq("id", a.id);
  if (e1) throw new Error(e1.message);

  const { error: e2 } = await supabase
    .from("projects")
    .update({ sort_order: orderA })
    .eq("id", b.id);
  if (e2) throw new Error(e2.message);

  revalidateProjectPaths();
  revalidatePath("/admin/projects");
  redirect("/admin/projects");
}
