import type { CanvasObjectType } from "@/types/canvas";
import type { ConceptMood, SceneBlueprint } from "@/types/doodle-app";
import type { Theme } from "@/lib/scene-recipes";

const PREVIEW_W = 360;
const PREVIEW_H = 400;

/** Build large card previews — three distinct creative worlds per mood. */
export function buildCardPreview(
  base: SceneBlueprint,
  board: SceneBlueprint,
  mood: ConceptMood,
  hero: CanvasObjectType,
  theme: Theme = "generic",
): SceneBlueprint {
  if (theme === "dog-work") {
    return buildDogWorkPreview(mood, hero);
  }

  const scalePos = mood === "simple" ? 3.1 : mood === "funny" ? 2.85 : 2.55;
  const scaleObj = mood === "simple" ? 1.65 : mood === "funny" ? 1.35 : 1.05;

  let objects = base.objects.map((o) => ({
    ...o,
    x: 20 + o.x * scalePos * 0.9,
    y: 14 + o.y * scalePos * 0.82,
    scale: (o.scale ?? 1) * scaleObj,
  }));

  let stickers = base.stickers.map((s) => ({
    ...s,
    x: 14 + s.x * scalePos * 0.85,
    y: 10 + s.y * scalePos * 0.8,
  }));

  let notes = base.notes.map((n) => ({
    ...n,
    x: 18 + n.x * scalePos * 0.85,
    y: 8 + n.y * scalePos * 0.8,
  }));

  if (mood === "simple") {
    objects = objects.slice(0, 4);
    stickers = [];
    notes = notes.slice(0, 1);
    objects = objects.map((o) => ({
      ...o,
      x: o.x + 24,
      y: o.y + 28,
      scale: (o.scale ?? 1) * 1.15,
    }));
  }

  if (mood === "funny") {
    if (!objects.some((o) => o.type === "popup")) {
      objects.push({ type: "popup", x: PREVIEW_W - 90, y: 24, scale: 1.1 });
    }
    if (!objects.some((o) => o.type === "zzz")) {
      objects.push({ type: "zzz", x: 200, y: 20, scale: 1.05 });
    }
    if (!stickers.length && board.stickers.length) {
      stickers = board.stickers.slice(0, 2).map((s, i) => ({
        ...s,
        x: 220 + i * 75,
        y: 18 + i * 18,
        rotation: s.rotation + (i % 2 ? 6 : -4),
      }));
    }
  }

  if (mood === "chaotic") {
    const extraObjects = board.objects
      .filter((o) => !objects.some((x) => x.type === o.type))
      .slice(0, 6)
      .map((o, i) => ({
        type: o.type,
        x: 24 + (i % 4) * 78,
        y: 200 + Math.floor(i / 4) * 70,
        scale: 0.95 + (i % 3) * 0.1,
      }));
    objects = [...objects, ...extraObjects].slice(0, 12);
    stickers = [
      ...stickers,
      ...board.stickers.slice(0, 4).map((s, i) => ({
        ...s,
        x: 20 + i * 88,
        y: PREVIEW_H - 70 + (i % 2) * 22,
        rotation: s.rotation + i * 5,
      })),
    ].slice(0, 5);
    notes = [
      ...notes,
      ...board.notes.slice(0, 3).map((n, i) => ({
        ...n,
        x: 200 + i * 48,
        y: PREVIEW_H - 55,
      })),
    ];
    if (!objects.some((o) => o.type === "star")) {
      objects.push({ type: "star", x: PREVIEW_W - 50, y: 28, scale: 1 });
    }
  }

  const hasHero = objects.some((o) => o.type === hero);
  if (!hasHero) {
    objects.unshift({
      type: hero,
      x: mood === "simple" ? 120 : 100,
      y: mood === "chaotic" ? 100 : 80,
      scale: mood === "simple" ? 1.7 : 1.35,
    });
  }

  return { objects, stickers, notes, connectObjects: false };
}

function buildDogWorkPreview(mood: ConceptMood, hero: CanvasObjectType): SceneBlueprint {
  if (mood === "simple") {
    return {
      objects: [
        { type: "cloud", x: 28, y: 22, scale: 1.35 },
        { type: hero, x: 72, y: 120, scale: 1.85 },
        { type: "coffee", x: 248, y: 155, scale: 1.25 },
        { type: "plant", x: 280, y: 280, scale: 1.05 },
      ],
      stickers: [],
      notes: [{ text: "briefcase ✓", x: 36, y: 320, rotation: -3 }],
      connectObjects: false,
    };
  }

  if (mood === "funny") {
    return {
      objects: [
        { type: hero, x: 48, y: 140, scale: 1.9 },
        { type: "laptop", x: 220, y: 200, scale: 1.3 },
        { type: "plane", x: 18, y: 48, scale: 1.1 },
        { type: "plane", x: 290, y: 36, scale: 1.05 },
        { type: "popup", x: 250, y: 52, scale: 1.15 },
        { type: "coffee", x: 300, y: 280, scale: 1 },
      ],
      stickers: [
        { label: "WOW", x: 16, y: 28, rotation: -7 },
        { label: "FAST", x: 200, y: 320, rotation: 6 },
      ],
      notes: [{ text: "LATE!!!", x: 120, y: 340, rotation: 5 }],
      connectObjects: false,
    };
  }

  return {
    objects: [
      { type: hero, x: 24, y: 110, scale: 1.35 },
      { type: hero, x: 130, y: 150, scale: 1.2 },
      { type: hero, x: 240, y: 95, scale: 1.15 },
      { type: "monitor", x: 12, y: 60, scale: 1.1 },
      { type: "coffee", x: 290, y: 250, scale: 1 },
      { type: "ball", x: 310, y: 180, scale: 0.95 },
      { type: "star", x: 300, y: 28, scale: 1.1 },
      { type: "star", x: 20, y: 280, scale: 1 },
      { type: "plane", x: 160, y: 32, scale: 1.05 },
      { type: "popup", x: 200, y: 260, scale: 1 },
    ],
    stickers: [
      { label: "BOUNCE", x: 8, y: 16, rotation: -10 },
      { label: "FAST", x: 100, y: 340, rotation: 8 },
      { label: "SHIP IT", x: 220, y: 320, rotation: -5 },
      { label: "WOW", x: 310, y: 310, rotation: 4 },
    ],
    notes: [
      { text: "HELP", x: 48, y: 350, rotation: 6 },
      { text: "meeting??", x: 150, y: 355, rotation: -4 },
      { text: "woof x3", x: 260, y: 348, rotation: 7 },
    ],
    connectObjects: false,
  };
}
