import { notFound } from "next/navigation";
import { getProjectBySlug, getAllProjectSlugs } from "@/lib/projects";
import ProjectGallery from "@/components/ProjectGallery";
import Link from "next/link";

export const dynamicParams = true;
export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs();
  return slugs.map((slug) => ({
    "project-name": slug,
  }));
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ "project-name": string }>;
}) {
  const { "project-name": slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const statusClass =
    project.status === "completed"
      ? "text-green-600"
      : project.status === "upcoming"
        ? "text-amber-600"
        : "text-blue-600";

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gray-900 text-white py-20">
        <div className="container mx-auto px-4">
          <Link
            href="/projects"
            className="inline-flex items-center text-gray-300 hover:text-white mb-6 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Projects
          </Link>
          <h1 className="text-5xl font-bold mb-4">{project.title}</h1>
          <p className="text-2xl text-gray-300">{project.address}</p>
        </div>
      </div>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <ProjectGallery
            images={
              project.images.length > 0 ? project.images : [project.thumbnail]
            }
            title={project.title}
          />
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold mb-6">About This Project</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                {project.description}
              </p>

              <h3 className="text-2xl font-bold mb-4">Features</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {project.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg
                      className="w-6 h-6 text-blue-600 mr-2 flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="bg-white rounded-lg shadow-lg p-8 sticky top-24">
                <h3 className="text-2xl font-bold mb-6">Specifications</h3>
                <div className="space-y-4">
                  {project.specs.bedrooms !== undefined && (
                    <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                      <span className="text-gray-600 font-medium">
                        Bedrooms
                      </span>
                      <span className="text-gray-900 font-semibold">
                        {project.specs.bedrooms}
                      </span>
                    </div>
                  )}
                  {project.specs.bathrooms !== undefined && (
                    <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                      <span className="text-gray-600 font-medium">
                        Bathrooms
                      </span>
                      <span className="text-gray-900 font-semibold">
                        {project.specs.bathrooms}
                      </span>
                    </div>
                  )}
                  {project.specs.sqft && (
                    <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                      <span className="text-gray-600 font-medium">
                        Square Feet
                      </span>
                      <span className="text-gray-900 font-semibold">
                        {project.specs.sqft.toLocaleString()}
                      </span>
                    </div>
                  )}
                  {project.specs.lotSize && (
                    <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                      <span className="text-gray-600 font-medium">
                        Lot Size
                      </span>
                      <span className="text-gray-900 font-semibold">
                        {project.specs.lotSize}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                    <span className="text-gray-600 font-medium">Year</span>
                    <span className="text-gray-900 font-semibold">
                      {project.year}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Status</span>
                    <span className={`font-semibold capitalize ${statusClass}`}>
                      {project.status.replace("-", " ")}
                    </span>
                  </div>
                </div>

                <div className="mt-8">
                  <Link
                    href="/contact"
                    className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    Inquire About This Project
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
