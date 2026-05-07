import mongoose from "mongoose";

const personalSchema = new mongoose.Schema(
  {
    fullName: { type: String, default: "" },
    role: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    location: { type: String, default: "" },
    website: { type: String, default: "" },
    summary: { type: String, default: "" },
  },
  { _id: false }
);

const namedItemSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, default: "" },
    detail: { type: String },
  },
  { _id: false }
);

const educationItemSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    school: { type: String, default: "" },
    degree: { type: String, default: "" },
    field: { type: String, default: "" },
    start: { type: String, default: "" },
    end: { type: String, default: "" },
    description: { type: String },
  },
  { _id: false }
);

const experienceItemSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    company: { type: String, default: "" },
    role: { type: String, default: "" },
    location: { type: String },
    start: { type: String, default: "" },
    end: { type: String, default: "" },
    description: { type: String, default: "" },
  },
  { _id: false }
);

const projectItemSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, default: "" },
    link: { type: String },
    tech: { type: String },
    description: { type: String, default: "" },
  },
  { _id: false }
);

const ALLOWED_SECTIONS = new Set([
  "experience",
  "projects",
  "education",
  "skills",
  "certifications",
  "languages",
  "achievements",
]);

const DEFAULT_SECTION_ORDER = [
  "experience",
  "projects",
  "education",
  "skills",
  "certifications",
  "languages",
  "achievements",
];

const resumeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, default: "Untitled Resume", maxlength: 200 },
    template: {
      type: String,
      default: "modern",
      enum: ["modern", "classic", "compact", "elegant"],
    },
    personal: { type: personalSchema, default: () => ({}) },
    education: [educationItemSchema],
    skills: [namedItemSchema],
    experience: [experienceItemSchema],
    projects: [projectItemSchema],
    certifications: [namedItemSchema],
    languages: [namedItemSchema],
    achievements: [namedItemSchema],
    sectionOrder: { type: [String], default: DEFAULT_SECTION_ORDER },
  },
  { timestamps: true }
);

resumeSchema.pre("validate", function (next) {
  this.sectionOrder = normalizeSectionOrder(this.sectionOrder);
  next();
});

export function normalizeSectionOrder(order) {
  if (!Array.isArray(order)) return [...DEFAULT_SECTION_ORDER];
  const seen = new Set();
  const normalized = [];
  for (const k of order) {
    if (typeof k === "string" && ALLOWED_SECTIONS.has(k) && !seen.has(k)) {
      seen.add(k);
      normalized.push(k);
    }
  }
  for (const def of DEFAULT_SECTION_ORDER) {
    if (!seen.has(def)) normalized.push(def);
  }
  return normalized;
}

export const Resume =
  mongoose.models.Resume || mongoose.model("Resume", resumeSchema);
