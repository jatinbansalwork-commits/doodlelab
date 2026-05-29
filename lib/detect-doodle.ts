import type { DoodleId } from "@/types/doodle";

export function detectDoodle(prompt: string): DoodleId {
  const t = prompt.toLowerCase();
  if (/\bdog\b|\bpuppy\b|\bpup\b|\bwalk/.test(t)) return "dog";
  if (/\brocket\b|\blaunch\b|\bblastoff\b/.test(t)) return "rocket";
  if (/\bcloud\b|\bfloat\b|\bdrift\b|\bhover\b/.test(t)) return "cloud";
  if (/\bball\b|\bbounc/.test(t)) return "ball";
  if (/\bplant\b|\bgrow\b|\bflower\b|\bseed\b/.test(t)) return "plant";
  if (/\bonboard|welcome|hello/.test(t)) return "sparkle";
  return "ball";
}
