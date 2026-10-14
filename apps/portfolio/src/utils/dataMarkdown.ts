import { getDurationSince, getYearsSince } from "./duration";
import type { Profile } from "../data/profile";
import type { WorkCompany, Education, FeaturedWork, TechStackNode, TechStackEdge } from "../data/types";

export interface ExperienceData {
  workCompanies: WorkCompany[];
  educationHistory?: Education[];
  faqItems?: Array<{ question: string; answer: string }>;
}

export interface TechStackData {
  techStackNodes: TechStackNode[];
  techStackEdges: TechStackEdge[];
  heroTitles?: string[];
}

export function buildProfileMarkdown(p: Profile): string {
  const duration = p.careerStartDate ? getDurationSince(p.careerStartDate) : null;
  const summary = p.summary.replace(/\{duration\}/g, duration ?? "");
  return [
    "## Profile Overview",
    summary,
    "",
    `**Title:** ${p.title}`,
    ...(p.careerStartDate
      ? [`**Career Start:** ${p.careerStartDate}`, `**Experience:** ${duration ?? "N/A"}`]
      : []),
    "",
    "**Contact:**",
    `- Personal: ${p.email.personal}`,
    `- Professional: ${p.email.professional}`,
    `- Work: ${p.email.work}`,
    `- GitHub: ${p.socials.github}`,
    `- LinkedIn: ${p.socials.linkedin}`,
  ].join("\n");
}

export function buildExperienceMarkdown(exp: ExperienceData): string {
  const sections: string[] = [];

  for (const c of exp.workCompanies) {
    const lines: string[] = [
      `## ${c.company}`,
      `**Role:** ${c.role}`,
      `**Period:** ${c.period}`,
    ];
    if (c.companyUrl) lines.push(`**Website:** [${c.companyUrl}](${c.companyUrl})`);
    if (c.companyLogo) lines.push(`![${c.company} Logo](${c.companyLogo})`);
    if (c.reportUrl) lines.push(`**Internship Report:** [Download Report](${c.reportUrl})`);
    lines.push("");

    for (const p of c.projects) {
      lines.push(`### ${p.title}`);
      lines.push(p.longDescription ?? p.description);
      lines.push("");
      if (p.contributions && p.contributions.length > 0) {
        lines.push("**Key Contributions:**");
        for (const ct of p.contributions) lines.push(`- ${ct}`);
        lines.push("");
      }
      lines.push(`**Technologies:** ${p.technologies.join(", ")}`);
      lines.push("");
    }

    sections.push(lines.join("\n").trimEnd());
  }

  if (exp.educationHistory && exp.educationHistory.length > 0) {
    sections.push("## Education");
    for (const e of exp.educationHistory) {
      sections.push(`- **${e.degree}** — ${e.school} (${e.period})`);
    }
  }

  if (exp.faqItems && exp.faqItems.length > 0) {
    sections.push("## FAQ");
    for (const f of exp.faqItems) {
      sections.push(`### ${f.question}`);
      sections.push(f.answer);
    }
  }

  return sections.join("\n\n");
}

export function buildTechStackMarkdown(ts: TechStackData): string {
  const lines: string[] = ["## Technology Stack"];
  if (ts.heroTitles && ts.heroTitles.length > 0) {
    lines.push(`**Roles:** ${ts.heroTitles.join(", ")}`);
  }
  lines.push("");

  const categories = Array.from(new Map(ts.techStackNodes.map(n => [n.category, true])).keys());
  for (const cat of categories) {
    lines.push(`### ${cat}`);
    for (const n of ts.techStackNodes.filter(node => node.category === cat)) {
      lines.push(`- **${n.name}** — ${getYearsSince(n.startYear)}+ years`);
    }
    lines.push("");
  }

  if (ts.techStackEdges && ts.techStackEdges.length > 0) {
    lines.push("### Graph Connections");
    for (const e of ts.techStackEdges) {
      const from = ts.techStackNodes.find(n => n.id === e.from);
      const to = ts.techStackNodes.find(n => n.id === e.to);
      lines.push(`- **${from?.name ?? e.from}** → **${to?.name ?? e.to}**`);
    }
  }

  return lines.join("\n");
}

export function buildProjectsMarkdown(works: FeaturedWork[]): string {
  return works
    .map(w => {
      const lines: string[] = [`## ${w.title}`, w.description, ""];
      if (w.videoUrl) lines.push(`**Showcase:** [Watch Video](${w.videoUrl})`);
      if (w.link) lines.push(`**Link:** [${w.link}](${w.link})`);
      lines.push(`**Tags:** ${w.tags.join(", ")}`);
      return lines.join("\n");
    })
    .join("\n\n");
}
