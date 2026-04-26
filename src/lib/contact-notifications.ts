import { usPhoneTelHref } from "@/lib/us-phone";
import { Resend } from "resend";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export type ContactNotificationPayload = {
  name: string;
  email: string;
  phone: string | null;
  message: string;
};

export async function sendContactNotification(params: {
  from: string;
  recipients: string[];
  payload: ContactNotificationPayload;
}): Promise<{ sent: boolean; reason?: string }> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    console.warn("[contact] RESEND_API_KEY missing; skipping email");
    return { sent: false, reason: "no_api_key" };
  }

  const uniqueRecipients = [
    ...new Set(params.recipients.map((r) => r.trim()).filter(Boolean)),
  ];

  if (uniqueRecipients.length === 0) {
    console.warn("[contact] No notification recipients; skipping email");
    return { sent: false, reason: "no_recipients" };
  }

  const { name, email, phone, message } = params.payload;
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safePhone = phone ? escapeHtml(phone) : "";
  const phoneTel = phone ? usPhoneTelHref(phone) : null;
  const phoneHtml =
    phone && phoneTel
      ? `<strong>Phone:</strong> <a href="${phoneTel}">${safePhone}</a>`
      : phone
        ? `<strong>Phone:</strong> ${safePhone}`
        : "";
  const safeMessage = escapeHtml(message).replace(/\r\n/g, "\n").replace(/\n/g, "<br/>");

  const html = `
    <p><strong>NEW CONTACT:</strong></p>
    <p><strong>Name:</strong> ${safeName}<br/>
    <strong>Email:</strong> ${safeEmail}<br/>
    ${phoneHtml ? `${phoneHtml}<br/>` : ""}
    </p>
    <p><strong>Message:</strong></p>
    <p>${safeMessage}</p>
  `.trim();

  const [to, ...bccRest] = uniqueRecipients;
  const resend = new Resend(apiKey);

  const { data, error } = await resend.emails.send({
    from: params.from,
    to: [to],
    ...(bccRest.length > 0 ? { bcc: bccRest } : {}),
    replyTo: email,
    subject: `New contact: ${name.slice(0, 100)}`,
    html,
  });

  if (error) {
    console.error(
      "[contact] Resend error:",
      typeof error === "object" ? JSON.stringify(error) : error,
    );
    return { sent: false, reason: "resend_error" };
  }

  if (process.env.NODE_ENV !== "production") {
    console.info("[contact] Resend accepted email", data?.id ?? "");
  }

  return { sent: true };
}
