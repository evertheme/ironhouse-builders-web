import ProjectForm from "../../project-form";
import { getProjectById } from "@/lib/projects";
import { notFound } from "next/navigation";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Edit project</h1>
      <p className="text-slate-600 mb-8">Update fields and save.</p>
      <ProjectForm project={project} />
    </div>
  );
}
