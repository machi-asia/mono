import fs from "fs";
import path from "path";

const ASSET_BASE = "https://ailxxxnezfdgbtqxjoil.supabase.co/storage/v1/object/public/assets";

export interface SubCertificate {
  id: string;
  name: string;
  image: string;
  source: "coursera" | "wadhwani" | "google" | "physical";
  url: string;
  description?: string;
  markdownLink: string;
}

export interface CertificateItem {
  id: string;
  name: string;
  image: string;
  source: "coursera" | "wadhwani" | "google" | "physical";
  url: string;
  description?: string;
  markdownLink: string;
  subCertificates?: SubCertificate[];
}

const imageExtensions = [".png", ".jpg", ".jpeg", ".gif", ".webp"];

export function formatPhysicalName(baseName: string): string {
  return baseName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function remoteImagePath(...segments: string[]): string {
  return `${ASSET_BASE}/certificates/${segments.join("/")}`;
}

export function buildCertificateLink(source: string, id: string, imagePath?: string): string {
  const src = source.toLowerCase();
  if (src === "google") {
    return `https://www.skills.google.com/public_profiles/8c7a8bb5-6bbf-4746-a105-1f4a540dfb3a/badges/${id}`;
  }
  if (src === "coursera") {
    return `https://coursera.org/share/${id}`;
  }
  if (src === "wadhwani") {
    return `https://web.certificate.wfglobal.org/en/certificate?certificateId=${id}`;
  }
  return imagePath || remoteImagePath(id);
}

export function buildMarkdownLink(name: string, image: string, url: string): string {
  return `[![${name}](${image})](${url})`;
}

import { certificatesData } from "../data/certificates";

export function fetchCertificatesFromFs(customDir?: string): CertificateItem[] {
  const baseCerts: CertificateItem[] = certificatesData.map((c) => ({
    id: c.id,
    name: c.name,
    image: c.image,
    source: c.source,
    url: c.url || c.image,
    description: c.description ?? undefined,
    markdownLink: buildMarkdownLink(c.name, c.image, c.url || c.image),
    subCertificates: c.subCertificates ? c.subCertificates.map(s => ({
      id: s.id,
      name: s.name,
      image: s.image,
      source: s.source,
      url: s.url || s.image,
      description: s.description ?? undefined,
      markdownLink: buildMarkdownLink(s.name, s.image, s.url || s.image),
    })) : undefined,
  }));

  if (customDir) {
    return baseCerts;
  }

  const certificatesDir = customDir || path.join(/*turbopackIgnore: true*/ process.cwd(), "public", "certificates");
  const certificates: CertificateItem[] = [];
  const certIdsFromBase = new Set(baseCerts.map(c => c.id));

  if (!fs.existsSync(certificatesDir)) {
    return baseCerts;
  }

  // 1. Process physical certificates (root files)
  try {
    const rootItems = fs.readdirSync(certificatesDir);
    rootItems.forEach((file) => {
      const filePath = path.join(certificatesDir, file);
      try {
        const stat = fs.statSync(filePath);
        if (stat.isFile() && imageExtensions.includes(path.extname(file).toLowerCase())) {
          const baseName = path.basename(file, path.extname(file));
          if (certIdsFromBase.has(baseName)) return;
          const name = formatPhysicalName(baseName);
          const image = remoteImagePath(file);
          const url = buildCertificateLink("physical", baseName, image);
          certificates.push({
            id: baseName,
            name,
            image,
            source: "physical",
            url,
            markdownLink: buildMarkdownLink(name, image, url),
          });
        }
      } catch (err) {
        console.warn("Error reading stats for file:", file, err);
      }
    });
  } catch (err) {
    console.warn("Error reading certificates root dir:", err);
  }

  // 2. Process google/ subdirectory
  const googleDir = path.join(certificatesDir, "google");
  if (fs.existsSync(googleDir)) {
    try {
      const googleFiles = fs.readdirSync(googleDir);
      googleFiles.forEach((file) => {
        const filePath = path.join(googleDir, file);
        const stat = fs.statSync(filePath);
        if (stat.isFile() && imageExtensions.includes(path.extname(file).toLowerCase())) {
          const baseName = path.basename(file, path.extname(file));
          const name = `Google Badge ${baseName}`;
          const image = remoteImagePath("google", file);
          const url = buildCertificateLink("google", baseName, image);
          certificates.push({
            id: baseName,
            name,
            image,
            source: "google",
            url,
            markdownLink: buildMarkdownLink(name, image, url),
          });
        }
      });
    } catch (err) {
      console.warn("Error reading google directory:", err);
    }
  }

  // 3. Process coursera/ subdirectory
  const courseraDir = path.join(certificatesDir, "coursera");
  if (fs.existsSync(courseraDir)) {
    try {
      const courseraContents = fs.readdirSync(courseraDir);
      const subfolders = courseraContents.filter((item) => {
        try {
          return fs.statSync(path.join(courseraDir, item)).isDirectory();
        } catch {
          return false;
        }
      });

      const files = courseraContents.filter((item) => {
        try {
          return fs.statSync(path.join(courseraDir, item)).isFile() && imageExtensions.includes(path.extname(item).toLowerCase());
        } catch {
          return false;
        }
      });

      const subCertificatesMap: Record<string, SubCertificate[]> = {};
      subfolders.forEach((folder) => {
        const folderPath = path.join(courseraDir, folder);
        try {
          const subFiles = fs.readdirSync(folderPath);
          const subs: SubCertificate[] = subFiles
            .filter((file) => imageExtensions.includes(path.extname(file).toLowerCase()))
            .map((file) => {
              const baseName = path.basename(file, path.extname(file));
              const name = `Coursera Certificate ${baseName}`;
              const image = remoteImagePath("coursera", folder, file);
              const url = buildCertificateLink("coursera", baseName, image);
              return {
                id: baseName,
                name,
                image,
                source: "coursera" as const,
                url,
                markdownLink: buildMarkdownLink(name, image, url),
              };
            });
          subCertificatesMap[folder] = subs;
        } catch (err) {
          console.warn("Error reading coursera subfolder:", folder, err);
        }
      });

      files.forEach((file) => {
        const baseName = path.basename(file, path.extname(file));
        const subs = subCertificatesMap[baseName] || [];
        const name = `Coursera Certificate ${baseName}`;
        const image = remoteImagePath("coursera", file);
        const url = buildCertificateLink("coursera", baseName, image);
        certificates.push({
          id: baseName,
          name,
          image,
          source: "coursera",
          url,
          markdownLink: buildMarkdownLink(name, image, url),
          subCertificates: subs.length > 0 ? subs : undefined,
        });
      });
    } catch (err) {
      console.warn("Error reading coursera directory:", err);
    }
  }

  // 4. Process wadhwani/ subdirectory
  const wadhwaniDir = path.join(certificatesDir, "wadhwani");
  if (fs.existsSync(wadhwaniDir)) {
    try {
      const wadhwaniContents = fs.readdirSync(wadhwaniDir);
      const subfolders = wadhwaniContents.filter((item) => {
        try {
          return fs.statSync(path.join(wadhwaniDir, item)).isDirectory();
        } catch {
          return false;
        }
      });

      const files = wadhwaniContents.filter((item) => {
        try {
          return fs.statSync(path.join(wadhwaniDir, item)).isFile() && imageExtensions.includes(path.extname(item).toLowerCase());
        } catch {
          return false;
        }
      });

      const subCertificatesMap: Record<string, SubCertificate[]> = {};
      subfolders.forEach((folder) => {
        const folderPath = path.join(wadhwaniDir, folder);
        try {
          const subFiles = fs.readdirSync(folderPath);
          const subs: SubCertificate[] = subFiles
            .filter((file) => imageExtensions.includes(path.extname(file).toLowerCase()))
            .map((file) => {
              const baseName = path.basename(file, path.extname(file));
              const name = `Wadhwani Certificate ${baseName}`;
              const image = remoteImagePath("wadhwani", folder, file);
              const url = buildCertificateLink("wadhwani", baseName, image);
              return {
                id: baseName,
                name,
                image,
                source: "wadhwani" as const,
                url,
                markdownLink: buildMarkdownLink(name, image, url),
              };
            });
          subCertificatesMap[folder] = subs;
        } catch (err) {
          console.warn("Error reading wadhwani subfolder:", folder, err);
        }
      });

      files.forEach((file) => {
        const baseName = path.basename(file, path.extname(file));
        const subs = subCertificatesMap[baseName] || [];
        const name = `Wadhwani Certificate ${baseName}`;
        const image = remoteImagePath("wadhwani", file);
        const url = buildCertificateLink("wadhwani", baseName, image);
        certificates.push({
          id: baseName,
          name,
          image,
          source: "wadhwani",
          url,
          markdownLink: buildMarkdownLink(name, image, url),
          subCertificates: subs.length > 0 ? subs : undefined,
        });
      });
    } catch (err) {
      console.warn("Error reading wadhwani directory:", err);
    }
  }

  return certificates.length > 0 ? [...baseCerts, ...certificates] : baseCerts;
}
