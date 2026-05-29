import type { CanvasItem } from "@/types/canvas";

export function exportSceneSvg(items: CanvasItem[]): string {
  const width = 900;
  const height = 600;
  const labels = items
    .filter((i) => i.kind === "sticker")
    .map(
      (s) =>
        `<text x="${s.x}" y="${s.y}" transform="rotate(${s.rotation} ${s.x} ${s.y})" font-family="cursive" font-size="18" fill="#111">${s.label}</text>`,
    )
    .join("\n");

  const objects = items
    .filter((i) => i.kind === "object")
    .map(
      (o) =>
        `<g transform="translate(${o.x}, ${o.y})"><circle r="40" fill="#E8E4FF" stroke="#111" stroke-width="2"/><text y="6" text-anchor="middle" font-size="12" fill="#111">${o.type}</text></g>`,
    )
    .join("\n");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="100%" height="100%" fill="#FAFAF7"/>
  ${objects}
  ${labels}
</svg>`;
}
