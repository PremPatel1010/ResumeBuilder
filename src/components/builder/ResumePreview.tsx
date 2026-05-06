import { Resume } from "@/store/useResumeStore";
import { Mail, Phone, MapPin, Globe, Link as LinkIcon } from "lucide-react";

export function ResumePreview({ resume }: { resume: Resume }) {
  const p = resume.personal;
  const sectionMap: Record<string, () => React.ReactNode> = {
    experience: () => (
      <Section title="Experience">
        {resume.experience.length === 0 ? (
          <Empty label="experience" />
        ) : (
          resume.experience.map((e) => (
            <div key={e.id} className="mb-3">
              <div className="flex items-baseline justify-between gap-2">
                <p className="font-semibold text-foreground">{e.role || "Role"}</p>
                <span className="text-xs text-muted-foreground">
                  {e.start} {e.end ? `– ${e.end}` : ""}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {e.company}{e.location ? ` · ${e.location}` : ""}
              </p>
              {e.description && <p className="mt-1 whitespace-pre-line text-xs">{e.description}</p>}
            </div>
          ))
        )}
      </Section>
    ),
    projects: () => (
      <Section title="Projects">
        {resume.projects.length === 0 ? (
          <Empty label="projects" />
        ) : (
          resume.projects.map((pr) => (
            <div key={pr.id} className="mb-3">
              <div className="flex items-baseline justify-between gap-2">
                <p className="font-semibold text-foreground">{pr.name || "Project"}</p>
                {pr.tech && <span className="text-xs text-muted-foreground">{pr.tech}</span>}
              </div>
              {pr.link && (
                <p className="text-xs text-primary inline-flex items-center gap-1">
                  <LinkIcon className="h-3 w-3" /> {pr.link}
                </p>
              )}
              {pr.description && <p className="mt-1 whitespace-pre-line text-xs">{pr.description}</p>}
            </div>
          ))
        )}
      </Section>
    ),
    education: () => (
      <Section title="Education">
        {resume.education.length === 0 ? (
          <Empty label="education" />
        ) : (
          resume.education.map((e) => (
            <div key={e.id} className="mb-2">
              <p className="font-semibold text-foreground">{e.school || "School"}</p>
              <p className="text-xs text-muted-foreground">
                {[e.degree, e.field].filter(Boolean).join(", ")}
              </p>
              <p className="text-xs text-muted-foreground">
                {e.start} {e.end ? `– ${e.end}` : ""}
              </p>
            </div>
          ))
        )}
      </Section>
    ),
    skills: () => (
      <Section title="Skills">
        {resume.skills.length === 0 ? (
          <Empty label="skills" />
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {resume.skills.map((s) => (
              <span
                key={s.id}
                className="rounded-md border border-border bg-accent px-2 py-0.5 text-xs text-accent-foreground"
              >
                {s.name}
              </span>
            ))}
          </div>
        )}
      </Section>
    ),
    certifications: () => (
      <Section title="Certifications">
        {resume.certifications.length === 0 ? (
          <Empty label="certifications" />
        ) : (
          resume.certifications.map((c) => (
            <p key={c.id} className="text-xs">
              <span className="font-medium text-foreground">{c.name}</span>
              {c.detail ? ` — ${c.detail}` : ""}
            </p>
          ))
        )}
      </Section>
    ),
    languages: () => (
      <Section title="Languages">
        {resume.languages.length === 0 ? (
          <Empty label="languages" />
        ) : (
          <p className="text-xs">
            {resume.languages.map((l) => `${l.name}${l.detail ? ` (${l.detail})` : ""}`).join(" · ")}
          </p>
        )}
      </Section>
    ),
    achievements: () => (
      <Section title="Achievements">
        {resume.achievements.length === 0 ? (
          <Empty label="achievements" />
        ) : (
          <ul className="list-disc space-y-1 pl-4 text-xs">
            {resume.achievements.map((a) => (
              <li key={a.id}>
                <span className="font-medium text-foreground">{a.name}</span>
                {a.detail ? ` — ${a.detail}` : ""}
              </li>
            ))}
          </ul>
        )}
      </Section>
    ),
  };

  return (
    <div className="aspect-[1/1.414] w-full overflow-hidden rounded-lg bg-white text-slate-900 shadow-elegant">
      <div className="h-full overflow-y-auto p-8 text-[12px] leading-relaxed">
        <header className="border-b border-slate-200 pb-4">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {p.fullName || "Your Name"}
          </h1>
          {p.role && <p className="text-sm font-medium text-slate-600">{p.role}</p>}
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
            {p.email && <span className="inline-flex items-center gap-1"><Mail className="h-3 w-3" />{p.email}</span>}
            {p.phone && <span className="inline-flex items-center gap-1"><Phone className="h-3 w-3" />{p.phone}</span>}
            {p.location && <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{p.location}</span>}
            {p.website && <span className="inline-flex items-center gap-1"><Globe className="h-3 w-3" />{p.website}</span>}
          </div>
          {p.summary && (
            <p className="mt-3 text-xs leading-relaxed text-slate-700">{p.summary}</p>
          )}
        </header>
        <div className="mt-4">
          {resume.sectionOrder.map((key) => (
            <div key={key}>{sectionMap[key]?.()}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-4">
      <h2 className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
        {title}
      </h2>
      <div className="text-slate-700">{children}</div>
    </section>
  );
}

function Empty({ label }: { label: string }) {
  return <p className="text-xs italic text-slate-400">No {label} added yet.</p>;
}
