export type ProjectImage = {
  src: string;
  alt: string;
};

export interface Project {
  id: string;
  slug: string;
  title: string;
  address: string;
  summary: string;
  description: string;
  status: "completed" | "in-progress" | "upcoming";
  year: number;
  images: ProjectImage[];
  thumbnail: string;
  features: string[];
  specs: {
    bedrooms?: number;
    bathrooms?: number;
    sqft?: number;
    lotSize?: string;
  };
}
