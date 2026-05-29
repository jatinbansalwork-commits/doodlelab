"use client";

import { getSceneBounds } from "@/lib/scene-bounds";
import { useDoodleStore } from "@/store/doodle-store";

export function SceneFocusFrame() {
  const items = useDoodleStore((s) => s.items);
  if (items.length < 2) return null;

  const bounds = getSceneBounds(items);

  return (
    <div
      className="pointer-events-none absolute z-[1] rounded-[28px] border-2 border-[#111]/10 bg-white/50"
      style={{
        left: bounds.minX,
        top: bounds.minY,
        width: bounds.width,
        height: bounds.height,
        boxShadow: "inset 0 0 0 1px rgba(17,17,17,0.04)",
      }}
      aria-hidden
    />
  );
}
