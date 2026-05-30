import type { CanvasArrow, CanvasItem } from "@/types/canvas";
import type { DoodleConcept, SceneBlueprint } from "@/types/doodle-app";
import { intensityToConfig, speedToDuration } from "@/lib/canvas-math";
import { prepareBoardBlueprint } from "@/lib/prepare-board-scene";

let id = 0;
const nextId = () => `item-${++id}-${Date.now()}`;

export function buildSceneFromBlueprint(
  blueprint: SceneBlueprint,
  concept: Pick<DoodleConcept, "config" | "speed" | "intensity">,
): { items: CanvasItem[]; arrows: CanvasArrow[] } {
  const baseConfig = intensityToConfig(concept.intensity, {
    ...concept.config,
    duration: speedToDuration(concept.speed),
  });

  const items: CanvasItem[] = [];

  (blueprint.fillers ?? []).forEach((f) => {
    items.push({
      id: nextId(),
      kind: "filler",
      type: f.type,
      x: f.x,
      y: f.y,
      scale: f.scale ?? 1,
      rotation: f.rotation ?? 0,
    });
  });

  blueprint.objects.forEach((obj) => {
    items.push({
      id: nextId(),
      kind: "object",
      type: obj.type,
      x: obj.x,
      y: obj.y,
      scale: obj.scale ?? 1,
      config: intensityToConfig(concept.intensity, baseConfig),
      speed: concept.speed,
      intensity: concept.intensity,
      playStyle: "float",
      ...(obj.type === "cat" && obj.catEmotion ? { catEmotion: obj.catEmotion } : {}),
    });
  });

  blueprint.stickers.forEach((s) => {
    items.push({
      id: nextId(),
      kind: "sticker",
      label: s.label,
      x: s.x,
      y: s.y,
      rotation: s.rotation,
    });
  });

  blueprint.notes.forEach((n) => {
    items.push({
      id: nextId(),
      kind: "note",
      text: n.text,
      x: n.x,
      y: n.y,
      rotation: n.rotation ?? (Math.random() - 0.5) * 6,
    });
  });

  return { items, arrows: [] };
}

export function buildSceneFromConcept(concept: DoodleConcept, prompt: string) {
  const blueprint = prepareBoardBlueprint(concept, prompt);
  return buildSceneFromBlueprint(blueprint, concept);
}
