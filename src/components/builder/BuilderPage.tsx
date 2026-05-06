import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  Download,
  Save,
  GripVertical,
  Sparkles,
  Loader2,
  Wand2,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  EducationItem,
  ExperienceItem,
  NamedItem,
  ProjectItem,
  Resume,
  emptyResume,
  useResumeStore,
} from "@/store/useResumeStore";
import { aiService, resumeService } from "@/services/resumeService";
import { ResumePreview } from "./ResumePreview";

const uid = () => Math.random().toString(36).slice(2, 10);

const SECTION_LABELS: Record<string, string> = {
  experience: "Experience",
  projects: "Projects",
  education: "Education",
  skills: "Skills",
  certifications: "Certifications",
  languages: "Languages",
  achievements: "Achievements",
};

const TEMPLATES = [
  { value: "modern", label: "Modern" },
  { value: "classic", label: "Classic" },
  { value: "compact", label: "Compact" },
  { value: "elegant", label: "Elegant" },
];

export function BuilderPage({ resumeId }: { resumeId?: string }) {
  return (
    <DashboardLayout>
      <Builder resumeId={resumeId} />
    </DashboardLayout>
  );
}

function Builder({ resumeId }: { resumeId?: string }) {
  const { resume, setResume, update, setSectionOrder } = useResumeStore();
  const [loading, setLoading] = useState(!!resumeId);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    if (resumeId) {
      setLoading(true);
      resumeService
        .get(resumeId)
        .then((data) => setResume({ ...emptyResume(), ...data }))
        .catch(() => toast.error("Could not load resume"))
        .finally(() => setLoading(false));
    } else {
      setResume(emptyResume());
    }
  }, [resumeId, setResume]);

  // Auto-save UI hint
  useEffect(() => {
    const handler = setTimeout(() => {
      if (typeof window !== "undefined") {
        localStorage.setItem("arb_draft", JSON.stringify(resume));
      }
    }, 600);
    return () => clearTimeout(handler);
  }, [resume]);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (resume._id) {
        await resumeService.update(resume._id, resume);
        toast.success("Saved");
      } else {
        const created = await resumeService.create(resume);
        setResume({ ...resume, _id: created._id });
        toast.success("Resume created");
        if (created._id) navigate({ to: "/builder/$id", params: { id: created._id } });
      }
    } catch {
      toast.error("Could not save resume");
    } finally {
      setSaving(false);
    }
  };

  const moveSection = (index: number, dir: -1 | 1) => {
    const order = [...resume.sectionOrder];
    const target = index + dir;
    if (target < 0 || target >= order.length) return;
    [order[index], order[target]] = [order[target], order[index]];
    setSectionOrder(order);
  };

  if (loading) {
    return (
      <div className="grid h-[60vh] place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Input
            value={resume.title}
            onChange={(e) => update("title", e.target.value)}
            className="h-10 w-64 border-0 bg-transparent px-0 text-2xl font-bold tracking-tight focus-visible:ring-0"
          />
          <p className="text-xs text-muted-foreground">Auto-saving locally · Click save to sync</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={resume.template} onValueChange={(v) => update("template", v)}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TEMPLATES.map((t) => (
                <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => window.print()} className="gap-2">
            <Download className="h-4 w-4" /> PDF
          </Button>
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save
          </Button>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Editor */}
        <div className="space-y-4">
          <PersonalCard resume={resume} update={update} />
          {resume.sectionOrder.map((key, idx) => (
            <SectionCard
              key={key}
              sectionKey={key}
              index={idx}
              total={resume.sectionOrder.length}
              onMoveUp={() => moveSection(idx, -1)}
              onMoveDown={() => moveSection(idx, 1)}
              resume={resume}
              update={update}
            />
          ))}
        </div>

        {/* Preview */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <ResumePreview resume={resume} />
        </div>
      </div>
    </div>
  );
}

function PersonalCard({
  resume,
  update,
}: {
  resume: Resume;
  update: (path: string, v: unknown) => void;
}) {
  const [genLoading, setGenLoading] = useState(false);

  const generateSummary = async () => {
    setGenLoading(true);
    try {
      const res = await aiService.summary({
        role: resume.personal.role,
        keywords: resume.skills.map((s) => s.name),
      });
      update("personal.summary", res.text);
      toast.success("Summary generated");
    } catch {
      toast.error("AI request failed");
    } finally {
      setGenLoading(false);
    }
  };

  return (
    <Card title="Personal Information">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Full name" value={resume.personal.fullName} onChange={(v) => update("personal.fullName", v)} />
        <Field label="Role" value={resume.personal.role} onChange={(v) => update("personal.role", v)} />
        <Field label="Email" value={resume.personal.email} onChange={(v) => update("personal.email", v)} />
        <Field label="Phone" value={resume.personal.phone} onChange={(v) => update("personal.phone", v)} />
        <Field label="Location" value={resume.personal.location} onChange={(v) => update("personal.location", v)} />
        <Field label="Website" value={resume.personal.website} onChange={(v) => update("personal.website", v)} />
      </div>
      <div className="mt-3">
        <div className="mb-1.5 flex items-center justify-between">
          <Label className="text-xs">Professional summary</Label>
          <Button size="sm" variant="ghost" onClick={generateSummary} disabled={genLoading} className="h-7 gap-1 text-xs">
            {genLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3 text-primary" />}
            Generate with AI
          </Button>
        </div>
        <Textarea
          rows={4}
          value={resume.personal.summary}
          onChange={(e) => update("personal.summary", e.target.value)}
          placeholder="A short, compelling summary of who you are…"
        />
      </div>
    </Card>
  );
}

function SectionCard({
  sectionKey,
  index,
  total,
  onMoveUp,
  onMoveDown,
  resume,
  update,
}: {
  sectionKey: string;
  index: number;
  total: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  resume: Resume;
  update: (path: string, v: unknown) => void;
}) {
  const title = SECTION_LABELS[sectionKey] || sectionKey;
  return (
    <Card
      title={title}
      handle={
        <div className="flex items-center gap-1">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
          <button
            disabled={index === 0}
            onClick={onMoveUp}
            className="rounded p-1 text-muted-foreground hover:bg-accent disabled:opacity-30"
          >
            <ChevronUp className="h-3.5 w-3.5" />
          </button>
          <button
            disabled={index === total - 1}
            onClick={onMoveDown}
            className="rounded p-1 text-muted-foreground hover:bg-accent disabled:opacity-30"
          >
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </div>
      }
    >
      {sectionKey === "experience" && <ExperienceList items={resume.experience} update={update} />}
      {sectionKey === "projects" && <ProjectList items={resume.projects} update={update} />}
      {sectionKey === "education" && <EducationList items={resume.education} update={update} />}
      {sectionKey === "skills" && (
        <NamedList
          items={resume.skills}
          update={(items) => update("skills", items)}
          placeholder="e.g. TypeScript"
          aiLabel="Suggest skills"
          onAi={async () => {
            const res = await aiService.skills({ role: resume.personal.role });
            return res.skills.map((s) => ({ id: uid(), name: s }));
          }}
        />
      )}
      {sectionKey === "certifications" && (
        <NamedList items={resume.certifications} update={(i) => update("certifications", i)} placeholder="Certification name" detailPlaceholder="Issuer / year" />
      )}
      {sectionKey === "languages" && (
        <NamedList items={resume.languages} update={(i) => update("languages", i)} placeholder="Language" detailPlaceholder="Level" />
      )}
      {sectionKey === "achievements" && (
        <NamedList items={resume.achievements} update={(i) => update("achievements", i)} placeholder="Achievement" detailPlaceholder="Details" aiLabel="Generate ideas"
          onAi={async () => {
            const res = await aiService.summary({ role: resume.personal.role, keywords: ["achievements"] });
            return [{ id: uid(), name: res.text.slice(0, 60), detail: "" }];
          }}
        />
      )}
    </Card>
  );
}

function Card({
  title,
  children,
  handle,
}: {
  title: string;
  children: React.ReactNode;
  handle?: React.ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="rounded-xl border border-border bg-card p-5 shadow-card"
    >
      <header className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
        {handle}
      </header>
      {children}
    </motion.section>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function ExperienceList({ items, update }: { items: ExperienceItem[]; update: (p: string, v: unknown) => void }) {
  const set = (next: ExperienceItem[]) => update("experience", next);
  return (
    <div className="space-y-3">
      <AnimatePresence>
        {items.map((it, i) => (
          <motion.div key={it.id} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="rounded-lg border border-border p-3"
          >
            <div className="grid gap-2 sm:grid-cols-2">
              <Input placeholder="Role" value={it.role} onChange={(e) => { const n = [...items]; n[i] = { ...it, role: e.target.value }; set(n); }} />
              <Input placeholder="Company" value={it.company} onChange={(e) => { const n = [...items]; n[i] = { ...it, company: e.target.value }; set(n); }} />
              <Input placeholder="Location" value={it.location || ""} onChange={(e) => { const n = [...items]; n[i] = { ...it, location: e.target.value }; set(n); }} />
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="Start" value={it.start} onChange={(e) => { const n = [...items]; n[i] = { ...it, start: e.target.value }; set(n); }} />
                <Input placeholder="End" value={it.end} onChange={(e) => { const n = [...items]; n[i] = { ...it, end: e.target.value }; set(n); }} />
              </div>
            </div>
            <Textarea className="mt-2" rows={3} placeholder="Describe your impact…" value={it.description}
              onChange={(e) => { const n = [...items]; n[i] = { ...it, description: e.target.value }; set(n); }} />
            <div className="mt-2 flex justify-between">
              <Button size="sm" variant="ghost" className="h-7 gap-1 text-xs"
                onClick={async () => {
                  try {
                    const res = await aiService.projects({ name: it.role, tech: it.company, description: it.description });
                    const n = [...items]; n[i] = { ...it, description: res.text }; set(n);
                    toast.success("Description improved");
                  } catch { toast.error("AI request failed"); }
                }}>
                <Wand2 className="h-3 w-3 text-primary" /> Improve with AI
              </Button>
              <Button size="sm" variant="ghost" className="h-7 gap-1 text-xs text-destructive"
                onClick={() => set(items.filter((_, x) => x !== i))}>
                <Trash2 className="h-3 w-3" /> Remove
              </Button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      <Button variant="outline" size="sm" className="w-full gap-2"
        onClick={() => set([...items, { id: uid(), company: "", role: "", location: "", start: "", end: "", description: "" }])}>
        <Plus className="h-4 w-4" /> Add experience
      </Button>
    </div>
  );
}

function ProjectList({ items, update }: { items: ProjectItem[]; update: (p: string, v: unknown) => void }) {
  const set = (next: ProjectItem[]) => update("projects", next);
  return (
    <div className="space-y-3">
      <AnimatePresence>
        {items.map((it, i) => (
          <motion.div key={it.id} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="rounded-lg border border-border p-3">
            <div className="grid gap-2 sm:grid-cols-2">
              <Input placeholder="Project name" value={it.name} onChange={(e) => { const n = [...items]; n[i] = { ...it, name: e.target.value }; set(n); }} />
              <Input placeholder="Tech stack" value={it.tech || ""} onChange={(e) => { const n = [...items]; n[i] = { ...it, tech: e.target.value }; set(n); }} />
            </div>
            <Input className="mt-2" placeholder="Link" value={it.link || ""} onChange={(e) => { const n = [...items]; n[i] = { ...it, link: e.target.value }; set(n); }} />
            <Textarea className="mt-2" rows={3} placeholder="Describe the project…" value={it.description}
              onChange={(e) => { const n = [...items]; n[i] = { ...it, description: e.target.value }; set(n); }} />
            <div className="mt-2 flex justify-between">
              <Button size="sm" variant="ghost" className="h-7 gap-1 text-xs"
                onClick={async () => {
                  try {
                    const res = await aiService.projects({ name: it.name, tech: it.tech, description: it.description });
                    const n = [...items]; n[i] = { ...it, description: res.text }; set(n);
                    toast.success("Description improved");
                  } catch { toast.error("AI request failed"); }
                }}>
                <Wand2 className="h-3 w-3 text-primary" /> Improve with AI
              </Button>
              <Button size="sm" variant="ghost" className="h-7 gap-1 text-xs text-destructive"
                onClick={() => set(items.filter((_, x) => x !== i))}>
                <Trash2 className="h-3 w-3" /> Remove
              </Button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      <Button variant="outline" size="sm" className="w-full gap-2"
        onClick={() => set([...items, { id: uid(), name: "", link: "", tech: "", description: "" }])}>
        <Plus className="h-4 w-4" /> Add project
      </Button>
    </div>
  );
}

function EducationList({ items, update }: { items: EducationItem[]; update: (p: string, v: unknown) => void }) {
  const set = (next: EducationItem[]) => update("education", next);
  return (
    <div className="space-y-3">
      <AnimatePresence>
        {items.map((it, i) => (
          <motion.div key={it.id} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="rounded-lg border border-border p-3">
            <div className="grid gap-2 sm:grid-cols-2">
              <Input placeholder="School" value={it.school} onChange={(e) => { const n = [...items]; n[i] = { ...it, school: e.target.value }; set(n); }} />
              <Input placeholder="Degree" value={it.degree} onChange={(e) => { const n = [...items]; n[i] = { ...it, degree: e.target.value }; set(n); }} />
              <Input placeholder="Field of study" value={it.field} onChange={(e) => { const n = [...items]; n[i] = { ...it, field: e.target.value }; set(n); }} />
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="Start" value={it.start} onChange={(e) => { const n = [...items]; n[i] = { ...it, start: e.target.value }; set(n); }} />
                <Input placeholder="End" value={it.end} onChange={(e) => { const n = [...items]; n[i] = { ...it, end: e.target.value }; set(n); }} />
              </div>
            </div>
            <div className="mt-2 flex justify-end">
              <Button size="sm" variant="ghost" className="h-7 gap-1 text-xs text-destructive"
                onClick={() => set(items.filter((_, x) => x !== i))}>
                <Trash2 className="h-3 w-3" /> Remove
              </Button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      <Button variant="outline" size="sm" className="w-full gap-2"
        onClick={() => set([...items, { id: uid(), school: "", degree: "", field: "", start: "", end: "" }])}>
        <Plus className="h-4 w-4" /> Add education
      </Button>
    </div>
  );
}

function NamedList({
  items,
  update,
  placeholder,
  detailPlaceholder,
  aiLabel,
  onAi,
}: {
  items: NamedItem[];
  update: (next: NamedItem[]) => void;
  placeholder: string;
  detailPlaceholder?: string;
  aiLabel?: string;
  onAi?: () => Promise<NamedItem[]>;
}) {
  const [aiLoading, setAiLoading] = useState(false);
  return (
    <div className="space-y-2">
      <AnimatePresence>
        {items.map((it, i) => (
          <motion.div key={it.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }}
            className="flex gap-2">
            <Input placeholder={placeholder} value={it.name}
              onChange={(e) => { const n = [...items]; n[i] = { ...it, name: e.target.value }; update(n); }} />
            {detailPlaceholder && (
              <Input placeholder={detailPlaceholder} value={it.detail || ""}
                onChange={(e) => { const n = [...items]; n[i] = { ...it, detail: e.target.value }; update(n); }} />
            )}
            <Button variant="ghost" size="icon" onClick={() => update(items.filter((_, x) => x !== i))}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </motion.div>
        ))}
      </AnimatePresence>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="flex-1 gap-2"
          onClick={() => update([...items, { id: uid(), name: "", detail: "" }])}>
          <Plus className="h-4 w-4" /> Add
        </Button>
        {onAi && aiLabel && (
          <Button variant="ghost" size="sm" className="gap-1 text-xs"
            disabled={aiLoading}
            onClick={async () => {
              setAiLoading(true);
              try {
                const next = await onAi();
                update([...items, ...next]);
                toast.success("AI suggestions added");
              } catch { toast.error("AI request failed"); }
              finally { setAiLoading(false); }
            }}>
            {aiLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3 text-primary" />}
            {aiLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
