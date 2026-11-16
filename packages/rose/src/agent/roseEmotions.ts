export const ROSE_EMOTIONS: Record<string, string> = {
  happy: "/rose/happy.png",
  bright: "/rose/bright.png",
  coding: "/rose/coding.png",
  confused: "/rose/confused.png",
  researching: "/rose/researching.png",
  sad: "/rose/sad.png",
  sleeping: "/rose/sleeping.png",
  surprised: "/rose/surprised.png",
  thinking: "/rose/thinking.png",
};

export function extractEmotion(text: string): { cleanText: string; emotion: string } {
  if (!text) return { cleanText: "", emotion: "happy" };
  let emotion = "happy";
  const match = text.match(/<emotion>(.*?)<\/emotion>/i);
  if (match) {
    const candidate = match[1].trim().toLowerCase();
    if (ROSE_EMOTIONS[candidate]) {
      emotion = candidate;
    }
  }

  // Strip both complete and trailing incomplete <emotion... tags so they never show in UI
  const cleanText = text
    .replace(/<emotion>[\s\S]*?<\/emotion>/gi, "")
    .replace(/<emotion[\s\S]*?$/gi, "")
    .trim();

  return { cleanText, emotion };
}
