import type { Metadata } from "next";
import Hero from "@/components/Hero";

export const metadata: Metadata = {
  title: "About Us | IronHouse Builders",
  description:
    "Custom homes and renovations in the Chicago area — new construction, additions, remodeling, garages, roofing, and premium siding.",
};

type ServiceGraphic = keyof typeof SERVICE_GRAPHIC_PATHS;

const SERVICE_GRAPHIC_PATHS = {
  "new-construction": {
    viewBox: "0 0 24 24",
    paths: [
      "M3 12l9-7 9 7M4 10v10a1 1 0 001 1h3v-6h6v6h3a1 1 0 001-1V10M9 21h6",
    ],
  },
  remodeling: {
    viewBox: "0 0 24 24",
    paths: [
      "M4 7h3l2-3h6l2 3h3v12a2 2 0 01-2 2H6a2 2 0 01-2-2V7z",
      "M9 12h6M9 16h4",
    ],
  },
  "second-story": {
    viewBox: "0 0 24 24",
    paths: [
      "M4 21V10M4 21h16M4 21V10l8-5 8 5v11M9 21v-4h6v4",
      "M12 3v3M12 6l3-2M12 6L9 4",
    ],
  },
  garage: {
    viewBox: "0 0 24 24",
    paths: [
      "M4 21V8l8-4 8 4v13M4 21h16",
      "M10 16v5M14 16v5M8 11h8",
    ],
  },
  roofing: {
    viewBox: "0 0 24 24",
    paths: [
      "M2 12l10-7 10 7M4 10v10a1 1 0 001 1h4v-5h6v5h4a1 1 0 001-1V10",
      "M2 12h20",
    ],
  },
  siding: {
    viewBox: "0 0 24 24",
    paths: [
      "M4 4h16v16H4z",
      "M8 4v16M12 4v16M16 4v16",
      "M4 8h16M4 12h16M4 16h16",
    ],
  },
} as const;

function ServiceIcon({ type }: { type: ServiceGraphic }) {
  const spec = SERVICE_GRAPHIC_PATHS[type];
  return (
    <svg
      className="h-7 w-7 text-brand-dark"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox={spec.viewBox}
      aria-hidden
    >
      {spec.paths.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

const services: ReadonlyArray<{
  title: string;
  description: string;
  graphic: ServiceGraphic;
}> = [
  {
    graphic: "new-construction",
    title: "New Construction",
    description:
      "Build the home you’ve always envisioned with a fully customized new construction experience. From architectural planning and design to construction and finishing touches, we create modern custom homes built around your lifestyle, needs, and future.",
  },
  {
    graphic: "remodeling",
    title: "Complete Remodeling",
    description:
      "Transform your current home into a space that feels brand new. Whether it’s a whole-home renovation, kitchen remodel, basement finishing, or interior redesign, we deliver high-quality remodeling solutions tailored to your vision.",
  },
  {
    graphic: "second-story",
    title: "Second Story Additions",
    description:
      "Need more space without leaving the neighborhood you love? Our second story additions are designed to seamlessly blend with your existing home while adding valuable living space, functionality, and long-term value.",
  },
  {
    graphic: "garage",
    title: "Garages",
    description:
      "From attached garages to custom detached structures, we build garages that combine durability, functionality, and design. Whether you need additional storage, workspace, or vehicle protection, we create solutions built to fit your property and lifestyle.",
  },
  {
    graphic: "roofing",
    title: "Roofing",
    description:
      "Protect your investment with professional roofing services designed for long-lasting performance and curb appeal. We provide expert roof installation and replacement using quality materials built to withstand Chicago’s changing weather conditions.",
  },
  {
    graphic: "siding",
    title: "James Hardie and LP Siding",
    description:
      "Enhance the beauty, durability, and efficiency of your home with premium James Hardie and LP siding solutions. We install high-performance siding products that offer lasting protection, low maintenance, and a modern finished appearance.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Hero
        title="ABOUT US"
        subtitle="Quality custom homes tailored to your lifestyle"
        height="medium"
      />

      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-lg text-gray-700 leading-relaxed space-y-6">
            <p>
              At IRONHOUSE BUILDERS, we build quality custom homes with modern
              designs tailored to your lifestyle. As a trusted home builder in
              the Chicago area, we specialize in creating custom homes from the
              ground up, designed around your unique needs and vision.
            </p>
            <p>
              From new construction to major renovations, we collaborate with
              homeowners every step of the way to ensure your dream home is
              built your way — with craftsmanship, transparency, and attention
              to detail at every stage of the process.
            </p>
          </div>
        </div>
      </section>

      <section
        className="py-16 md:py-20 bg-brand-dark/[0.08] border-t border-brand-dark/10"
        aria-labelledby="our-services-heading"
      >
        <div className="container mx-auto px-4">
          <h2
            id="our-services-heading"
            className="text-3xl md:text-4xl font-bold text-brand-dark text-center mb-12 md:mb-14"
          >
            OUR SERVICES
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
            {services.map((service) => (
              <article
                key={service.title}
                className="rounded-lg border border-gray-200/80 bg-white shadow-sm flex flex-col sm:flex-row gap-4 sm:gap-5 p-5 md:p-6 h-full"
              >
                <div className="flex justify-center sm:justify-start shrink-0">
                  <div
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-brand-dark/10"
                    aria-hidden
                  >
                    <ServiceIcon type={service.graphic} />
                  </div>
                </div>
                <div className="flex min-w-0 flex-col grow">
                  <h3 className="text-lg font-bold text-brand-dark mb-2.5 text-center sm:text-left tracking-tight">
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed grow">
                    {service.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
