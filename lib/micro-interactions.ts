import type { CanvasItem } from "@/types/canvas";
import type { Transition } from "framer-motion";

/** Micro-feedback for successful canvas actions (200–600ms). */
export type MicroAction =
  | "addCharacter"
  | "addSticker"
  | "remix"
  | "export"
  | "delete"
  | "default";

export type StageMicroAction = "remix" | "export";

const EASE_POP = [0.34, 1.35, 0.64, 1] as const;

export function burstForAction(
  action: MicroAction,
  item: CanvasItem,
): { animate: Record<string, unknown>; transition: Transition } {
  switch (action) {
    case "addCharacter":
      return {
        animate: {
          y: [-22, 4, 0],
          scale: [0.55, 1.12, 1],
          rotate: [0, -4, 0],
        },
        transition: { duration: 0.48, ease: EASE_POP },
      };
    case "addSticker": {
      const r = item.kind === "sticker" || item.kind === "note" ? item.rotation : 0;
      return {
        animate: {
          scale: [0.25, 1.18, 1],
          rotate: [r - 18, r + 6, r],
        },
        transition: { duration: 0.4, ease: EASE_POP },
      };
    }
    case "delete":
      return {
        animate: {
          scale: [1, 0.12],
          opacity: [1, 0],
          rotate: item.kind === "object" ? [0, 14] : [item.rotation, item.rotation + 20],
        },
        transition: { duration: 0.38, ease: "easeIn" },
      };
    case "remix":
      return {
        animate: {
          x: [0, 6, -4, 0],
          y: [0, -6, 2, 0],
          scale: [1, 1.06, 0.98, 1],
        },
        transition: { duration: 0.45, ease: "easeOut" },
      };
    case "export":
      return {
        animate: {
          scale: [1, 1.08, 1],
          boxShadow: [
            "0 0 0 rgba(107,91,255,0)",
            "0 0 20px rgba(107,91,255,0.35)",
            "0 0 0 rgba(107,91,255,0)",
          ],
        },
        transition: { duration: 0.5, ease: "easeOut" },
      };
    default:
      return {
        animate: {
          scale: [1, 1.15, 1],
          y: [0, -10, 0],
        },
        transition: { duration: 0.35, ease: EASE_POP },
      };
  }
}

export const DELETE_ANIM_MS = 400;
export const REMIX_STAGGER_MS = 45;
