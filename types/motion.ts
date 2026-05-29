export type MotionType =
  | "fadeIn"
  | "slideUp"
  | "slideDown"
  | "slideLeft"
  | "slideRight"
  | "scaleIn"
  | "bounce"
  | "pulse"
  | "shake"
  | "expand"
  | "collapse"
  | "scrollReveal";

export interface MotionConfig {
  type: MotionType;
  duration: number;
  delay: number;
  distance: number;
  scale: number;
  stagger: boolean;
  easing: string;
  effect: string | null;
}

export type ExportFormat = "react" | "framer" | "css";

export type PresetId = "apple" | "stripe" | "linear" | "vercel" | "notion";

export interface MotionPreset {
  id: PresetId;
  name: string;
  description: string;
  prompt: string;
  config: MotionConfig;
}

export interface ParserResult {
  config: MotionConfig;
  matchedKeywords: string[];
}

export interface MotionParser {
  parse(prompt: string, base?: Partial<MotionConfig>): ParserResult;
}
