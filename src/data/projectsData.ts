export interface CreativeItem {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
}

export interface ReelItem {
  id: string;
  title: string;
  category: string;
  poster: string;
  videoUrl: string;
  views: string;
  duration: string;
}

export interface ProjectData {
  slug: string;
  no: string;
  name: string;
  client: string;
  category: string;
  copy: string;
  fullDescription: string;
  heroImage: string;
  metrics: string[];
  links: {
    website?: string;
    instagram?: string;
    facebook?: string;
  };
  servicesProvided: string[];
  categories: string[];
  creatives: CreativeItem[];
  reels: ReelItem[];
}

export const projectsData: ProjectData[] = [];

export function getProjectBySlug(slug: string): ProjectData | undefined {
  return projectsData.find((p) => p.slug === slug);
}
