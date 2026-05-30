import { STAGE } from "@/lib/scene-bounds";
import type { CanvasItem } from "@/types/canvas";

const SIZE = {
  object: { w: 160, h: 140 },
  sticker: { w: 100, h: 48 },
  note: { w: 170, h: 72 },
  filler: { w: 32, h: 32 },
} as const;

const PAD = 8;

export function clampToStage(item: CanvasItem, x: number, y: number) {
  const base = SIZE[item.kind];
  const scale =
    item.kind === "object" || item.kind === "filler" ? item.scale ?? 1 : 1;
  const w = base.w * scale;
  const h = base.h * scale;

  return {
    x: Math.min(Math.max(PAD, x), STAGE.width - w - PAD),
    y: Math.min(Math.max(PAD, y), STAGE.height - h - PAD),
  };
}
