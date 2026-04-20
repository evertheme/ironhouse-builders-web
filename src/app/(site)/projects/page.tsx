import ProjectsPageClient from "@/components/ProjectsPageClient";
import { getAllProjects } from "@/lib/projects";

export default async function ProjectsPage() {
  const allProjects = await getAllProjects();
  return <ProjectsPageClient allProjects={allProjects} />;
}
