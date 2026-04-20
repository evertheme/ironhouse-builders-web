import { createClient } from "@/lib/supabase/server";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import AdminLoginForm from "./login-form";

export default async function AdminEntryPage() {
  const url = getSupabaseUrl();
  const anonKey = getSupabaseAnonKey();

  if (!url || !anonKey) {
    return (
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-xl text-slate-800">
        <h1 className="text-xl font-bold mb-2">Supabase not configured</h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Add{" "}
          <code className="text-xs bg-slate-100 px-1 rounded">
            NEXT_PUBLIC_SUPABASE_URL
          </code>{" "}
          and{" "}
          <code className="text-xs bg-slate-100 px-1 rounded">
            NEXT_PUBLIC_SUPABASE_ANON_KEY
          </code>{" "}
          (or{" "}
          <code className="text-xs bg-slate-100 px-1 rounded">SUPABASE_URL</code>{" "}
          and{" "}
          <code className="text-xs bg-slate-100 px-1 rounded">
            SUPABASE_ANON_KEY
          </code>
          ) to <code className="text-xs bg-slate-100 px-1 rounded">.env.local</code>
          , then restart the dev server.
        </p>
      </div>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/admin/projects");
  }

  return (
    <Suspense
      fallback={
        <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-xl text-slate-600 text-center">
          Loading…
        </div>
      }
    >
      <AdminLoginForm supabaseUrl={url} supabaseAnonKey={anonKey} />
    </Suspense>
  );
}
