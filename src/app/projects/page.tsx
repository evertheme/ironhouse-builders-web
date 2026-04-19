"use client";

import Hero from "@/components/Hero";
import ProjectCard from "@/components/ProjectCard";
import { getAllProjects } from "@/lib/projects";
import { useState } from "react";

export default function ProjectsPage() {
  const allProjects = getAllProjects();
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
          {/* Filter Buttons */}
          <div className="flex justify-center gap-4 mb-12 flex-wrap">
            <button
              onClick={() => setFilter("all")}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                filter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              All Projects
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                filter === "completed"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setFilter("in-progress")}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                filter === "in-progress"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              In Progress
            </button>
          </div>

          {/* Projects Grid */}
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
