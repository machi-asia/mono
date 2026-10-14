export function getDiplomaImageLabel(url: string, fallback = "Document"): string {
  if (url.includes("highschool-graduation")) return "Graduation Portrait";
  if (url.includes("highschool-diploma")) return "Senior High School Diploma";
  if (url.includes("moving-up-certificate")) return "Moving-Up Certificate";
  if (url.includes("moving-up")) return "Moving-Up Portrait";
  if (url.includes("elementary-certificate")) return "Elementary Certificate";
  if (url.includes("kinder-graduation")) return "Kindergarten Graduation Photo";
  return fallback;
}
