"use client";

import Hero from "@/components/Hero";
import Link from "next/link";
import { motion } from "framer-motion";
import ProjectCard from "@/components/ProjectCard";
import { getAllProjects } from "@/lib/projects";

export default function HomePage() {
  const projects = getAllProjects().slice(0, 3); // Show only 3 recent projects

  return (
    <>
      <Hero
        title="Building Dreams, Creating Homes"
        subtitle="Quality craftsmanship and exceptional design"
      />

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-bold mb-6"
            >
              Welcome to Iron House Builders
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-600 leading-relaxed"
            >
              We specialize in building exceptional custom homes that combine
              modern design with timeless craftsmanship. Each project is
              tailored to our clients' unique vision, ensuring every detail
              exceeds expectations.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Featured Projects</h2>
            <p className="text-lg text-gray-600">Explore our recent work</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/projects"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              View All Projects
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Build Your Dream Home?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Let's discuss your vision and bring it to life with our expert team.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-white text-gray-900 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors"
          >
            Get In Touch
          </Link>
        </div>
      </section>
    </>
  );
}
