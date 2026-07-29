export type ProjectCategory = 'all' | 'web' | 'mobile' | 'desktop' | 'architecture';

export interface IProject {
  id: number;
  title: string;
  client: string;
  category: ProjectCategory;
  description: string;
  longDescription?: string;
  image: string;
  technologies: string[];
  architectureBadges?: string[];
  liveUrl?: string;
  githubUrl?: string;
  isFeatured?: boolean;
}

export interface IExperience {
  id: number;
  role: string;
  company: string;
  period: string;
  description: string;
  achievements?: string[];
  technologies: string[];
}

export interface IEducation {
  id: number;
  degree: string;
  institution: string;
  status: string;
  type?: string;
}

export interface ISkills {
  frontend: string[];
  backend: string[];
  desktop: string[];
  databases: string[];
  architecture: string[];
}

export interface IPortfolioData {
  personal: {
    name: string;
    title: string;
    subtitle: string;
    bio: string;
    location: string;
    email: string;
    github: string;
    linkedin: string;
    status: string;
  };
  experience: IExperience[];
  education: IEducation[];
  skills: ISkills;
  projects: IProject[];
}

