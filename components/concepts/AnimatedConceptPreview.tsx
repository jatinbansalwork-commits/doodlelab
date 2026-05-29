"use client";

import { motion } from "framer-motion";
import { CanvasDoodle } from "@/components/doodles/CanvasDoodle";
import { objectConfig } from "@/lib/canvas-math";
import type { CanvasObjectType } from "@/types/canvas";
import type { ConceptMood, SceneBlueprint } from "@/types/doodle-app";
import type { MotionConfig } from "@/types/motion";

function scaleDuration(duration: number, speedMultiplier: number) {
  return Math.max(0.35, duration / speedMultiplier);
}

function motionForObject(
  mood: ConceptMood,
  type: CanvasObjectType,
  index: number,
  speedMultiplier: number,
) {
  if (mood === "simple") {
    if (type === "cloud" || type === "moon") {
      return {
        animate: { x: [0, 14, 0], y: [0, -5, 0] },
        transition: {
          duration: scaleDuration(4.5, speedMultiplier),
          repeat: Infinity,
          ease: "easeInOut" as const,
        },
      };
    }
    if (type === "dog" || type === "cat") {
      return {
        animate: { scaleY: [1, 0.97, 1, 1] },
        transition: {
          duration: scaleDuration(3, speedMultiplier),
          repeat: Infinity,
          ease: "easeInOut" as const,
        },
      };
    }
    if (type === "coffee") {
      return {
        animate: { y: [0, -2, 0] },
        transition: {
          duration: scaleDuration(3.2, speedMultiplier),
          repeat: Infinity,
          ease: "easeInOut" as const,
        },
      };
    }
    return {
      animate: { y: [0, -4, 0] },
      transition: {
        duration: scaleDuration(3.8, speedMultiplier),
        repeat: Infinity,
        ease: "easeInOut" as const,
      },
    };
  }

  if (mood === "funny") {
    if (type === "dog" || type === "cat") {
      return {
        animate: { rotate: [0, -6, 6, -4, 0], x: [0, 4, 0] },
        transition: {
          duration: scaleDuration(0.65, speedMultiplier),
          repeat: Infinity,
          ease: "easeInOut" as const,
        },
      };
    }
    if (type === "laptop" || type === "monitor") {
      return {
        animate: { rotate: [0, -2, 2, -1, 0] },
        transition: {
          duration: scaleDuration(0.45, speedMultiplier),
          repeat: Infinity,
        },
      };
    }
    if (type === "popup") {
      return {
        animate: { scale: [1, 1.12, 1] },
        transition: {
          duration: scaleDuration(1.1, speedMultiplier),
          repeat: Infinity,
        },
      };
    }
    if (type === "plane") {
      return {
        animate: { x: [0, 12, -4, 0], y: [0, -6, 4, 0], rotate: [0, 8, -4, 0] },
        transition: {
          duration: scaleDuration(2.2, speedMultiplier),
          repeat: Infinity,
        },
      };
    }
    if (type === "zzz") {
      return {
        animate: { opacity: [0.45, 1, 0.45], y: [0, -8, 0] },
        transition: {
          duration: scaleDuration(2, speedMultiplier),
          repeat: Infinity,
        },
      };
    }
    return {
      animate: { y: [0, -6, 0] },
      transition: {
        duration: scaleDuration(1.4, speedMultiplier),
        repeat: Infinity,
        delay: index * 0.08,
      },
    };
  }

  if (type === "star") {
    return {
      animate: { rotate: [0, 180, 360] },
      transition: {
        duration: scaleDuration(3, speedMultiplier),
        repeat: Infinity,
        ease: "linear" as const,
      },
    };
  }

  return {
    animate: { y: [0, -10, 0], scale: [1, 1.06, 1], rotate: [0, index % 2 ? 3 : -3, 0] },
    transition: {
      duration: scaleDuration(0.75 + (index % 3) * 0.2, speedMultiplier),
      repeat: Infinity,
      delay: index * 0.06,
      ease: [0.34, 1.4, 0.64, 1] as const,
    },
  };
}

function motionForNote(mood: ConceptMood, index: number, speedMultiplier: number) {
  if (mood !== "chaotic") return undefined;
  return {
    animate: {
      x: [0, 6, -4, 0],
      y: [0, -8, 4, 0],
      rotate: [0, 4, -3, 0],
    },
    transition: {
      duration: scaleDuration(2.5 + index * 0.2, speedMultiplier),
      repeat: Infinity,
      delay: index * 0.15,
    },
  };
}

