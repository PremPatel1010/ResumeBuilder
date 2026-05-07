import { env } from "../config/index.js";

async function openaiCompletion({ system, user }) {
  if (!env.openaiApiKey) return null;

  const res = await fetch(env.openaiApiUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.openaiApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: env.openaiModel,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0.6,
      max_tokens: 600,
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    console.warn("[ai] OpenAI error", res.status, errText.slice(0, 200));
    return null;
  }

  const data = await res.json();
  const text =
    data?.choices?.[0]?.message?.content?.trim()?.replace(/^["']|["']$/g, "") ?? null;
  return text || null;
}

function fallbackSummary(role, keywords) {
  const roleLine = role ? `${role.trim()}` : "professional";
  const skills =
    keywords?.filter(Boolean)?.slice(0, 8).join(", ") || "technical and communication skills";

  return `Results-driven ${roleLine} with a track record of delivering high-quality outcomes. Comfortable owning projects end-to-end, collaborating cross-functionally, and communicating clearly with stakeholders. Core strengths include ${skills}. Passionate about learning quickly, improving systems, and shipping work that compounds over time.`;
}

function fallbackSkills(role) {
  const base = [
    "Communication",
    "Problem solving",
    "Team collaboration",
    "Stakeholder alignment",
    "Documentation",
    "Agile execution",
    "Data-driven decisions",
    "Quality focus",
  ];
  const tech = [
    "TypeScript",
    "JavaScript",
    "React",
    "Node.js",
    "SQL",
    "Git",
    "REST APIs",
    "Testing",
  ];
  const r = (role || "").toLowerCase();

  let extra = tech;
  if (r.includes("data"))
    extra = [...base.slice(0, 4), "Python", "SQL", "Visualization", "Experimentation"];
  if (r.includes("design"))
    extra = [...base.slice(0, 4), "UX research", "Figma", "Prototyping", "Accessibility"];
  if (r.includes("product"))
    extra = [...base.slice(0, 4), "Roadmapping", "Prioritization", "Analytics", "User research"];

  return [...base.slice(0, 4), ...extra].slice(0, 14);
}

function tightenDescription(name, tech, description) {
  const subject = tech?.trim() || name?.trim() || "project";
  const base = description?.trim() || `Contributed as an individual contributor on ${subject}, focusing on measurable impact and dependable delivery.`;

  let text = base
    .replace(/\s+/g, " ")
    .replace(/\bi\b/g, "I")
    .replace(/responsible for/gi, "Owned")
    .replace(/\b(worked on|helped with)\b/gi, "Delivered");

  const prefixParts = [];
  if (name?.trim()) prefixParts.push(name.trim());
  if (tech?.trim()) prefixParts.push(tech.trim());
  const prefix = prefixParts.length ? `${prefixParts.join(" — ")}: ` : "";

  if (!/\b(owned|delivered|built|implemented|led|improved)\b/i.test(text)) {
    text = `Delivered outcomes for ${subject}. ${text}`;
  }

  return `${prefix}${text}`.slice(0, 1200);
}

export async function summarizeProfile({ role, experience, keywords }) {
  const contextParts = [`Target role: ${role || "(not specified)"}`];
  if (experience?.trim()) contextParts.push(`Experience context: ${experience.trim()}`);
  if (keywords?.length) contextParts.push(`Keywords: ${keywords.join(", ")}`);
  const context = contextParts.join("\n");

  const system =
    "You write concise, professional resume summaries for candidates. Plain text without markdown headings or bullets. Two or three compact paragraphs.";
  const ai = await openaiCompletion({
    system,
    user: `Write a strong professional summary (120–260 words).\n${context}`,
  }).catch(() => null);

  return { text: ai || fallbackSummary(role, keywords) };
}

export async function suggestSkills({ role, experience }) {
  const ctx = [`Target role: ${role || "(not specified)"}`];
  if (experience?.trim()) ctx.push(`Context: ${experience.trim()}`);

  const system =
    "Return a JSON object with a single key `skills` whose value is an array of 8 to 16 short skill strings (no duplicates). No markdown.";
  const ai = await openaiCompletion({
    system,
    user: `Generate skills for a resume.\n${ctx.join("\n")}\nRespond only with JSON like {"skills":["..."]}`,
  }).catch(() => null);

  if (ai) {
    try {
      const parsed = JSON.parse(ai.replace(/```json|```/g, "").trim());
      if (Array.isArray(parsed?.skills)) {
        const skills = parsed.skills
          .filter((s) => typeof s === "string" && s.trim())
          .map((s) => s.trim())
          .slice(0, 16);
        if (skills.length) return { skills };
      }
    } catch {
      /* fall through */
    }
  }

  return { skills: fallbackSkills(role) };
}

export async function improveProjectText({ name, tech, description }) {
  const story = [
    `Name: ${name || "(untitled)"}`,
    `Technologies: ${tech || "(not specified)"}`,
    `Existing description: ${description || "(empty)"}`,
  ].join("\n");

  const system =
    "Write a crisp resume bullet-style paragraph (3–6 sentences) describing impact, scope, and technologies. Plain text only.";
  const ai = await openaiCompletion({
    system,
    user: `Improve this project description for a resume.\n${story}`,
  }).catch(() => null);

  return { text: ai || tightenDescription(name, tech, description) };
}
