import type { CatEmotion } from "@/lib/cat-emotion";
import type { MotionConfig } from "@/types/motion";

export type FillerType =
  | "star"
  | "heart"
  | "sparkle"
  | "swirl"
  | "dot"
  | "arrow"
  | "cloud";

export type CanvasObjectType =
  | "cloud"
  | "dog"
  | "rocket"
  | "plant"
  | "star"
  | "ball"
  | "cat"
  | "plane"
  | "coffee"
  | "laptop"
  | "moon"
  | "zzz"
  | "monitor"
  | "popup";

export type StickerLabel =
  | "WOW"
  | "MAGIC"
  | "FAST"
  | "SMOOTH"
  | "BOUNCE"
  | "AI"
  | "SHIP IT";

export type PlayAnimStyle =
  | "float"
  | "bounce"
  | "spin"
  | "wiggle"
  | "pulse"
  | "shake";

export interface CanvasObject {
  id: string;
  kind: "object";
  type: CanvasObjectType;
  x: number;
  y: number;
  scale: number;
  config: MotionConfig;
  speed: number;
  intensity: number;
  playStyle?: PlayAnimStyle;
  catEmotion?: CatEmotion;
}

export interface CanvasFiller {
  id: string;
  kind: "filler";
  type: FillerType;
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export interface CanvasSticker {
  id: string;
  kind: "sticker";
  /** Preset label; use customText for user-created stickers. */
  label: StickerLabel;
  customText?: string;
  x: number;
  y: number;
  rotation: number;
}

export interface CanvasNote {
  id: string;
  kind: "note";
  text: string;
  x: number;
  y: number;
  rotation: number;
}

export type CanvasItem = CanvasObject | CanvasSticker | CanvasNote | CanvasFiller;

export interface CanvasArrow {
  id: string;
  fromId: string;
  toId: string;
}
