import { moveProject, seedDefaultProjects } from "@/app/admin/projects/actions";
import DeleteProjectForm from "./delete-project-form";
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
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 text-sm"
            >
              Add project
            </Link>
          ) : (
            <span className="inline-flex items-center justify-center rounded-lg bg-slate-200 text-slate-500 font-semibold px-4 py-2 text-sm cursor-not-allowed">
              Add project
            </span>
          )}
          <form action={seedDefaultProjects}>
            <button
              type="submit"
              disabled={!tableReady}
              className="rounded-lg border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none text-slate-800 font-medium px-4 py-2 text-sm"
            >
              Seed default projects
            </button>
          </form>
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
                Run <strong>Seed default projects</strong> to load the three sample
                homes, or add a project manually.
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row, index) => (
                <tr key={row.id} className="hover:bg-slate-50/80">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <form action={moveProject}>
                        <input type="hidden" name="id" value={row.id} />
                        <input type="hidden" name="direction" value="up" />
                        <button
                          type="submit"
                          disabled={index === 0}
                          className="rounded border border-slate-200 px-2 py-1 text-xs disabled:opacity-40 hover:bg-slate-100"
                          title="Move up"
                        >
                          ↑
                        </button>
                      </form>
                      <form action={moveProject}>
                        <input type="hidden" name="id" value={row.id} />
                        <input type="hidden" name="direction" value="down" />
                        <button
                          type="submit"
                          disabled={index === rows.length - 1}
                          className="rounded border border-slate-200 px-2 py-1 text-xs disabled:opacity-40 hover:bg-slate-100"
                          title="Move down"
                        >
                          ↓
                        </button>
                      </form>
                      <span className="text-slate-400 text-xs ml-1">
                        {row.sort_order}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {row.title}
                  </td>
                  <td className="px-4 py-3 text-slate-600 font-mono text-xs">
                    {row.slug}
                  </td>
                  <td className="px-4 py-3 capitalize text-slate-600">
                    {row.status.replace("-", " ")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex flex-wrap justify-end gap-2">
                      <a
                        href={`/projects/${row.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-xs font-medium"
                      >
                        Preview
                      </a>
                      <Link
                        href={`/admin/projects/${row.id}/edit`}
                        className="text-blue-600 hover:underline text-xs font-medium"
                      >
                        Edit
                      </Link>
                      <DeleteProjectForm id={row.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
