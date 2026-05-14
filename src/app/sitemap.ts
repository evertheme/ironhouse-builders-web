import type { MetadataRoute } from "next";
import { getAllProjectSlugs } from "@/lib/projects";

const BASE_URL = "https://ironhousebuilders.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getAllProjectSlugs();

  const projectEntries: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${BASE_URL}/projects/${slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    {
      url: BASE_URL,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/about`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/projects`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/contact`,
      changeFrequency: "yearly",
      priority: 0.6,
    },
    ...projectEntries,
  ];
}
