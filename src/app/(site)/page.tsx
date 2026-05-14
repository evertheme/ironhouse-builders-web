import type { Metadata } from "next";
import HomePageContent from "@/components/HomePageContent";
import { getAllProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "IronHouse Builders | Chicago Custom Home Builder",
  description:
    "IronHouse Builders crafts exceptional custom homes, additions, and renovations across the Chicago area. New construction, remodeling, roofing, and premium siding.",
  openGraph: {
    title: "IronHouse Builders | Chicago Custom Home Builder",
    description:
      "IronHouse Builders crafts exceptional custom homes, additions, and renovations across the Chicago area.",
    url: "https://ironhousebuilders.com",
  },
};

export default async function HomePage() {
  const all = await getAllProjects();
  const featured = all.slice(0, 3);

  return <HomePageContent projects={featured} />;
}
