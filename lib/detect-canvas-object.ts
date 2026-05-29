import type { CanvasObjectType } from "@/types/canvas";

export function detectCanvasObject(prompt: string): CanvasObjectType {
  const t = prompt.toLowerCase();
  if (/\bcoffee\b|\bespresso\b|\bcaffeine/.test(t)) return "coffee";
  if (/\bcat\b|\bkitty\b|\bmeow\b|\bcoding\b|\bmonday\b/.test(t)) return "cat";
  if (/\bplane\b|\bpaper\s*plane\b|\bfly\b|\bsoar/.test(t)) return "plane";
  if (/\bdog\b|\bpuppy\b|\bwalk/.test(t)) return "dog";
  if (/\brocket\b|\blaunch\b/.test(t)) return "rocket";
  if (/\bcloud\b|\bfloat\b|\bdrift\b/.test(t)) return "cloud";
  if (/\bball\b|\bbounc/.test(t)) return "ball";
  if (/\bplant\b|\bgrow\b|\bflower\b/.test(t)) return "plant";
  if (/\bstar\b|\bsparkle\b|\bmagic\b/.test(t)) return "star";
  return "ball";
}
