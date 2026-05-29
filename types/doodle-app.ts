import type { CanvasObjectType, StickerLabel } from "@/types/canvas";
import type { MotionConfig } from "@/types/motion";

export type AppPhase = "prompt" | "concepts" | "canvas";

export type ConceptMood = "simple" | "funny" | "chaotic";

export interface SceneObjectPlacement {
  type: CanvasObjectType;
  x: number;
  y: number;
  scale?: number;
}

export interface SceneStickerPlacement {
  label: StickerLabel;
  x: number;
  y: number;
  rotation: number;
}

export interface SceneNotePlacement {
  text: string;
  x: number;
  y: number;
  rotation?: number;
}

export interface SceneBlueprint {
  objects: SceneObjectPlacement[];
  stickers: SceneStickerPlacement[];
  notes: SceneNotePlacement[];
  connectObjects?: boolean;
}

export interface ConceptStats {
  doodles: number;
  stickers: number;
  animations: number;
}

export interface DoodleConcept {
  id: string;
  mood: ConceptMood;
  title: string;
  description: string;
  badge: string;
  heroType: CanvasObjectType;
  speed: number;
  intensity: number;
  config: MotionConfig;
  preview: SceneBlueprint;
  board: SceneBlueprint;
  stats: ConceptStats;
}

export type ExportFormat = "gif" | "svg" | "react" | "framer";
