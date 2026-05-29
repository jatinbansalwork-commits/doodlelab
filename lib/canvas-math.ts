import type { CanvasObject } from "@/types/canvas";
import type { MotionConfig } from "@/types/motion";

export function speedToDuration(speed: number): number {
  return Math.max(0.2, Math.min(1.6, 1.5 - (speed / 100) * 1.2));
}

export function intensityToConfig(intensity: number, config: MotionConfig): MotionConfig {
  const t = intensity / 100;
  return {
    ...config,
    distance: Math.round(12 + t * 56),
    scale: 0.92 + t * 0.16,
  };
}

export function speedLabel(speed: number): string {
  if (speed > 66) return "Fast";
  if (speed < 33) return "Slow";
  return "Medium";
}

export function intensityLabel(intensity: number): string {
  if (intensity > 66) return "Strong";
  if (intensity < 33) return "Soft";
  return "Medium";
}

export function objectConfig(obj: CanvasObject): MotionConfig {
  return intensityToConfig(obj.intensity, {
    ...obj.config,
    duration: speedToDuration(obj.speed),
  });
}

export function arrowPath(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): string {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2 - 40;
  return `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;
}
