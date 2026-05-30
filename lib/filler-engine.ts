import { STAGE } from "@/lib/scene-bounds";
import type { FillerType } from "@/types/canvas";
import type { ConceptMood } from "@/types/doodle-app";
import type { SceneFillerPlacement } from "@/types/doodle-app";

export const FILLER_TYPES: FillerType[] = [
  "star",
  "heart",
  "sparkle",
  "swirl",
  "dot",
  "arrow",
  "cloud",
];

const FILLER_SIZE = 28;
const PAD = 12;

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

function objectRect(
  x: number,
  y: number,
  scale = 1,
  w = 140,
  h = 120,
): Rect {
  return {
    x: x - 16,
    y: y - 12,
    w: w * scale + 32,
    h: h * scale + 24,
  };
}

function stickerRect(x: number, y: number): Rect {
  return { x: x - 8, y: y - 6, w: 100, h: 48 };
}

function noteRect(x: number, y: number): Rect {
  return { x: x - 8, y: y - 6, w: 160, h: 64 };
}

function overlaps(a: Rect, b: Rect, gap = 6): boolean {
  return !(
    a.x + a.w + gap < b.x ||
    b.x + b.w + gap < a.x ||
    a.y + a.h + gap < b.y ||
    b.y + b.h + gap < a.y
  );
}

function fits(rect: Rect, occupied: Rect[]): boolean {
  if (
    rect.x < PAD ||
    rect.y < PAD ||
    rect.x + rect.w > STAGE.width - PAD ||
    rect.y + rect.h > STAGE.height - PAD
  ) {
    return false;
  }
  return !occupied.some((o) => overlaps(rect, o, 10));
}

function countForMood(mood: ConceptMood): number {
  const base = mood === "simple" ? 12 : mood === "funny" ? 15 : 18;
  return base + Math.floor(Math.random() * 4);
}

export function injectSceneFillers(
  blueprint: {
    objects: { type: string; x: number; y: number; scale?: number }[];
    stickers: { x: number; y: number }[];
    notes: { x: number; y: number }[];
    fillers?: SceneFillerPlacement[];
  },
  mood: ConceptMood,
): SceneFillerPlacement[] {
  const occupied: Rect[] = [];

  for (const o of blueprint.objects) {
    occupied.push(objectRect(o.x, o.y, o.scale ?? 1));
  }
  for (const s of blueprint.stickers) {
    occupied.push(stickerRect(s.x, s.y));
  }
  for (const n of blueprint.notes) {
    occupied.push(noteRect(n.x, n.y));
  }

  const target = countForMood(mood);
  const fillers: SceneFillerPlacement[] = [];
  const maxAttempts = target * 40;

  for (let attempt = 0; attempt < maxAttempts && fillers.length < target; attempt++) {
    const type = FILLER_TYPES[Math.floor(Math.random() * FILLER_TYPES.length)]!;
    const scale = 0.65 + Math.random() * 0.55;
    const w = FILLER_SIZE * scale;
    const h = FILLER_SIZE * scale;
    const rect: Rect = {
      x: PAD + Math.random() * (STAGE.width - w - PAD * 2),
      y: PAD + Math.random() * (STAGE.height - h - PAD * 2),
      w,
      h,
    };

    if (!fits(rect, occupied)) continue;

    const placement: SceneFillerPlacement = {
      type,
      x: rect.x,
      y: rect.y,
      scale,
      rotation: (Math.random() - 0.5) * 40,
    };
    fillers.push(placement);
    occupied.push(rect);
  }

  return fillers;
}
