"use client";

import { deleteProject } from "@/app/admin/projects/actions";

export default function DeleteProjectForm({ id }: { id: string }) {
  return (
    <form
      action={deleteProject.bind(null, id)}
      onSubmit={(e) => {
        if (!confirm("Delete this project? This cannot be undone.")) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="text-red-600 hover:underline text-xs font-medium"
      >
        Delete
      </button>
    </form>
  );
}
