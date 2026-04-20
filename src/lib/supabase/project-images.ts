/** Must match `storage.buckets.id` in Supabase (see migrations). */
export const PROJECT_IMAGES_BUCKET = "project-images";

/** Safe path prefix for storage object keys. */
export function sanitizeSlugForStorage(slug: string): string {
  const s = slug
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return s || "draft";
}
