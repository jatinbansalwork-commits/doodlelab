"use client";

import { arrowPath } from "@/lib/canvas-math";
import { useDoodleStore } from "@/store/doodle-store";

export function CanvasArrows() {
  const arrows = useDoodleStore((s) => s.arrows);
  const items = useDoodleStore((s) => s.items);

  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
      {arrows.map((arrow) => {
        const from = items.find((i) => i.id === arrow.fromId);
        const to = items.find((i) => i.id === arrow.toId);
        if (!from || !to) return null;
        const fs = from.kind === "object" ? (from.scale ?? 1) : 1;
        const ts = to.kind === "object" ? (to.scale ?? 1) : 1;
        const fx = from.x + 55 * fs;
        const fy = from.y + 45 * fs;
        const tx = to.x + 55 * ts;
        const ty = to.y + 45 * ts;
        const d = arrowPath(fx, fy, tx, ty);
        return (
          <g key={arrow.id}>
            <path
              d={d}
              fill="none"
              stroke="#6B5BFF"
              strokeWidth="2"
              strokeDasharray="6 5"
              strokeLinecap="round"
              markerEnd="url(#arrowhead)"
            />
          </g>
        );
      })}
      <defs>
        <marker
          id="arrowhead"
          markerWidth="8"
          markerHeight="8"
          refX="6"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L6,3 L0,6" fill="#6B5BFF" />
        </marker>
      </defs>
    </svg>
  );
}
