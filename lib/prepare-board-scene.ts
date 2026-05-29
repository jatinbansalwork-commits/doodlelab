import { STAGE } from "@/lib/scene-bounds";
import { getThemeFromPrompt } from "@/lib/scene-recipes";
import type { CanvasObjectType, StickerLabel } from "@/types/canvas";
import type { ConceptMood, DoodleConcept, SceneBlueprint } from "@/types/doodle-app";

const HERO_SCALE: Record<ConceptMood, number> = {
  simple: 1.55,
  funny: 1.45,
  chaotic: 1.38,
};

type Placement = { type: CanvasObjectType; x: number; y: number; scale: number };

function sticker(
  label: StickerLabel,
  x: number,
  y: number,
  rotation: number,
): SceneBlueprint["stickers"][0] {
  return { label, x, y, rotation };
}

function note(
  text: string,
  x: number,
  y: number,
  rotation: number,
): SceneBlueprint["notes"][0] {
  return { text, x, y, rotation };
}

/** Layered illustration layout — hero center, props orbit, notes along bottom. */
function layeredLayout(
  mood: ConceptMood,
  heroType: CanvasObjectType,
  props: CanvasObjectType[],
  stickerSet: { label: StickerLabel; x: number; y: number; rot: number }[],
  noteSet: { text: string; x: number; y: number; rot: number }[],
): SceneBlueprint {
  const { cx, cy } = STAGE;
  const hs = HERO_SCALE[mood];

  const objects: Placement[] = [
    { type: heroType, x: cx - 72, y: cy - 58, scale: hs },
  ];

  const slots: Placement[] = [
    { type: "laptop", x: cx - 210, y: cy + 8, scale: 1.15 },
    { type: "coffee", x: cx + 118, y: cy + 18, scale: 1.12 },
    { type: "star", x: cx - 18, y: cy - 155, scale: mood === "chaotic" ? 1.05 : 0.92 },
    { type: "cloud", x: cx - 200, y: cy - 120, scale: 0.95 },
    { type: "plant", x: cx + 155, y: cy + 55, scale: 1 },
    { type: "popup", x: cx + 95, y: cy - 130, scale: 1.05 },
    { type: "monitor", x: cx - 175, y: cy - 45, scale: 1.08 },
    { type: "dog", x: cx + 130, y: cy - 35, scale: 1.1 },
    { type: "ball", x: cx - 130, y: cy + 95, scale: 0.95 },
    { type: "plane", x: cx + 200, y: cy - 90, scale: 0.9 },
  ];

  let slotIdx = 0;
  for (const type of props) {
    if (type === heroType) continue;
    const pref = slots.find((s) => s.type === type);
    if (pref) {
      objects.push(pref);
    } else if (slotIdx < slots.length) {
      const s = slots[slotIdx++]!;
      objects.push({ type, x: s.x, y: s.y, scale: s.scale * 0.95 });
    }
  }

  if (mood === "chaotic" && !objects.some((o) => o.type === "star")) {
    objects.push({ type: "star", x: cx + 80, y: cy - 140, scale: 0.88 });
  }
  if (mood !== "simple" && !objects.some((o) => o.type === "star")) {
    objects.push({ type: "star", x: cx + 60, y: cy - 145, scale: 0.85 });
  }

  const maxObjects = mood === "simple" ? 4 : mood === "funny" ? 6 : 8;
  const stickers = stickerSet.slice(0, mood === "simple" ? 1 : mood === "funny" ? 2 : 4).map((s) =>
    sticker(s.label, s.x, s.y, s.rot),
  );
  const notes = noteSet.slice(0, mood === "simple" ? 1 : mood === "funny" ? 2 : 3).map((n) =>
    note(n.text, n.x, n.y, n.rot),
  );

  return {
    objects: objects.slice(0, maxObjects),
    stickers,
    notes,
    connectObjects: false,
  };
}

