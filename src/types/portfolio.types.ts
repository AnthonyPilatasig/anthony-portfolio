export type ProjectCategory = 'all' | 'web' | 'mobile' | 'desktop' | 'architecture';

export interface IProject {
  id: number;
  title: string;
  client: string;
  category: ProjectCategory;
  description: string;
  longDescription?: string;
  problem?: string;
  decision?: string;
  tradeoff?: string;
  impact?: string;
  architectureOverview?: string;
  securityAndCompliance?: string;
  keyFeatures?: string[];
  ndaDisclaimer?: string;
  metrics?: string[];
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

export interface IManifestoItem {
  number: string;
  title: string;
  description: string;
}

export interface ITeachingHighlight {
  subject: string;
  studentsCount: string;
  description: string;
  focus: string[];
}

export interface ICertification {
  title: string;
  issuer: string;
  category: string;
}

export interface IPortfolioData {
  personal: {
    name: string;
    title: string;
    subtitle: string;
    bio: string;
    location: string;
    email: string;
    phone: string;
    github: string;
    linkedin: string;
    twitch: string;
    status: string;
    avatar: string;
    avatarReal: string;
    tagline: string;
  };
  manifesto: IManifestoItem[];
  teachingHighlights: ITeachingHighlight[];
  certifications: ICertification[];
  experience: IExperience[];
  education: IEducation[];
  skills: ISkills;
  projects: IProject[];
}

