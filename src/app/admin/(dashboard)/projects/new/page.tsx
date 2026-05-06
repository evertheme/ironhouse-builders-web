import ProjectForm from "../project-form";

export default function NewProjectPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-2">New project</h1>
      <p className="text-slate-600 mb-8">
        The page address is generated from the project title (for example{" "}
        <code className="text-sm bg-slate-100 px-1 rounded">/projects/my-project-title</code>
        ).
      </p>
      <ProjectForm />
    </div>
  );
}
