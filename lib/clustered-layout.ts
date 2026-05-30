import { pickCatEmotion } from "@/lib/cat-emotion";
import { injectSceneFillers } from "@/lib/filler-engine";
import { STAGE } from "@/lib/scene-bounds";
import { getThemePack, pickThemePack, type ThemePackId } from "@/lib/theme-packs";
import type { CanvasObjectType, StickerLabel } from "@/types/canvas";
import type { ConceptMood, DoodleConcept, SceneBlueprint } from "@/types/doodle-app";

const HERO_SCALE: Record<ConceptMood, number> = {
  simple: 1.52,
  funny: 1.42,
  chaotic: 1.35,
};

type Placement = {
  type: CanvasObjectType;
  x: number;
  y: number;
  scale: number;
  catEmotion?: ReturnType<typeof pickCatEmotion>;
};

function jitter(amount: number) {
  return (Math.random() - 0.5) * amount;
}

function pickProps(packProps: CanvasObjectType[], hero: CanvasObjectType, count: number) {
  const out: CanvasObjectType[] = [];
  const pool = packProps.filter((p) => p !== hero);
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  for (const p of shuffled) {
    if (out.length >= count) break;
    if (!out.includes(p)) out.push(p);
  }
  return out;
}

function pickNotes(pack: string[], mood: ConceptMood, cx: number, cy: number) {
  const count = mood === "simple" ? 2 : mood === "funny" ? 3 : 4;
  const shuffled = [...pack].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map((text, i) => ({
    text,
    x: cx - 130 + i * 88 + jitter(18),
    y: cy + 118 + jitter(10),
    rotation: jitter(8),
  }));
}

function pickStickers(labels: StickerLabel[], mood: ConceptMood, clusters: { x: number; y: number }[]) {
  const count = mood === "simple" ? 2 : mood === "funny" ? 3 : 5;
  const shuffled = [...labels].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map((label, i) => {
    const anchor = clusters[i % clusters.length] ?? { x: STAGE.cx, y: STAGE.cy };
    return {
      label,
      x: anchor.x + jitter(55),
      y: anchor.y + jitter(45),
      rotation: jitter(14),
    };
  });
}

/** Hand-composed clusters — not evenly spaced grid. */
export function composeClusteredScene(
  concept: DoodleConcept,
  prompt: string,
  themePackId?: ThemePackId,
): SceneBlueprint {
  const packId = themePackId ?? pickThemePack(prompt, concept.mood);
  const pack = getThemePack(packId);
  const { mood, heroType } = concept;
  const { cx, cy } = STAGE;
  const hs = HERO_SCALE[mood];

  const hero: CanvasObjectType = pack.heroes.includes(heroType)
    ? heroType
    : pack.heroes[0] ?? heroType;

  const propCount = mood === "simple" ? 5 : mood === "funny" ? 7 : 9;
  const props = pickProps(pack.props, hero, propCount);

  const heroCluster = { x: cx - 55 + jitter(20), y: cy - 45 + jitter(16) };
  const leftCluster = { x: cx - 175 + jitter(25), y: cy + 5 + jitter(20) };
  const rightCluster = { x: cx + 125 + jitter(22), y: cy - 15 + jitter(18) };
  const topAccent = { x: cx + jitter(40), y: cy - 145 + jitter(12) };
  const bottomAccent = { x: cx + 40 + jitter(30), y: cy + 75 + jitter(15) };

  const clusterAnchors = [heroCluster, leftCluster, rightCluster, topAccent, bottomAccent];

  const objects: Placement[] = [
    {
      type: hero,
      x: heroCluster.x,
      y: heroCluster.y,
      scale: hs,
      catEmotion: hero === "cat" ? pickCatEmotion(prompt, mood, packId) : undefined,
    },
  ];

  const leftTypes = props.filter((_, i) => i % 3 === 0);
  const rightTypes = props.filter((_, i) => i % 3 === 1);
  const scatterTypes = props.filter((_, i) => i % 3 === 2);

  leftTypes.forEach((type, i) => {
    objects.push({
      type,
      x: leftCluster.x + jitter(28) + i * 8,
      y: leftCluster.y + i * 22 + jitter(18),
      scale: 0.95 + Math.random() * 0.2,
      catEmotion: type === "cat" ? pickCatEmotion(prompt, mood, packId) : undefined,
    });
  });

  rightTypes.forEach((type, i) => {
    objects.push({
      type,
      x: rightCluster.x + jitter(24) + i * 6,
      y: rightCluster.y + i * 20 + jitter(16),
      scale: 0.92 + Math.random() * 0.22,
      catEmotion: type === "cat" ? pickCatEmotion(prompt, mood, packId) : undefined,
    });
  });

  scatterTypes.forEach((type, i) => {
    const anchor = i % 2 === 0 ? topAccent : bottomAccent;
    objects.push({
      type,
      x: anchor.x + jitter(50),
      y: anchor.y + jitter(35),
      scale: 0.85 + Math.random() * 0.18,
      catEmotion: type === "cat" ? pickCatEmotion(prompt, mood, packId) : undefined,
    });
  });

  if (!objects.some((o) => o.type === "star")) {
    objects.push({
      type: "star",
      x: topAccent.x + jitter(30),
      y: topAccent.y,
      scale: 0.8 + Math.random() * 0.15,
    });
  }

  const stickers = pickStickers(pack.stickers, mood, clusterAnchors);
  const notes = pickNotes(pack.noteSnippets, mood, cx, cy);

  const blueprint: SceneBlueprint = {
    objects: objects.map(({ type, x, y, scale, catEmotion }) => ({
      type,
      x,
      y,
      scale,
      ...(type === "cat" && catEmotion ? { catEmotion } : {}),
    })),
    stickers,
    notes,
    connectObjects: false,
    fillers: [],
    themePack: packId,
  };

  blueprint.fillers = injectSceneFillers(blueprint, mood);
  return blueprint;
}
