import type { CanvasItem } from "@/types/canvas";

/** Fixed illustration stage — all board items live inside this box. */
export const STAGE = {
  width: 720,
  height: 520,
  cx: 360,
  cy: 248,
} as const;

const ITEM_SIZE: Record<CanvasItem["kind"], { w: number; h: number }> = {
  object: { w: 140, h: 120 },
  sticker: { w: 90, h: 44 },
  note: { w: 150, h: 64 },
  filler: { w: 28, h: 28 },
};

export function getSceneBounds(items: CanvasItem[]) {
  if (!items.length) {
    return {
      minX: 0,
      minY: 0,
      maxX: STAGE.width,
      maxY: STAGE.height,
      width: STAGE.width,
      height: STAGE.height,
      cx: STAGE.cx,
      cy: STAGE.cy,
    };
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const item of items) {
    const base = ITEM_SIZE[item.kind];
    const scale =
      item.kind === "object" || item.kind === "filler" ? item.scale ?? 1 : 1;
    const w = base.w * scale;
    const h = base.h * scale;
    minX = Math.min(minX, item.x);
    minY = Math.min(minY, item.y);
    maxX = Math.max(maxX, item.x + w);
    maxY = Math.max(maxY, item.y + h);
  }

  const pad = 24;
  return {
    minX: minX - pad,
    minY: minY - pad,
    maxX: maxX + pad,
    maxY: maxY + pad,
    width: maxX - minX + pad * 2,
    height: maxY - minY + pad * 2,
    cx: (minX + maxX) / 2,
    cy: (minY + maxY) / 2,
  };
}

/** Scale stage to fill ~70% of viewport (target 60–80% visual fill). */
export function computeStageScale(viewportW: number, viewportH: number) {
  const chromeTop = 88;
  const chromeBottom = 120;
  const fill = 0.74;
  const availW = viewportW * fill;
  const availH = Math.max(320, viewportH - chromeTop - chromeBottom) * fill;
  return Math.min(
    2.1,
    Math.max(0.95, Math.min(availW / STAGE.width, availH / STAGE.height)),
  );
}

/** @deprecated Use computeStageScale — kept for remix nudges */
export function computeViewportForScene(
  items: CanvasItem[],
  viewportW: number,
  viewportH: number,
) {
  const zoom = computeStageScale(viewportW, viewportH);
  return {
    panX: 0,
    panY: 0,
    zoom,
    bounds: getSceneBounds(items),
  };
}

export function viewportCenterToCanvas(
  _panX: number,
  _panY: number,
  zoom: number,
  viewportW: number,
  viewportH: number,
) {
  const chromeTop = 88;
  const chromeBottom = 120;
  const stageLeft = (viewportW - STAGE.width * zoom) / 2;
  const stageTop = chromeTop + (viewportH - chromeTop - chromeBottom - STAGE.height * zoom) / 2;
  return {
    x: (viewportW / 2 - stageLeft) / zoom,
    y: (viewportH / 2 - stageTop) / zoom,
  };
}
