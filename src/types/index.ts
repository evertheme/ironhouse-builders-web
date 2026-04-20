export interface Project {
  id: string;
  slug: string;
  title: string;
  address: string;
  description: string;
  status: "completed" | "in-progress" | "upcoming";
  year: number;
  images: string[];
  thumbnail: string;
  features: string[];
  specs: {
    bedrooms?: number;
    bathrooms?: number;
    sqft?: number;
    lotSize?: string;
  };
}
