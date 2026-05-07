import { create } from "zustand";

export interface PersonalInfo {
  fullName: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  summary: string;
}

export interface EducationItem {
  id: string;
  school: string;
  degree: string;
  field: string;
  start: string;
  end: string;
  description?: string;
}
export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  location?: string;
  start: string;
  end: string;
  description: string;
}
export interface ProjectItem {
  id: string;
  name: string;
  link?: string;
  tech?: string;
  description: string;
}
export interface NamedItem {
  id: string;
  name: string;
  detail?: string;
}

export interface Resume {
  _id?: string;
  title: string;
  template: string;
  personal: PersonalInfo;
  education: EducationItem[];
  skills: NamedItem[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  certifications: NamedItem[];
  languages: NamedItem[];
  achievements: NamedItem[];
  sectionOrder: string[];
}

interface ResumeState {
  resume: Resume;
  setResume: (resume: Resume) => void;
  reset: () => void;
  update: <T = unknown>(path: string, value: T) => void;
  setSectionOrder: (order: string[]) => void;
}

export const emptyResume = (): Resume => ({
  title: "Untitled Resume",
  template: "modern",
  personal: {
    fullName: "",
    role: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    summary: "",
  },
  education: [],
  skills: [],
  experience: [],
  projects: [],
  certifications: [],
  languages: [],
  achievements: [],
  sectionOrder: [
    "experience",
    "projects",
    "education",
    "skills",
    "certifications",
    "languages",
    "achievements",
  ],
});

export const useResumeStore = create<ResumeState>((set, get) => ({
  resume: emptyResume(),
  setResume: (resume) => set({ resume }),
  reset: () => set({ resume: emptyResume() }),
  update: (path, value) => {
    const resume = structuredClone(get().resume) as unknown as Record<string, unknown>;
    const keys = path.split(".");
    let cur: Record<string, unknown> = resume;
    for (let i = 0; i < keys.length - 1; i++) {
      cur = cur[keys[i]] as Record<string, unknown>;
    }
    cur[keys[keys.length - 1]] = value as unknown;
    set({ resume: resume as unknown as Resume });
  },
  setSectionOrder: (order) => {
    const resume = { ...get().resume, sectionOrder: order };
    set({ resume });
  },
}));
