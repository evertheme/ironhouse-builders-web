"use client";

import Link from "next/link";
import Image from "next/image";
import { Project } from "@/types";
import { motion } from "framer-motion";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/projects/${project.slug}`} className="group block">
        <div className="relative overflow-hidden rounded-lg shadow-lg aspect-[4/3]">
          <Image
            src={project.thumbnail}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
            <p className="text-gray-200">{project.address}</p>
            {project.specs.bedrooms && (
              <div className="mt-3 flex gap-4 text-sm">
                <span>{project.specs.bedrooms} BD</span>
                <span>{project.specs.bathrooms} BA</span>
                <span>{project.specs.sqft?.toLocaleString()} sqft</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
