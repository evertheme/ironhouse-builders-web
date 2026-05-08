import AdminProjectsSortableTable from "./admin-projects-sortable-table";
import ProjectsDbNotice from "./projects-db-notice";
import { getAdminProjectsBootstrap } from "@/lib/projects";
import Link from "next/link";

export default async function AdminProjectsPage() {
  const bootstrap = await getAdminProjectsBootstrap();
  const rows = bootstrap.status === "ready" ? bootstrap.rows : [];
  const tableReady = bootstrap.status === "ready";

  return (
    <div>
      <ProjectsDbNotice bootstrap={bootstrap} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Projects</h1>
          <p className="text-slate-600 mt-1">
            Manage portfolio entries. Public site reads from this list (order
            by sort order).
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {tableReady ? (
            <Link
              href="/admin/projects/new"
              className="btn-primary inline-flex items-center justify-center px-4 py-2 text-sm"
            >
              Add project
            </Link>
          ) : (
            <span className="inline-flex items-center justify-center rounded-lg bg-slate-200 text-slate-500 font-semibold px-4 py-2 text-sm cursor-not-allowed">
              Add project
            </span>
          )}
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
          {!tableReady ? (
            <p className="text-slate-600">
              Fix the database issue above, then return here to manage projects.
            </p>
          ) : (
            <>
              <p className="text-slate-600 mb-4">No projects yet.</p>
              <p className="text-sm text-slate-500">
                Add a project to get started.
              </p>
            </>
          )}
        </div>
      ) : (
        <AdminProjectsSortableTable rows={rows} />
      )}
    </div>
  );
}
