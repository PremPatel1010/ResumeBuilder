import PDFDocument from "pdfkit";

function writeSection(doc, title) {
  doc.moveDown(0.8);
  doc.fontSize(11).fillColor("#111111").text(title.toUpperCase(), { underline: true });
  doc.moveDown(0.35);
}

function lineMeta(doc, parts) {
  doc
    .fontSize(9)
    .fillColor("#444444")
    .text(parts.filter(Boolean).join(" · "), { lineGap: 2 });
  doc.moveDown(0.25);
}

/**
 * Stream a simple print-friendly PDF from stored resume JSON.
 * @param {import("mongoose").LeanDocument} resumeLean
 * @param {import("express").Response} res
 */
export function streamResumePdf(resumeLean, res) {
  const title = (resumeLean.title || "Resume").replace(/[^\w\s-]/g, "").slice(0, 80) || "Resume";
  const filename = `${title}.pdf`;

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${filename.replace(/"/g, "")}"`);

  const doc = new PDFDocument({ margin: 48, bufferPages: true });
  doc.on("error", (err) => {
    console.error("[pdf]", err);
    try {
      if (!res.headersSent) res.status(500).json({ message: "Could not generate PDF" });
    } catch {
      /* ignore */
    }
  });

  doc.pipe(res);

  const personal = resumeLean.personal || {};
  doc.fontSize(20).fillColor("#0a0a0a").text(personal.fullName || title, { align: "center" });
  doc.moveDown(0.2);
  if (personal.role) doc.fontSize(11).fillColor("#333333").text(personal.role, { align: "center" });
  doc.moveDown(0.2);

  const contactBits = [
    personal.email,
    personal.phone,
    personal.location,
    personal.website,
  ].filter(Boolean);
  if (contactBits.length) {
    doc.fontSize(9).fillColor("#555555").text(contactBits.join("  |  "), { align: "center" });
  }

  doc.moveDown(0.6);
  if (personal.summary?.trim()) {
    doc.fontSize(10).fillColor("#222222").text(personal.summary.trim(), { align: "left", lineGap: 3 });
  }

  const order = Array.isArray(resumeLean.sectionOrder) ? resumeLean.sectionOrder : [];

  const sectionWriters = {
    experience() {
      if (!resumeLean.experience?.length) return;
      writeSection(doc, "Experience");
      for (const row of resumeLean.experience) {
        const headline = [row.role, row.company].filter(Boolean).join(" — ");
        if (headline) doc.fontSize(11).fillColor("#111111").text(headline);
        lineMeta(doc, [
          [row.start, row.end].filter(Boolean).join(" – "),
          row.location,
        ]);
        if (row.description?.trim()) doc.fontSize(9.5).fillColor("#333333").text(row.description.trim());
        doc.moveDown(0.45);
      }
    },
    projects() {
      if (!resumeLean.projects?.length) return;
      writeSection(doc, "Projects");
      for (const row of resumeLean.projects) {
        doc.fontSize(11).fillColor("#111111").text(row.name || "Project");
        if (row.link || row.tech) lineMeta(doc, [row.tech, row.link]);
        if (row.description?.trim()) doc.fontSize(9.5).fillColor("#333333").text(row.description.trim());
        doc.moveDown(0.45);
      }
    },
    education() {
      if (!resumeLean.education?.length) return;
      writeSection(doc, "Education");
      for (const row of resumeLean.education) {
        doc
          .fontSize(11)
          .fillColor("#111111")
          .text([row.degree, row.field].filter(Boolean).join(" — "));
        lineMeta(doc, [row.school, [row.start, row.end].filter(Boolean).join(" – ")]);
        if (row.description?.trim()) doc.fontSize(9.5).fillColor("#333333").text(row.description.trim());
        doc.moveDown(0.35);
      }
    },
    skills() {
      if (!resumeLean.skills?.length) return;
      writeSection(doc, "Skills");
      const bullet = resumeLean.skills
        .map((s) => (s.detail ? `${s.name} (${s.detail})` : s.name))
        .filter(Boolean)
        .join(" • ");
      doc.fontSize(9.5).fillColor("#333333").text(bullet);
    },
    certifications() {
      if (!resumeLean.certifications?.length) return;
      writeSection(doc, "Certifications");
      for (const row of resumeLean.certifications) {
        doc.fontSize(10).fillColor("#111111").text(row.name || "");
        if (row.detail) doc.fontSize(9).fillColor("#444444").text(row.detail);
        doc.moveDown(0.3);
      }
    },
    languages() {
      if (!resumeLean.languages?.length) return;
      writeSection(doc, "Languages");
      for (const row of resumeLean.languages) {
        doc.fontSize(10).fillColor("#111111").text(row.detail ? `${row.name} — ${row.detail}` : row.name || "");
        doc.moveDown(0.25);
      }
    },
    achievements() {
      if (!resumeLean.achievements?.length) return;
      writeSection(doc, "Achievements");
      for (const row of resumeLean.achievements) {
        doc.fontSize(10).fillColor("#111111").text(row.name || "");
        if (row.detail) doc.fontSize(9).fillColor("#444444").text(row.detail);
        doc.moveDown(0.3);
      }
    },
  };

  const seen = new Set();
  for (const key of order) {
    if (!sectionWriters[key] || seen.has(key)) continue;
    seen.add(key);
    sectionWriters[key]();
  }

  for (const key of Object.keys(sectionWriters)) {
    if (seen.has(key)) continue;
    sectionWriters[key]();
  }

  doc.end();
}
