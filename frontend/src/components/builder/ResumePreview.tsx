import { forwardRef, type ReactNode } from "react";
import { Resume } from "@/store/useResumeStore";
import { Mail, Phone, MapPin, Globe, Link as LinkIcon } from "lucide-react";

type Props = { resume: Resume };

/** Fixed light-theme palette so text stays readable on the white preview card regardless of app dark/light mode. */
export const ResumePreview = forwardRef<HTMLDivElement, Props>(function ResumePreview(
  { resume },
  ref,
) {
  const p = resume.personal;
  const sectionMap: Record<string, () => ReactNode> = {
    experience: () => (
      <Section title="Experience">
        {resume.experience.length === 0 ? (
          <Empty label="experience" />
        ) : (
          resume.experience.map((e) => (
            <div key={e.id} className="mb-3">
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-[13px] font-semibold text-slate-900">{e.role || "Role"}</p>
                <span className="shrink-0 text-[11px] font-medium tabular-nums text-slate-600">
                  {e.start} {e.end ? `– ${e.end}` : ""}
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-600">
                {e.company}
                {e.location ? ` · ${e.location}` : ""}
              </p>
              {e.description && (
                <p className="mt-1 whitespace-pre-line text-[11px] leading-relaxed text-slate-800">
                  {e.description}
                </p>
              )}
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
                <p className="text-[13px] font-semibold text-slate-900">{pr.name || "Project"}</p>
                {pr.tech && (
                  <span className="shrink-0 text-[11px] font-medium text-slate-600">{pr.tech}</span>
                )}
              </div>
              {pr.link && (
                <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-medium text-indigo-600">
                  <LinkIcon className="h-3 w-3 shrink-0 text-indigo-600" aria-hidden /> {pr.link}
                </p>
              )}
              {pr.description && (
                <p className="mt-1 whitespace-pre-line text-[11px] leading-relaxed text-slate-800">
                  {pr.description}
                </p>
              )}
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
              <p className="text-[13px] font-semibold text-slate-900">{e.school || "School"}</p>
              <p className="text-[11px] font-medium text-slate-600">
                {[e.degree, e.field].filter(Boolean).join(", ")}
              </p>
              <p className="mt-0.5 text-[11px] font-medium tabular-nums text-slate-600">
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
                className="rounded-md bg-slate-900 px-2 py-0.5 text-[11px] font-medium tracking-tight text-white shadow-sm"
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
            <p key={c.id} className="text-[11px] leading-relaxed">
              <span className="font-semibold text-slate-900">{c.name}</span>
              {c.detail ? <span className="font-medium text-slate-600"> — {c.detail}</span> : ""}
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
          <p className="text-[11px] font-medium text-slate-700">
            {resume.languages
              .map((l) => `${l.name}${l.detail ? ` (${l.detail})` : ""}`)
              .join(" · ")}
          </p>
        )}
      </Section>
    ),
    achievements: () => (
      <Section title="Achievements">
        {resume.achievements.length === 0 ? (
          <Empty label="achievements" />
        ) : (
          <ul className="list-disc space-y-1 pl-4 text-[11px]">
            {resume.achievements.map((a) => (
              <li key={a.id} className="leading-relaxed text-slate-800">
                <span className="font-semibold text-slate-900">{a.name}</span>
                {a.detail ? <span className="font-medium text-slate-600"> — {a.detail}</span> : ""}
              </li>
            ))}
          </ul>
        )}
      </Section>
    ),
  };

  return (
    <div
      ref={ref}
      data-resume-export-root
      className="aspect-[1/1.414] w-full overflow-hidden rounded-lg bg-white text-slate-900 shadow-elegant scheme-light"
    >
      <div
        data-resume-export-inner
        className="h-full overflow-y-auto p-8 text-[12px] leading-relaxed"
      >
        <header className="border-b border-slate-200 pb-4">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {p.fullName || "Your Name"}
          </h1>
          {p.role && <p className="text-sm font-semibold text-slate-700">{p.role}</p>}
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-medium text-slate-600">
            {p.email && (
              <span className="inline-flex items-center gap-1 text-slate-600">
                <Mail className="h-3 w-3 shrink-0 text-slate-600" aria-hidden /> {p.email}
              </span>
            )}
            {p.phone && (
              <span className="inline-flex items-center gap-1 text-slate-600">
                <Phone className="h-3 w-3 shrink-0 text-slate-600" aria-hidden /> {p.phone}
              </span>
            )}
            {p.location && (
              <span className="inline-flex items-center gap-1 text-slate-600">
                <MapPin className="h-3 w-3 shrink-0 text-slate-600" aria-hidden /> {p.location}
              </span>
            )}
            {p.website && (
              <span className="inline-flex items-center gap-1 text-slate-600">
                <Globe className="h-3 w-3 shrink-0 text-slate-600" aria-hidden /> {p.website}
              </span>
            )}
          </div>
          {p.summary && (
            <p className="mt-3 text-[11px] leading-relaxed text-slate-800">{p.summary}</p>
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
});

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-4">
      <h2 className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-700">
        {title}
      </h2>
      <div>{children}</div>
    </section>
  );
}

function Empty({ label }: { label: string }) {
  return <p className="text-[11px] italic text-slate-500">No {label} added yet.</p>;
}
