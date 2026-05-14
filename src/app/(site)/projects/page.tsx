import type { Metadata } from "next";
import ProjectsPageClient from "@/components/ProjectsPageClient";
import { getAllProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Our Projects",
  description:
    "Browse IronHouse Builders' portfolio of custom homes, remodels, additions, and renovation projects across the Chicago area.",
  openGraph: {
    title: "Our Projects | IronHouse Builders",
    description:
      "Browse IronHouse Builders' portfolio of custom homes, remodels, additions, and renovation projects across the Chicago area.",
    url: "https://ironhousebuilders.com/projects",
  },
};

export default async function ProjectsPage() {
  const allProjects = await getAllProjects();
  return <ProjectsPageClient allProjects={allProjects} />;
}
