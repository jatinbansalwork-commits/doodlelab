import type { CanvasObjectType, StickerLabel } from "@/types/canvas";
import type { ConceptMood } from "@/types/doodle-app";
import type { CatEmotion } from "@/lib/cat-emotion";

export type ThemePackId = "work" | "startup" | "space" | "love" | "school";

export interface ThemePack {
  id: ThemePackId;
  label: string;
  heroes: CanvasObjectType[];
  props: CanvasObjectType[];
  stickers: StickerLabel[];
  noteSnippets: string[];
  catEmotionBias: CatEmotion[];
}

export const THEME_PACKS: Record<ThemePackId, ThemePack> = {
  work: {
    id: "work",
    label: "Work",
    heroes: ["cat", "dog", "coffee"],
    props: ["laptop", "monitor", "coffee", "plant", "popup", "zzz", "star"],
    stickers: ["FAST", "SHIP IT", "SMOOTH", "WOW"],
    noteSnippets: ["DUE TODAY", "standup @ 9", "send help", "final_final v3", "asap pls"],
    catEmotionBias: ["sleepy", "confused", "happy"],
  },
  startup: {
    id: "startup",
    label: "Startup",
    heroes: ["rocket", "cat", "dog"],
    props: ["laptop", "coffee", "star", "plane", "popup", "ball", "monitor"],
    stickers: ["SHIP IT", "FAST", "WOW", "BOUNCE"],
    noteSnippets: ["ship it!", "mvp time", "pivot??", "users!!!", "demo day"],
    catEmotionBias: ["excited", "happy", "surprised"],
  },
  space: {
    id: "space",
    label: "Space",
    heroes: ["rocket", "moon", "star"],
    props: ["star", "cloud", "ball", "cat", "plane", "moon"],
    stickers: ["MAGIC", "WOW", "BOUNCE"],
    noteSnippets: ["to the moon", "blast off", "alien vibes", "zero g"],
    catEmotionBias: ["surprised", "excited", "happy"],
  },
  love: {
    id: "love",
    label: "Love",
    heroes: ["cat", "dog", "star"],
    props: ["star", "ball", "cloud", "coffee", "plant", "moon"],
    stickers: ["WOW", "MAGIC", "BOUNCE"],
    noteSnippets: ["xoxo", "be mine", "cute!", "aww", "💕 vibes"],
    catEmotionBias: ["happy", "excited", "surprised"],
  },
  school: {
    id: "school",
    label: "School",
    heroes: ["cat", "dog", "coffee"],
    props: ["laptop", "coffee", "popup", "ball", "star", "plant", "zzz"],
    stickers: ["FAST", "WOW", "SMOOTH"],
    noteSnippets: ["exam tomorrow", "late homework", "study break", "quiz soon"],
    catEmotionBias: ["confused", "sleepy", "surprised"],
  },
};

const PACK_ORDER: ThemePackId[] = ["work", "startup", "space", "love", "school"];

/** Select theme pack from prompt keywords (used before scene generation). */
export function pickThemePack(prompt: string, mood?: ConceptMood): ThemePackId {
  const t = prompt.toLowerCase();
  if (/\blove\b|\bheart\b|\bvalentine\b|\bcrush\b|\bdate\b/.test(t)) return "love";
  if (/\bspace\b|\brocket\b|\bmoon\b|\balien\b|\bplanet\b|\bgalaxy\b/.test(t)) return "space";
  if (/\bschool\b|\bstudy\b|\bexam\b|\bhomework\b|\bclass\b|\bcollege\b/.test(t)) return "school";
  if (/\bstartup\b|\blaunch\b|\bfounder\b|\bpitch\b|\bvc\b|\bmvp\b/.test(t)) return "startup";
  if (/\bwork\b|\boffice\b|\bdeadline\b|\bmeeting\b|\bdesigner\b|\bjob\b/.test(t)) return "work";

  if (mood === "chaotic") return "startup";
  if (mood === "funny") return "school";
  const hash = t.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return PACK_ORDER[hash % PACK_ORDER.length]!;
}

export function getThemePack(id: ThemePackId): ThemePack {
  return THEME_PACKS[id];
}
