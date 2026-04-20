import HomePageContent from "@/components/HomePageContent";
import { getAllProjects } from "@/lib/projects";

export default async function HomePage() {
  const all = await getAllProjects();
  const featured = all.slice(0, 3);

  return <HomePageContent projects={featured} />;
}
