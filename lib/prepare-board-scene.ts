import { composeClusteredScene } from "@/lib/clustered-layout";
import { injectSceneFillers } from "@/lib/filler-engine";
import { pickCatEmotion } from "@/lib/cat-emotion";
import { STAGE } from "@/lib/scene-bounds";
import { getThemeFromPrompt } from "@/lib/scene-recipes";
import type { CanvasObjectType, StickerLabel } from "@/types/canvas";
import type { ConceptMood, DoodleConcept, SceneBlueprint } from "@/types/doodle-app";

const HERO_SCALE: Record<ConceptMood, number> = {
  simple: 1.55,
  funny: 1.45,
  chaotic: 1.38,
};

import type { CatEmotion } from "@/lib/cat-emotion";

type Placement = {
  type: CanvasObjectType;
  x: number;
  y: number;
  scale: number;
  catEmotion?: CatEmotion;
};

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

function composeDesignerDeadline(concept: DoodleConcept, prompt: string): SceneBlueprint {
  const { mood, heroType } = concept;
  const hs = HERO_SCALE[mood];
  const { cx, cy } = STAGE;
  const hero: CanvasObjectType =
    heroType === "plant" || heroType === "cat" ? heroType : "cat";

  const objects: Placement[] = [
    {
      type: hero,
      x: cx - 68,
      y: cy - 52,
      scale: hs,
      ...(hero === "cat" ? { catEmotion: pickCatEmotion(prompt, mood, "work") } : {}),
    },
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

export function composeBoardScene(concept: DoodleConcept, prompt: string): SceneBlueprint {
  const theme = getThemeFromPrompt(prompt);

  if (theme === "designer-deadline") {
    const blueprint = composeDesignerDeadline(concept, prompt);
    return {
      ...blueprint,
      themePack: "work",
      fillers: injectSceneFillers(blueprint, concept.mood),
    };
  }

  return composeClusteredScene(concept, prompt);
}

export function prepareBoardBlueprint(concept: DoodleConcept, prompt: string): SceneBlueprint {
  return composeBoardScene(concept, prompt);
}
