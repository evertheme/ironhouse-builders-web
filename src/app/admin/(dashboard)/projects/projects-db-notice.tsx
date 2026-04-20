import type { AdminProjectsBootstrap } from "@/lib/projects";

const MIGRATION_FILE = "supabase/migrations/20250419120000_projects.sql";

export default function ProjectsDbNotice({
  bootstrap,
}: {
  bootstrap: AdminProjectsBootstrap;
}) {
  if (bootstrap.status === "ready") return null;

  if (bootstrap.status === "no_env") {
    return (
      <div
        className="mb-8 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-amber-950"
        role="alert"
      >
        <p className="font-semibold mb-1">Supabase URL or anon key missing</p>
        <p className="text-sm leading-relaxed">
          Add URL and anon key to <code className="text-xs bg-white/80 px-1 rounded">.env.local</code>{" "}
          (see <code className="text-xs bg-white/80 px-1 rounded">src/lib/supabase/env.ts</code>), then
          restart the dev server.
        </p>
      </div>
    );
  }

  if (bootstrap.status === "missing_table") {
    return (
      <div
        className="mb-8 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-950"
        role="alert"
      >
        <p className="font-semibold text-lg mb-2">Database table missing</p>
        <p className="text-sm leading-relaxed mb-4">
          PostgREST cannot see <code className="text-xs bg-white/70 px-1 rounded">public.projects</code>.
          Create it in the <strong>same</strong> Supabase project as your URL/key, then refresh this page.
        </p>
        <ol className="text-sm list-decimal pl-5 space-y-2 mb-4">
          <li>
            Supabase Dashboard → <strong>SQL Editor</strong> → New query.
          </li>
          <li>
            Paste the full contents of{" "}
            <code className="text-xs bg-white/70 px-1 rounded">{MIGRATION_FILE}</code> in this repo →{" "}
            <strong>Run</strong>.
          </li>
          <li>
            If the table already exists but you still see this: Dashboard →{" "}
            <strong>Project Settings</strong> → <strong>API</strong> → restart or reload the API (schema
            cache), or run:{" "}
            <code className="block mt-1 text-xs bg-white/70 px-2 py-1 rounded font-mono">
              NOTIFY pgrst, &apos;reload schema&apos;;
            </code>
          </li>
        </ol>
        <p className="text-xs text-red-900/80 font-mono break-all">
          {bootstrap.message}
        </p>
      </div>
    );
  }

  return (
    <div
      className="mb-8 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-amber-950"
      role="alert"
    >
      <p className="font-semibold mb-1">Could not load projects</p>
      <p className="text-sm font-mono break-all">{bootstrap.message}</p>
    </div>
  );
}
