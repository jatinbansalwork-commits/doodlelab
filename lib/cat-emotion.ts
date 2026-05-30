import type { ConceptMood } from "@/types/doodle-app";
import type { ThemePackId } from "@/lib/theme-packs";
import { getThemePack } from "@/lib/theme-packs";

export type CatEmotion =
  | "happy"
  | "sleepy"
  | "surprised"
  | "confused"
  | "excited"
  | "angry";

const MOOD_BIAS: Record<ConceptMood, CatEmotion[]> = {
  simple: ["happy", "sleepy", "happy"],
  funny: ["sleepy", "confused", "surprised", "happy"],
  chaotic: ["excited", "angry", "surprised", "confused"],
};

const PROMPT_BIAS: { pattern: RegExp; emotion: CatEmotion }[] = [
  { pattern: /\bangry\b|\bmad\b|\bgrrr\b/, emotion: "angry" },
  { pattern: /\bsleep\b|\btired\b|\bzzz\b|\bnap\b/, emotion: "sleepy" },
  { pattern: /\bwow\b|\bsurprise\b|\bwhoa\b/, emotion: "surprised" },
  { pattern: /\bconfus\b|\bhuh\b|\bwhat\b/, emotion: "confused" },
  { pattern: /\byay\b|\bexcited\b|\bhype\b|\bparty\b/, emotion: "excited" },
  { pattern: /\bhappy\b|\bjoy\b|\bcute\b/, emotion: "happy" },
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

export function pickCatEmotion(
  prompt: string,
  mood: ConceptMood,
  themePackId: ThemePackId,
): CatEmotion {
  const t = prompt.toLowerCase();
  for (const { pattern, emotion } of PROMPT_BIAS) {
    if (pattern.test(t)) return emotion;
  }
  const packBias = getThemePack(themePackId).catEmotionBias;
  if (Math.random() < 0.55) return pickRandom(packBias);
  return pickRandom(MOOD_BIAS[mood]);
}
