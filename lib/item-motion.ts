import { burstForAction, type MicroAction } from "@/lib/micro-interactions";
import type { CanvasItem, PlayAnimStyle } from "@/types/canvas";
import type { MotionConfig } from "@/types/motion";

export function motionKeyForObject(item: {
  speed: number;
  intensity: number;
  playStyle?: PlayAnimStyle;
  config: MotionConfig;
}) {
  return `${item.speed}-${item.intensity}-${item.playStyle ?? "float"}-${item.config.duration}-${item.config.distance}-${item.config.delay}`;
}

export function liveMotionForStyle(
  style: PlayAnimStyle,
  config: MotionConfig,
) {
  const amp = 5 + (config.distance / 56) * 16;
  const dur = Math.max(0.28, config.duration);
  const base = {
    transition: {
      duration: dur,
      repeat: Infinity,
      ease: "easeInOut" as const,
      delay: config.delay,
    },
  };

  switch (style) {
    case "bounce":
      return {
        animate: { y: [0, -amp * 1.4, 0], scale: [1, 1.04, 1] },
        ...base,
      };
    case "spin":
      return {
        animate: { rotate: [0, 6, -6, 0] },
        transition: { ...base.transition, duration: dur * 1.2 },
      };
    case "wiggle":
      return {
        animate: { rotate: [0, -5, 5, -3, 0], x: [0, 2, -2, 0] },
        ...base,
      };
    case "pulse":
      return {
        animate: { scale: [1, 1.08, 1] },
        ...base,
      };
    case "shake":
      return {
        animate: { x: [0, -amp * 0.4, amp * 0.4, -amp * 0.25, 0] },
        transition: { ...base.transition, duration: dur * 0.7 },
      };
    case "float":
    default:
      return {
        animate: { y: [0, -amp, 0] },
        ...base,
      };
  }
}

export function liveObjectMotion(
  config: MotionConfig,
  playStyle: PlayAnimStyle = "float",
) {
  return liveMotionForStyle(playStyle, config);
}

export function burstForItem(item: CanvasItem, action: MicroAction = "default") {
  return burstForAction(action, item);
}

export const ANIM_STYLE_CYCLE: PlayAnimStyle[] = [
  "bounce",
  "float",
  "wiggle",
  "pulse",
  "spin",
  "shake",
];

export const ANIM_STYLE_LABEL: Record<PlayAnimStyle, string> = {
  bounce: "Bounce",
  float: "Float",
  spin: "Spin",
  wiggle: "Wiggle",
  pulse: "Pulse",
  shake: "Shake",
};
