import { create } from "zustand";

export const emptyResume = () => ({
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

export const useResumeStore = create((set, get) => ({
  resume: emptyResume(),
  setResume: (resume) => set({ resume }),
  reset: () => set({ resume: emptyResume() }),
  update: (path, value) => {
    const resume = structuredClone(get().resume);
    const keys = path.split(".");
    let cur = resume;
    for (let i = 0; i < keys.length - 1; i++) cur = cur[keys[i]];
    cur[keys[keys.length - 1]] = value;
    set({ resume });
  },
  setSectionOrder: (order) => {
    const resume = { ...get().resume, sectionOrder: order };
    set({ resume });
  },
}));
