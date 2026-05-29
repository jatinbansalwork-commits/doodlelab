import { pickRandom, STICKER_LABELS } from "@/lib/board-actions";
import { composeBoardScene } from "@/lib/prepare-board-scene";
import { STAGE } from "@/lib/scene-bounds";
import type { CanvasObjectType } from "@/types/canvas";
import type { DoodleConcept, SceneBlueprint } from "@/types/doodle-app";

const EXTRA_PROPS: CanvasObjectType[] = [
  "star",
  "ball",
  "plane",
  "popup",
  "cloud",
  "coffee",
  "zzz",
];

/** 30–50% visual variation vs original composition. */
export function remixSceneBlueprint(
  concept: DoodleConcept,
  prompt: string,
): SceneBlueprint {
  const variant = Math.floor(Math.random() * 4);
  const base = composeBoardScene(concept, prompt);
  const { cx, cy } = STAGE;

  const angleShift = variant * (Math.PI / 2) + (Math.random() - 0.5) * 0.6;
  const radiusScale = 0.75 + variant * 0.12 + Math.random() * 0.2;

  const objects = base.objects.map((o, i) => {
    const angle = (i / Math.max(1, base.objects.length)) * Math.PI * 2 + angleShift;
    const radius = (i === 0 ? 0 : 70 + i * 28) * radiusScale;
    const isHero = i === 0;
    return {
      ...o,
      x: isHero ? cx - 72 + (Math.random() - 0.5) * 24 : cx + Math.cos(angle) * radius - 40,
      y: isHero ? cy - 48 + (Math.random() - 0.5) * 20 : cy + Math.sin(angle) * radius - 35,
      scale: (o.scale ?? 1) * (0.9 + Math.random() * 0.22),
    };
  });

  const extraCount = concept.mood === "simple" ? 1 : concept.mood === "funny" ? 2 : 3;
  for (let e = 0; e < extraCount; e++) {
    const type = pickRandom(EXTRA_PROPS);
    if (!objects.some((o) => o.type === type)) {
      objects.push({
        type,
        x: cx + (Math.random() - 0.5) * 200,
        y: cy + (Math.random() - 0.5) * 160,
        scale: 0.85 + Math.random() * 0.2,
      });
    }
  }

  const stickers = [
    ...base.stickers.map((s) => ({
      ...s,
      x: cx + (Math.random() - 0.5) * 280,
      y: cy + (Math.random() - 0.5) * 200,
      rotation: s.rotation + (Math.random() - 0.5) * 20,
    })),
    {
      label: pickRandom(STICKER_LABELS),
      x: cx + 140 + Math.random() * 40,
      y: cy - 110,
      rotation: (Math.random() - 0.5) * 14,
    },
  ].slice(0, 5);

  const notes = [
    ...base.notes.map((n) => ({
      ...n,
      x: cx - 120 + Math.random() * 240,
      y: cy + 100 + Math.random() * 50,
      rotation: (n.rotation ?? 0) + (Math.random() - 0.5) * 12,
    })),
    {
      text: pickRandom(["fresh remix!", "new energy", "plot twist", "let's go"]),
      x: cx + (Math.random() - 0.5) * 80,
      y: cy + 130,
      rotation: (Math.random() - 0.5) * 8,
    },
  ].slice(0, 4);

  return { objects, stickers, notes, connectObjects: false };
}