function composeDesignerDeadline(concept: DoodleConcept): SceneBlueprint {
  const { mood, heroType } = concept;
  const hs = HERO_SCALE[mood];
  const { cx, cy } = STAGE;
  const hero: CanvasObjectType =
    heroType === "plant" || heroType === "cat" ? heroType : "cat";

  const objects: Placement[] = [
    { type: hero, x: cx - 68, y: cy - 52, scale: hs },
    { type: "laptop", x: cx - 205, y: cy + 12, scale: 1.18 },
    { type: "coffee", x: cx + 125, y: cy + 22, scale: 1.14 },
    { type: "monitor", x: cx - 165, y: cy - 48, scale: 1.05 },
    { type: "star", x: cx - 10, y: cy - 158, scale: 1 },
    { type: "star", x: cx + 95, y: cy - 135, scale: 0.88 },
  ];

  if (mood === "chaotic") {
    objects.push({ type: "popup", x: cx + 110, y: cy - 95, scale: 1.02 });
    objects.push({ type: "ball", x: cx - 120, y: cy + 88, scale: 0.92 });
  }

  const stickerSet =
    mood === "simple"
      ? [sticker("SMOOTH", cx - 175, cy - 95, -4)]
      : mood === "funny"
        ? [
            sticker("WOW", cx - 185, cy - 88, -6),
            sticker("MAGIC", cx + 175, cy + 75, 5),
          ]
        : [
            sticker("FAST", cx + 175, cy - 105, 7),
            sticker("SHIP IT", cx - 195, cy + 70, -5),
            sticker("WOW", cx + 160, cy + 95, 4),
            sticker("BOUNCE", cx - 40, cy - 118, -3),
          ];

  const noteSet =
    mood === "simple"
      ? [note("final_final v3", cx - 55, cy + 118, -2)]
      : mood === "funny"
        ? [
            note("make logo bigger", cx - 95, cy + 125, 3),
            note("asap pls", cx + 45, cy + 128, -4),
          ]
        : [
            note("DUE TODAY", cx - 110, cy + 122, 5),
            note("ship it!", cx + 15, cy + 128, -2),
            note("send help", cx + 115, cy + 120, 4),
          ];

  return {
    objects: objects.slice(0, mood === "simple" ? 4 : mood === "funny" ? 5 : 8),
    stickers: stickerSet,
    notes: noteSet,
    connectObjects: false,
  };
}

function collectProps(hero: CanvasObjectType, board: SceneBlueprint): CanvasObjectType[] {
  const list: CanvasObjectType[] = [];
  for (const o of board.objects) {
    if (o.type !== hero && !list.includes(o.type)) list.push(o.type);
  }
  return list;
}

export function composeBoardScene(concept: DoodleConcept, prompt: string): SceneBlueprint {
  const theme = getThemeFromPrompt(prompt);
  const { mood, heroType, board } = concept;

  if (theme === "designer-deadline") {
    return composeDesignerDeadline(concept);
  }

  const props = collectProps(heroType, board);
  const stickerFromBoard = board.stickers.map((s, i) => ({
    label: s.label,
    x: STAGE.cx + (i % 2 ? 165 : -175),
    y: STAGE.cy + (i % 2 ? -95 : 85),
    rot: s.rotation,
  }));

  const defaultStickers: { label: StickerLabel; x: number; y: number; rot: number }[] =
    mood === "simple"
      ? [{ label: "SMOOTH", x: STAGE.cx - 170, y: STAGE.cy - 100, rot: -5 }]
      : mood === "funny"
        ? [
            { label: "WOW", x: STAGE.cx - 180, y: STAGE.cy - 90, rot: -6 },
            { label: "BOUNCE", x: STAGE.cx + 170, y: STAGE.cy + 80, rot: 5 },
          ]
        : [
            { label: "FAST", x: STAGE.cx + 175, y: STAGE.cy - 100, rot: 7 },
            { label: "SHIP IT", x: STAGE.cx - 190, y: STAGE.cy + 75, rot: -5 },
            { label: "WOW", x: STAGE.cx + 155, y: STAGE.cy + 95, rot: 4 },
          ];

  const noteFromBoard = board.notes.map((n, i) => ({
    text: n.text,
    x: STAGE.cx - 90 + i * 95,
    y: STAGE.cy + 125,
    rot: n.rotation ?? 0,
  }));

  const defaultNotes =
    mood === "simple"
      ? [{ text: "your idea ✨", x: STAGE.cx - 70, y: STAGE.cy + 120, rot: -2 }]
      : mood === "funny"
        ? [
            { text: "plot twist!", x: STAGE.cx - 95, y: STAGE.cy + 125, rot: 3 },
            { text: "lol", x: STAGE.cx + 50, y: STAGE.cy + 128, rot: -3 },
          ]
        : [
            { text: "DUE NOW", x: STAGE.cx - 105, y: STAGE.cy + 122, rot: 5 },
            { text: "go wild", x: STAGE.cx + 10, y: STAGE.cy + 128, rot: -2 },
            { text: "!!!", x: STAGE.cx + 110, y: STAGE.cy + 120, rot: 6 },
          ];

  return layeredLayout(
    mood,
    heroType,
    props,
    stickerFromBoard.length ? stickerFromBoard : defaultStickers,
    noteFromBoard.length ? noteFromBoard : defaultNotes,
  );
}

export function prepareBoardBlueprint(concept: DoodleConcept, prompt: string): SceneBlueprint {
  return composeBoardScene(concept, prompt);
}