function motionForSticker(mood: ConceptMood, rotation: number, index: number, speedMultiplier: number) {
  if (mood === "funny") {
    return {
      animate: { scale: [1, 1.14, 1], rotate: [rotation, rotation + 4, rotation] },
      transition: {
        duration: scaleDuration(1.2, speedMultiplier),
        repeat: Infinity,
        delay: index * 0.1,
      },
    };
  }
  if (mood === "chaotic") {
    return {
      animate: {
        rotate: [rotation, rotation + 6, rotation - 4, rotation],
        y: [0, -5, 0],
      },
      transition: {
        duration: scaleDuration(1.6, speedMultiplier),
        repeat: Infinity,
        delay: index * 0.08,
      },
    };
  }
  return undefined;
}

export function AnimatedConceptPreview({
  blueprint,
  mood,
  heroType,
  config,
  speed,
  intensity,
  speedMultiplier = 1,
}: {
  blueprint: SceneBlueprint;
  mood: ConceptMood;
  heroType: CanvasObjectType;
  config: MotionConfig;
  speed: number;
  intensity: number;
  speedMultiplier?: number;
}) {
  const base = objectConfig({
    id: "",
    kind: "object",
    type: heroType,
    x: 0,
    y: 0,
    scale: 1,
    config,
    speed,
    intensity,
  });

  const bg =
    mood === "simple"
      ? "bg-[#FAFAF7]"
      : mood === "funny"
        ? "bg-gradient-to-b from-[#FAFAF7] to-[#F3F1EA]"
        : "bg-[#F3F1EA]";

  const hasCoffee = blueprint.objects.some((o) => o.type === "coffee");

  return (
    <div
      className={`relative h-full min-h-[400px] w-full overflow-hidden rounded-[18px] ${bg}`}
      style={{ boxShadow: "inset 0 0 0 1px rgba(17,17,17,0.06)" }}
    >
      {mood === "simple" && hasCoffee ? (
        <>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={`steam-${i}`}
              className="pointer-events-none absolute z-[5] h-3 w-3 rounded-full bg-[#111]/12"
              style={{ left: 268 + i * 8, top: 130 + i * 4 }}
              animate={{ y: [0, -18 - i * 6, -28 - i * 8], opacity: [0.5, 0.25, 0] }}
              transition={{
                duration: scaleDuration(2.8 + i * 0.4, speedMultiplier),
                repeat: Infinity,
                delay: i * 0.35,
                ease: "easeOut",
              }}
            />
          ))}
        </>
      ) : null}

      {blueprint.objects.map((obj, i) => {
        const m = motionForObject(mood, obj.type, i, speedMultiplier);
        return (
          <motion.div
            key={`${obj.type}-${i}`}
            className="absolute origin-top-left"
            style={{ left: obj.x, top: obj.y, zIndex: i }}
            animate={m.animate}
            transition={m.transition}
          >
            <div
              style={{
                transform: `scale(${obj.scale ?? 1})`,
                transformOrigin: "top left",
              }}
            >
              <CanvasDoodle type={obj.type} config={base} />
            </div>
          </motion.div>
        );
      })}

      {blueprint.notes.map((note, i) => {
        const nm = motionForNote(mood, i, speedMultiplier);
        const NoteWrap = nm ? motion.div : "div";
        return (
          <NoteWrap
            key={`note-${i}`}
            className="absolute z-10 max-w-[120px] bg-[#F7ED99] px-3 py-2 font-[family-name:var(--font-hand)] text-[16px] leading-tight text-[#111]"
            style={{
              left: note.x,
              top: note.y,
              transform: nm ? undefined : `rotate(${note.rotation ?? 0}deg)`,
              border: "2px solid #111",
              boxShadow: "3px 3px 0 rgba(17,17,17,0.14)",
            }}
            {...(nm ? { animate: nm.animate, transition: nm.transition } : {})}
          >
            {note.text}
          </NoteWrap>
        );
      })}

      {blueprint.stickers.map((s, i) => {
        const sm = motionForSticker(mood, s.rotation, i, speedMultiplier);
        return (
          <motion.div
            key={`st-${i}`}
            className="absolute z-10 bg-[#F7ED99] px-3 py-1.5 font-[family-name:var(--font-hand)] text-[16px] font-semibold text-[#111]"
            style={{
              left: s.x,
              top: s.y,
              border: "2px solid #111",
              boxShadow: "3px 3px 0 #111",
            }}
            animate={sm?.animate}
            transition={sm?.transition}
          >
            {s.label}
          </motion.div>
        );
      })}
    </div>
  );
}
