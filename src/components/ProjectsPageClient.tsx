"use client";

import Hero from "@/components/Hero";
import ProjectCard from "@/components/ProjectCard";
import type { Project } from "@/types";
import { useState } from "react";

export default function ProjectsPageClient({
  allProjects,
}: {
  allProjects: Project[];
}) {
  const [filter, setFilter] = useState<"all" | "completed" | "in-progress">(
    "all",
  );

  const filteredProjects =
    filter === "all"
      ? allProjects
      : allProjects.filter((p) => p.status === filter);

  return (
    <>
      <Hero
        title="Our Projects"
        subtitle="Explore our portfolio of exceptional homes"
        height="medium"
      />

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-center gap-4 mb-12 flex-wrap">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={
                filter === "all"
                  ? "btn-primary px-6 py-2"
                  : "rounded-lg bg-gray-200 px-6 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-300"
              }
            >
              All Projects
            </button>
            <button
              type="button"
              onClick={() => setFilter("completed")}
              className={
                filter === "completed"
                  ? "btn-primary px-6 py-2"
                  : "rounded-lg bg-gray-200 px-6 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-300"
              }
            >
              Completed
            </button>
            <button
              type="button"
              onClick={() => setFilter("in-progress")}
              className={
                filter === "in-progress"
                  ? "btn-primary px-6 py-2"
                  : "rounded-lg bg-gray-200 px-6 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-300"
              }
            >
              In Progress
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No projects found in this category.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
