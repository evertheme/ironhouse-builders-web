import { signOutAdmin } from "@/app/admin/auth-actions";
import Link from "next/link";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
          <nav className="flex items-center gap-6">
            <Link
              href="/admin/projects"
              className="font-semibold text-slate-900 hover:text-blue-600"
            >
              Projects
            </Link>
            <Link
              href="/admin/projects/new"
              className="text-sm text-slate-600 hover:text-blue-600"
            >
              New project
            </Link>
            <Link href="/" className="text-sm text-slate-500 hover:text-blue-600">
              View site
            </Link>
          </nav>
          <form action={signOutAdmin}>
            <button
              type="submit"
              className="text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>
      <div className="container mx-auto px-4 py-8 max-w-6xl">{children}</div>
    </div>
  );
}
