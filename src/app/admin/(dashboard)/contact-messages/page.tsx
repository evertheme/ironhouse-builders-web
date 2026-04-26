import ContactMessagesTable from "./contact-messages-table";
import { createClient } from "@/lib/supabase/server";
import type { ContactMessage } from "@/types";
import { redirect } from "next/navigation";

export default async function AdminContactMessagesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/admin");
  }

  const { data: rows, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Contact messages</h1>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-900">
          <p className="font-medium">Could not load contact messages.</p>
          <p className="text-sm mt-2">
            Apply the migration{" "}
            <code className="text-xs bg-white/80 px-1 rounded">
              supabase/migrations/20250426120000_contact_messages.sql
            </code>{" "}
            in the Supabase SQL editor if you have not already.
          </p>
          <pre className="mt-3 text-xs overflow-auto text-red-800">{error.message}</pre>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Contact messages</h1>
        <p className="text-slate-600 mt-1">
          Submissions from the public contact form. Mark read, archive, or delete.
        </p>
      </div>
      <ContactMessagesTable rows={(rows ?? []) as ContactMessage[]} />
    </div>
  );
}
