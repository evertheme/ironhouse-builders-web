import { createAnonClient } from "@/lib/supabase/anon";
import type { Project } from "@/types";

export type ProjectRow = {
  id: string;
  sort_order: number;
  slug: string;
  title: string;
  address: string;
  description: string;
  thumbnail: string;
  year: number;
  status: string;
  images: unknown;
  features: unknown;
  specs: unknown;
  created_at: string;
  updated_at: string;
};

const MIGRATION_PATH = "supabase/migrations/20250419120000_projects.sql";

export function isMissingProjectsTableError(error: {
  message: string;
  code?: string;
}): boolean {
  const msg = error.message;
  return (
    error.code === "PGRST205" ||
    msg.includes("schema cache") ||
    /relation ["']?public\.projects["']? does not exist/i.test(msg) ||
    /Could not find the table/i.test(msg)
  );
}

function logProjectsQueryError(context: string, error: { message: string; code?: string }) {
  const msg = error.message;
  console.error(`${context}:`, msg);
  if (isMissingProjectsTableError(error)) {
    console.warn(
      `[Iron House Builders] Create the projects table: open Supabase → SQL Editor, paste and run the file ${MIGRATION_PATH} in this repo, then reload the app. If the table already exists, Dashboard → Settings → API → reload schema cache.`,
    );
  }
}

type FetchAllProjectRowsResult =
  | { ok: true; rows: ProjectRow[] }
  | { ok: false; kind: "no_env" }
  | { ok: false; kind: "missing_table"; message: string }
  | { ok: false; kind: "query"; message: string };

async function fetchAllProjectRowsFromDb(): Promise<FetchAllProjectRowsResult> {
  const supabase = createAnonClient();
  if (!supabase) {
    return { ok: false, kind: "no_env" };
  }

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (!error) {
    return { ok: true, rows: (data ?? []) as ProjectRow[] };
  }

  logProjectsQueryError("getAllProjectRows", error);

  if (isMissingProjectsTableError(error)) {
    return { ok: false, kind: "missing_table", message: error.message };
  }
  return { ok: false, kind: "query", message: error.message };
}

export type AdminProjectsBootstrap =
  | { status: "ready"; rows: ProjectRow[] }
  | { status: "no_env" }
  | { status: "missing_table"; message: string }
  | { status: "query_error"; message: string };

/** Admin UI: distinguish empty table vs missing table vs other errors. */
export async function getAdminProjectsBootstrap(): Promise<AdminProjectsBootstrap> {
  const r = await fetchAllProjectRowsFromDb();
  if (r.ok) return { status: "ready", rows: r.rows };
  if (r.kind === "no_env") return { status: "no_env" };
  if (r.kind === "missing_table") {
    return { status: "missing_table", message: r.message };
  }
  return { status: "query_error", message: r.message };
}

function isProjectStatus(
  value: string,
): value is Project["status"] {
  return (
    value === "completed" ||
    value === "in-progress" ||
    value === "upcoming"
  );
}

function parseStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function parseSpecs(value: unknown): Project["specs"] {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }
  const o = value as Record<string, unknown>;
  const specs: Project["specs"] = {};
  if (typeof o.bedrooms === "number") specs.bedrooms = o.bedrooms;
  if (typeof o.bathrooms === "number") specs.bathrooms = o.bathrooms;
  if (typeof o.sqft === "number") specs.sqft = o.sqft;
  if (typeof o.lotSize === "string") specs.lotSize = o.lotSize;
  return specs;
}

export function mapRowToProject(row: ProjectRow): Project {
  const status = isProjectStatus(row.status) ? row.status : "completed";
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    address: row.address,
    description: row.description,
    thumbnail: row.thumbnail,
    year: row.year,
    status,
    images: parseStringArray(row.images),
    features: parseStringArray(row.features),
    specs: parseSpecs(row.specs),
  };
}

export async function getAllProjectRows(): Promise<ProjectRow[]> {
  const r = await fetchAllProjectRowsFromDb();
  if (r.ok) return r.rows;
  return [];
}

export async function getAllProjects(): Promise<Project[]> {
  const rows = await getAllProjectRows();
  return rows.map(mapRowToProject);
}

export async function getProjectBySlug(
  slug: string,
): Promise<Project | undefined> {
  const supabase = createAnonClient();
  if (!supabase) return undefined;
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    if (error) logProjectsQueryError("getProjectBySlug", error);
    return undefined;
  }
  return mapRowToProject(data as ProjectRow);
}

export async function getProjectById(
  id: string,
): Promise<Project | undefined> {
  const supabase = createAnonClient();
  if (!supabase) return undefined;
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    if (error) logProjectsQueryError("getProjectById", error);
    return undefined;
  }
  return mapRowToProject(data as ProjectRow);
}

/** For `generateStaticParams` (no HTTP request / cookies at build time). */
export async function getAllProjectSlugs(): Promise<string[]> {
  const rows = await getAllProjectRows();
  return rows.map((r) => r.slug);
}
