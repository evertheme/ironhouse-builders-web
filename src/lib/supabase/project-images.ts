/** Must match `storage.buckets.id` in Supabase (see migrations). */
export const PROJECT_IMAGES_BUCKET = "project-images";

function slugifySegment(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Safe path prefix for storage object keys. */
export function sanitizeSlugForStorage(slug: string): string {
  const s = slugifySegment(slug);
  return s || "draft";
}

/** URL slug derived from project title (unique suffix added in server actions if needed). */
export function slugFromProjectTitle(title: string): string {
  const s = slugifySegment(title);
  if (s) return s;
  const id =
    typeof globalThis.crypto?.randomUUID === "function"
      ? globalThis.crypto.randomUUID().slice(0, 8)
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  return `project-${id}`;
}
