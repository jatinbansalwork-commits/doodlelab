import { DEFAULT_MOTION_CONFIG } from "@/lib/constants";
import { intensityToConfig, speedToDuration } from "@/lib/canvas-math";
import { computeConceptStats } from "@/lib/concept-stats";
import { detectCanvasObject } from "@/lib/detect-canvas-object";
import { buildCardPreview } from "@/lib/preview-blueprints";
import {
  applyHeroToBlueprint,
  getConceptRecipes,
  getThemeFromPrompt,
} from "@/lib/scene-recipes";
import type { ConceptMood, DoodleConcept } from "@/types/doodle-app";

let id = 0;
const nid = () => `concept-${++id}`;

const MOOD_BADGE: Record<ConceptMood, string> = {
  simple: "Simple",
  funny: "Funny",
  chaotic: "Chaotic",
};

const MOOD_PRESETS: Record<
  ConceptMood,
  { speed: number; intensity: number }
> = {
  simple: { speed: 32, intensity: 28 },
  funny: { speed: 58, intensity: 52 },
  chaotic: { speed: 88, intensity: 90 },
};

export function generateConcepts(prompt: string): DoodleConcept[] {
  const hero = detectCanvasObject(prompt);
  const theme = getThemeFromPrompt(prompt);
  const recipes = getConceptRecipes(prompt);
  const moods: ConceptMood[] = ["simple", "funny", "chaotic"];

  return moods.map((mood) => {
    const recipe = recipes[mood];
    const { speed, intensity } = MOOD_PRESETS[mood];
    const config = intensityToConfig(intensity, {
      ...DEFAULT_MOTION_CONFIG,
      duration: speedToDuration(speed),
      stagger: mood === "chaotic",
    });

    const board = applyHeroToBlueprint(recipe.board, hero, { x: 420, y: 300 });
    const preview = buildCardPreview(
      applyHeroToBlueprint(recipe.preview, hero, { x: 55, y: 50 }),
      board,
      mood,
      hero,
      theme,
    );

    return {
      id: nid(),
      mood,
      title: recipe.title,
      description: recipe.description,
      badge: MOOD_BADGE[mood],
      heroType: hero,
      speed,
      intensity,
      config,
      preview,
      board,
      stats: computeConceptStats(board, mood),
    };
  });
}
