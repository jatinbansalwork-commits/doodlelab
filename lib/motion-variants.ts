import type { Variants } from "framer-motion";
import type { MotionConfig, MotionType } from "@/types/motion";

export function createMotionVariants(config: MotionConfig): {
  container: Variants;
  item: Variants;
} {
  const hidden = getHiddenState(config.type, config.distance, config.scale);
  const visible = getVisibleState(config);

  const itemTransition = {
    duration: config.duration,
    delay: config.delay,
    ease: easingToFramer(config.easing),
  };

  return {
    container: {
      hidden: { opacity: 0 },
      visible: config.stagger
        ? {
            opacity: 1,
            transition: {
              staggerChildren: 0.15,
              delayChildren: config.delay,
            },
          }
        : {
            opacity: 1,
            transition: itemTransition,
          },
    },
    item: {
      hidden,
      visible,
    },
  };
}

function easingToFramer(easing: string): [number, number, number, number] {
  const map: Record<string, [number, number, number, number]> = {
    "ease-out": [0.16, 1, 0.3, 1],
    "ease-in": [0.4, 0, 1, 1],
    "ease-in-out": [0.4, 0, 0.2, 1],
    linear: [0, 0, 1, 1],
    spring: [0.34, 1.56, 0.64, 1],
  };
  return map[easing] ?? [0.16, 1, 0.3, 1];
}

function getHiddenState(type: MotionType, distance: number, scale: number) {
  switch (type) {
    case "fadeIn":
      return { opacity: 0 };
    case "slideUp":
      return { opacity: 0, y: distance };
    case "slideDown":
      return { opacity: 0, y: -distance };
    case "slideLeft":
      return { opacity: 0, x: distance };
    case "slideRight":
      return { opacity: 0, x: -distance };
    case "scaleIn":
      return { opacity: 0, scale: scale * 0.85 };
    case "bounce":
      return { opacity: 0, y: distance * 0.5, scale: 0.92 };
    case "pulse":
      return { opacity: 0.7, scale: 0.96 };
    case "shake":
      return { opacity: 0, x: -6 };
    case "expand":
      return { opacity: 0, height: 0, scaleY: 0.85 };
    case "collapse":
      return { opacity: 1, scaleY: 1 };
    case "scrollReveal":
      return { opacity: 0, y: distance * 0.75 };
    default:
      return { opacity: 0 };
  }
}

function getVisibleState(config: MotionConfig) {
  const { type, duration, delay, easing } = config;
  const base = {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    height: "auto" as const,
    scaleY: 1,
  };

  switch (type) {
    case "bounce":
      return {
        ...base,
        transition: {
          type: "spring" as const,
          stiffness: 420,
          damping: 14,
          delay,
        },
      };
    case "pulse":
      return {
        ...base,
        scale: [0.96, 1.04, 1],
        transition: { duration, repeat: Infinity, ease: "easeInOut" as const },
      };
    case "shake":
      return {
        ...base,
        x: [0, -8, 8, -5, 5, 0],
        transition: { duration, delay },
      };
    case "collapse":
      return {
        opacity: 0,
        scaleY: 0.8,
        transition: { duration, delay, ease: easingToFramer(easing) },
      };
    default:
      return {
        ...base,
        transition: { duration, delay, ease: easingToFramer(easing) },
      };
  }
}

export function isLoopingMotion(type: MotionType): boolean {
  return type === "pulse";
}
