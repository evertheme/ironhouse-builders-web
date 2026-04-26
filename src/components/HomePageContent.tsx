'use client';

import Hero from '@/components/Hero';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ProjectCard from '@/components/ProjectCard';
import type { Project } from '@/types';

export default function HomePageContent({ projects }: { projects: Project[] }) {
  return (
    <>
      <Hero />

      <section className='py-20 bg-brand-dark text-white'>
        <div className='container mx-auto px-4'>
          <div className='max-w-3xl mx-auto text-center'>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className='text-4xl font-bold mb-6'
            >
              WELCOME TO IRONHOUSE BUILDERS
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className='text-lg text-white/80 leading-relaxed'
            >
              We specialize in building exceptional custom homes that combine
              modern design with timeless craftsmanship. Each project is
              tailored to our clients&apos; unique vision, ensuring every detail
              exceeds expectations.
            </motion.p>
          </div>
        </div>
      </section>

      <section className='py-20 bg-gray-50'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-12'>
            <h2 className='text-4xl font-bold mb-4'>FEATURED PROJECTS</h2>
            <p className='text-lg text-gray-600'>Explore our recent work</p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12'>
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>

          <div className='text-center'>
            <Link
              href='/projects'
              className='inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors'
            >
              View All Projects
            </Link>
          </div>
        </div>
      </section>

      <section className='py-20 bg-brand-accent text-gray-900'>
        <div className='container mx-auto px-4 text-center'>
          <h2 className='text-4xl font-bold mb-6'>BUILD YOUR DREAM HOME</h2>
          <p className='text-xl text-gray-800 mb-8 max-w-2xl mx-auto'>
            Let&apos;s discuss your vision and bring it to life with our expert
            team.
          </p>
          <Link
            href='/contact'
            className='inline-block bg-white text-gray-900 hover:bg-white/90 font-semibold py-3 px-8 rounded-lg transition-colors shadow-sm'
          >
            Get In Touch
          </Link>
        </div>
      </section>
    </>
  );
}
