import ProjectForm from "../project-form";

export default function NewProjectPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-2">New project</h1>
      <p className="text-slate-600 mb-8">
        Slug becomes the public URL:{" "}
        <code className="text-sm bg-slate-100 px-1 rounded">/projects/your-slug</code>
      </p>
      <ProjectForm />
    </div>
  );
}
