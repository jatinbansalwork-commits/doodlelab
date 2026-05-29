import type { CanvasObjectType, StickerLabel } from "@/types/canvas";

export const CHARACTER_TYPES: CanvasObjectType[] = [
  "dog",
  "cat",
  "cloud",
  "coffee",
  "rocket",
  "star",
  "ball",
  "plant",
  "plane",
  "laptop",
  "moon",
  "popup",
];

export const STICKER_LABELS: StickerLabel[] = [
  "WOW",
  "FAST",
  "MAGIC",
  "AI",
  "SHIP IT",
  "BOUNCE",
];

export function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

export function nextCharacterType(current?: CanvasObjectType): CanvasObjectType {
  if (!current) return pickRandom(CHARACTER_TYPES);
  const i = CHARACTER_TYPES.indexOf(current);
  return CHARACTER_TYPES[(i + 1) % CHARACTER_TYPES.length]!;
}
