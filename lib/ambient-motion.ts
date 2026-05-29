/** Subtle looping ambient motion — low CPU, non-distracting. */

export const AMBIENT = {
  /** Sticky notes & stickers */
  sway: {
    transition: {
      duration: 3.2,
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: "easeInOut" as const,
    },
  },
  /** Coffee cup body */
  wobble: {
    animate: { rotate: [-1.2, 1.2] as number[] },
    transition: {
      duration: 2.8,
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: "easeInOut" as const,
    },
  },
  /** Star twinkle */
  twinkle: (dur: number, delay: number) => ({
    animate: { scale: [1, 1.05, 1], opacity: [0.92, 1, 0.92] },
    transition: {
      duration: dur * 1.4,
      repeat: Infinity,
      ease: "easeInOut" as const,
      delay,
    },
  }),
  /** Steam paths */
  steam: (dur: number, delay: number, i: number) => ({
    animate: { y: [0, -6, 0], opacity: [0.25, 0.55, 0.25] },
    transition: {
      duration: dur * 1.8,
      repeat: Infinity,
      delay: delay + i * 0.2,
      ease: "easeInOut" as const,
    },
  }),
} as const;
