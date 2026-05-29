import type { MotionConfig } from "@/types/motion";
import { MOTION_TYPE_LABELS } from "@/lib/constants";

export function generateCssCode(config: MotionConfig): string {
  const label = MOTION_TYPE_LABELS[config.type] ?? config.type;
  const name = `motionlab-${config.type}`;
  const easing = mapEasing(config.easing);

  return `/* ${label} — DoodleLab AI */

${keyframes(config, name)}

.motionlab-animate {
  animation: ${name} ${config.duration}s ${easing} ${config.delay}s both;
}
${config.stagger ? `
.motionlab-animate:nth-child(1) { animation-delay: ${config.delay}s; }
.motionlab-animate:nth-child(2) { animation-delay: calc(${config.delay}s + 0.15s); }
.motionlab-animate:nth-child(3) { animation-delay: calc(${config.delay}s + 0.3s); }
` : ""}`;
}

function mapEasing(easing: string): string {
  const map: Record<string, string> = {
    "ease-out": "cubic-bezier(0.16, 1, 0.3, 1)",
    "ease-in": "ease-in",
    "ease-in-out": "ease-in-out",
    linear: "linear",
    spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  };
  return map[easing] ?? "ease-out";
}

function keyframes(config: MotionConfig, name: string): string {
  const d = config.distance;
  switch (config.type) {
    case "slideUp":
      return `@keyframes ${name} {
  from { opacity: 0; transform: translateY(${d}px); }
  to { opacity: 1; transform: translateY(0); }
}`;
    case "slideDown":
      return `@keyframes ${name} {
  from { opacity: 0; transform: translateY(-${d}px); }
  to { opacity: 1; transform: translateY(0); }
}`;
    case "scaleIn":
      return `@keyframes ${name} {
  from { opacity: 0; transform: scale(${config.scale * 0.85}); }
  to { opacity: 1; transform: scale(1); }
}`;
    case "bounce":
      return `@keyframes ${name} {
  0% { opacity: 0; transform: translateY(${d * 0.5}px) scale(0.92); }
  60% { transform: translateY(-6px) scale(1.02); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}`;
    case "pulse":
      return `@keyframes ${name} {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.04); }
}`;
  default:
      return `@keyframes ${name} {
  from { opacity: 0; }
  to { opacity: 1; }
}`;
  }
}
