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
  const match = text.match(/<emotion>(.*?)<\/emotion>/);
  if (match) {
    const emotion = match[1].trim().toLowerCase();
    const cleanText = text.replace(/<emotion>.*?<\/emotion>/g, "").trim();
    return {
      cleanText,
      emotion: ROSE_EMOTIONS[emotion] ? emotion : "happy",
    };
  }
  return { cleanText: text, emotion: "happy" };
}
