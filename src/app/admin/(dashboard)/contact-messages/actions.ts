"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    redirect("/admin");
  }
  return { supabase };
}

export async function markContactMessageRead(id: string) {
  const { supabase } = await requireUser();
  const { error } = await supabase
    .from("contact_messages")
    .update({ read_at: new Date().toISOString() })
    .eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
  revalidatePath("/admin/contact-messages");
}

export async function markContactMessageUnread(id: string) {
  const { supabase } = await requireUser();
  const { error } = await supabase
    .from("contact_messages")
    .update({ read_at: null })
    .eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
  revalidatePath("/admin/contact-messages");
}

export async function setContactMessageArchived(id: string, archived: boolean) {
  const { supabase } = await requireUser();
  const { error } = await supabase
    .from("contact_messages")
    .update({ archived })
    .eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
  revalidatePath("/admin/contact-messages");
}

export async function deleteContactMessage(id: string) {
  const { supabase } = await requireUser();
  const { error } = await supabase.from("contact_messages").delete().eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
  revalidatePath("/admin/contact-messages");
}
