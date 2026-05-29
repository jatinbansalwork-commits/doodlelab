import type { SceneBlueprint } from "@/types/doodle-app";
import type { ConceptMood } from "@/types/doodle-app";

export function computeConceptStats(
  board: SceneBlueprint,
  mood: ConceptMood,
) {
  const doodles = board.objects.length + board.notes.length;
  const stickers = board.stickers.length;

  const animations =
    mood === "simple"
      ? Math.max(1, Math.min(2, Math.ceil(board.objects.length * 0.35)))
      : mood === "funny"
        ? Math.min(5, board.objects.length + Math.min(2, stickers))
        : Math.min(12, board.objects.length + stickers + 2);

  return { doodles, stickers, animations };
}
