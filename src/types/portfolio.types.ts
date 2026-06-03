export interface IProject {
  id: number;
  title: string;
  client: string;
  description: string;
  image: string;
  technologies: string[];
  liveUrl: string;
  githubUrl: string;
}

export interface IExperience {
  id: number;
  role: string;
  company: string;
  period: string;
  description: string;
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
  databases: string[];
  architecture: string[];
}

export interface IPortfolioData {
  personal: {
    name: string;
    title: string;
    email: string;
    github: string;
    linkedin: string;
  };
  experience: IExperience[];
  education: IEducation[];
  skills: ISkills;
  projects: IProject[];
}
