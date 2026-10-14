import { getDurationSince } from "../utils/duration";

export interface Profile {
  name: string;
  title: string;
  summary: string;
  careerStartDate: string;
  email: {
    personal: string;
    professional: string;
    work: string;
  };
  socials: {
    github: string;
    linkedin: string;
  };
}

export function getProfileSummary(): string {
  return profile.summary.replace(/\{duration\}/g, getDurationSince(profile.careerStartDate));
}

export function getProfileBio(): string {
  const firstParagraph = profile.summary.split("\n\n")[0] ?? profile.summary;
  return firstParagraph.replace(/\{duration\}/g, getDurationSince(profile.careerStartDate));
}

export const profile: Profile = {
  name: "Angelo Justine D. Kamachi",
  title: "Full-Stack Software Engineer",
  summary: `Full-stack specialist with over {duration} of expertise building interactive high-performance web systems and decentralized platforms.

> [!NOTE]
> Passionate about sleek interface layouts, scalable backend servers, and container deployment pipelines.

| Core Focus | Tech Stack | Primary Target |
|---|---|---|
| **Frontend & UI** | Next.js 16, React, Tailwind CSS v4 | High-performance Web Applications |
| **Backend & Cloud** | Node.js, Python, Supabase, Redis | Scalable Microservices & Databases |
| **Game Dev & ML** | Unity Engine, PyTorch, Yolov11n | Interactive Games & AI Models |`,
  careerStartDate: "May 18, 2026",
  email: {
    personal: "angelo.kamachi03@gmail.com",
    professional: "ajdkamachi@gmail.com",
    work: "angelo.kamachi03@prosperna.com",
  },
  socials: {
    github: "https://github.com/kamachi-dev",
    linkedin: "https://www.linkedin.com/in/angelo-justine-kamachi-353857309",
  },
};
