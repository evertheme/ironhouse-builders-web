import { collectContactNotificationRecipients } from "@/lib/contact-notification-recipients";
import { sendContactNotification } from "@/lib/contact-notifications";
import { createServiceRoleClient } from "@/lib/supabase/admin";

const MAX_NAME = 200;
const MAX_EMAIL = 320;
const MAX_PHONE = 50;
const MAX_MESSAGE = 10_000;

function badRequest(message: string) {
  return Response.json({ error: message }, { status: 400 });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON");
  }

  if (!body || typeof body !== "object") {
    return badRequest("Invalid body");
  }

  const b = body as Record<string, unknown>;
  const name = String(b.name ?? "").trim();
  const email = String(b.email ?? "").trim();
  const phoneRaw = b.phone != null && b.phone !== "" ? String(b.phone).trim() : "";
  const phone = phoneRaw || null;
  const message = String(b.message ?? "").trim();

  if (!name || !email || !message) {
    return badRequest("Name, email, and message are required.");
  }
  if (name.length > MAX_NAME) {
    return badRequest("Name is too long.");
  }
  if (email.length > MAX_EMAIL) {
    return badRequest("Email is too long.");
  }
  if (phone && phone.length > MAX_PHONE) {
    return badRequest("Phone is too long.");
  }
  if (message.length > MAX_MESSAGE) {
    return badRequest("Message is too long.");
  }

  const admin = createServiceRoleClient();
  if (!admin) {
    console.error("[contact] Missing Supabase URL or SUPABASE_SERVICE_ROLE_KEY");
    return Response.json({ error: "Server misconfigured" }, { status: 503 });
  }

  const { error: insertError } = await admin.from("contact_messages").insert({
    name,
    email,
    phone,
    message,
  });

  if (insertError) {
    console.error("[contact] Insert error:", insertError);
    return Response.json({ error: "Failed to save message" }, { status: 500 });
  }

  const from = process.env.CONTACT_NOTIFICATION_FROM?.trim();
  if (!from) {
    console.warn("[contact] CONTACT_NOTIFICATION_FROM missing; skipping email");
  } else {
    const recipients = await collectContactNotificationRecipients(admin);
    if (recipients.length === 0) {
      console.warn(
        "[contact] No notification recipients. Set CONTACT_NOTIFICATION_TO and/or ensure Supabase Auth users have emails.",
      );
    }
    const emailResult = await sendContactNotification({
      from,
      recipients,
      payload: { name, email, phone, message },
    });
    if (!emailResult.sent && emailResult.reason) {
      console.warn("[contact] Notification email not sent:", emailResult.reason);
    }
  }

  return Response.json({ ok: true });
}
