import type { SupabaseClient } from "@supabase/supabase-js";
import type { User } from "@supabase/supabase-js";

function parseEnvRecipientList(raw: string | undefined): string[] {
  if (!raw?.trim()) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function authUserEmail(u: User): string | undefined {
  if (u.email?.trim()) {
    return u.email.trim();
  }
  for (const identity of u.identities ?? []) {
    const fromData = identity.identity_data as Record<string, unknown> | undefined;
    const addr =
      typeof fromData?.email === "string" ? fromData.email.trim() : "";
    if (addr) {
      return addr;
    }
  }
  return undefined;
}

/**
 * Emails to notify: `CONTACT_NOTIFICATION_TO` (comma-separated) first, then
 * every Supabase Auth user email (paginated). Env addresses are first so you
 * can set a known-good inbox (e.g. Resend test domain only delivers to certain addresses).
 */
export async function collectContactNotificationRecipients(
  admin: SupabaseClient,
): Promise<string[]> {
  const fromEnv = parseEnvRecipientList(process.env.CONTACT_NOTIFICATION_TO);
  const fromAuth = new Set<string>();

  let page = 1;
  const perPage = 200;

  for (;;) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
    if (error) {
      console.warn(
        "[contact] auth.admin.listUsers failed:",
        error.message,
        error.status ?? "",
      );
      break;
    }
    for (const u of data.users) {
      const email = authUserEmail(u);
      if (email) {
        fromAuth.add(email);
      }
    }
    if (data.users.length < perPage) {
      break;
    }
    page += 1;
  }

  return [...new Set([...fromEnv, ...fromAuth])];
}
