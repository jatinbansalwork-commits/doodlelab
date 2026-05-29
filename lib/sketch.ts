/** Wobbly hand-drawn rect path for SVG */
export const SKETCH_STROKE = "#111111";
export const SKETCH_FILL = "#FAFAF7";

export function sketchRect(w: number, h: number, rough = 3): string {
  const r = rough;
  return `M ${r} 0 L ${w - r} ${r} L ${w} ${h - r} L ${r} ${h} Z`;
}
