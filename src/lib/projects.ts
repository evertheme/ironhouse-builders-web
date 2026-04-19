export interface Project {
  id: number;
  title: string;
  slug: string;
  address: string;
  description: string;
  thumbnail: string;
  images: string[];
  year: number;
  status: "completed" | "in-progress";
  specs: {
    bedrooms?: number;
    bathrooms?: number;
    sqft?: number;
    lotSize?: string;
  };
  features: string[];
}

const projects: Project[] = [
  {
    id: 1,
    title: "Ridgecrest Residence",
    slug: "ridgecrest-residence",
    address: "1234 Ridgecrest Drive",
    description:
      "A stunning modern home featuring open-concept living spaces, floor-to-ceiling windows, and premium finishes throughout. This custom-built residence showcases contemporary architecture while maintaining warmth and livability.",
    thumbnail:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&h=800&fit=crop",
    ],
    year: 2024,
    status: "completed",
    specs: {
      bedrooms: 4,
      bathrooms: 3.5,
      sqft: 3200,
      lotSize: "0.5 acres",
    },
    features: [
      "Gourmet kitchen with custom cabinetry",
      "Master suite with spa-like bathroom",
      "Smart home technology",
      "Energy-efficient design",
      "Hardwood floors throughout",
      "Two-car garage",
      "Covered outdoor living space",
      "Professional landscaping",
    ],
  },
  {
    id: 2,
    title: "Oakmont Estate",
    slug: "oakmont-estate",
    address: "5678 Oakmont Boulevard",
    description:
      "An elegant estate home that blends traditional charm with modern amenities. Featuring expansive living areas, a chef's kitchen, and luxurious outdoor entertaining spaces.",
    thumbnail:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=800&fit=crop",
    ],
    year: 2023,
    status: "completed",
    specs: {
      bedrooms: 5,
      bathrooms: 4,
      sqft: 4500,
      lotSize: "1.2 acres",
    },
    features: [
      "Grand two-story foyer",
      "Wine cellar",
      "Home theater",
      "Outdoor kitchen and pool",
      "Guest suite",
      "Three-car garage",
      "Custom millwork",
      "Premium appliances",
    ],
  },
  {
    id: 3,
    title: "Sunset Villa",
    slug: "sunset-villa",
    address: "9012 Sunset Lane",
    description:
      "Currently under construction, this contemporary villa features clean lines, abundant natural light, and seamless indoor-outdoor living. Completion expected in Spring 2025.",
    thumbnail:
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&h=800&fit=crop",
    ],
    year: 2025,
    status: "in-progress",
    specs: {
      bedrooms: 4,
      bathrooms: 3,
      sqft: 3800,
      lotSize: "0.75 acres",
    },
    features: [
      "Floor-to-ceiling windows",
      "Open-concept design",
      "Rooftop deck",
      "Solar panels",
      "Geothermal heating/cooling",
      "Smart home integration",
      "Minimalist design",
      "Sustainable materials",
    ],
  },
];

export function getAllProjects(): Project[] {
  return projects;
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
