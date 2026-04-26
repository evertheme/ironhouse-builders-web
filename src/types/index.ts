export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  read_at: string | null;
  archived: boolean;
  created_at: string;
}

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
