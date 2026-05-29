import type { ConceptMood } from "@/types/doodle-app";
import type { SceneBlueprint } from "@/types/doodle-app";

export type Theme =
  | "cat-coding"
  | "dog-work"
  | "rocket-launch"
  | "designer-deadline"
  | "generic";

export function getThemeFromPrompt(prompt: string): Theme {
  const t = prompt.toLowerCase();
  if (/\bcat\b|\bcoding\b|\bcode\b|\bdeveloper\b/.test(t)) return "cat-coding";
  if (/\bdog\b|\bwork\b|\boffice\b/.test(t)) return "dog-work";
  if (/\brocket\b|\blaunch\b|\bstartup\b/.test(t)) return "rocket-launch";
  if (/\bdesigner\b|\bdeadline\b|\bmonday\b/.test(t)) return "designer-deadline";
  return "generic";
}

const RECIPES: Record<Theme, Record<ConceptMood, { title: string; description: string; preview: SceneBlueprint; board: SceneBlueprint }>> = {
  "cat-coding": {
    simple: {
      title: "Quiet night shift",
      description: "Cat, laptop, coffee, moon — clean and calm.",
      preview: {
        objects: [
          { type: "moon", x: 20, y: 8, scale: 0.55 },
          { type: "cat", x: 55, y: 42, scale: 0.7 },
          { type: "laptop", x: 48, y: 72, scale: 0.6 },
          { type: "coffee", x: 108, y: 58, scale: 0.55 },
        ],
        stickers: [],
        notes: [{ text: "focus mode", x: 8, y: 95, rotation: -2 }],
      },
      board: {
        objects: [
          { type: "moon", x: 120, y: 80, scale: 1.1 },
          { type: "cat", x: 420, y: 280, scale: 1.25 },
          { type: "laptop", x: 400, y: 380, scale: 1.15 },
          { type: "coffee", x: 620, y: 320, scale: 1 },
          { type: "star", x: 720, y: 120, scale: 0.7 },
        ],
        stickers: [{ label: "SMOOTH", x: 180, y: 420, rotation: -4 }],
        notes: [
          { text: "deep work ✓", x: 140, y: 200, rotation: -3 },
          { text: "no meetings", x: 640, y: 480, rotation: 2 },
        ],
        connectObjects: true,
      },
    },
    funny: {
      title: "Keyboard nap",
      description: "Sleeping on keys, error popup, spilled coffee.",
      preview: {
        objects: [
          { type: "cat", x: 40, y: 50, scale: 0.75 },
          { type: "laptop", x: 38, y: 68, scale: 0.62 },
          { type: "popup", x: 95, y: 25, scale: 0.55 },
          { type: "coffee", x: 110, y: 78, scale: 0.5 },
          { type: "zzz", x: 75, y: 18, scale: 0.5 },
        ],
        stickers: [{ label: "WOW", x: 8, y: 88, rotation: -6 }],
        notes: [],
      },
      board: {
        objects: [
          { type: "cat", x: 380, y: 300, scale: 1.3 },
          { type: "laptop", x: 360, y: 400, scale: 1.2 },
          { type: "popup", x: 580, y: 180, scale: 1.1 },
          { type: "coffee", x: 200, y: 450, scale: 0.95 },
          { type: "zzz", x: 480, y: 200, scale: 1 },
          { type: "zzz", x: 520, y: 170, scale: 0.8 },
        ],
        stickers: [
          { label: "WOW", x: 140, y: 160, rotation: -5 },
          { label: "BOUNCE", x: 680, y: 400, rotation: 4 },
        ],
        notes: [
          { text: "error: too cozy", x: 560, y: 320, rotation: 2 },
          { text: "ship never", x: 160, y: 280, rotation: -4 },
        ],
      },
    },
    chaotic: {
      title: "Deadline storm",
      description: "Monitors, notes, energy drinks, stickers everywhere.",
      preview: {
        objects: [
          { type: "monitor", x: 15, y: 40, scale: 0.5 },
          { type: "monitor", x: 55, y: 35, scale: 0.48 },
          { type: "cat", x: 70, y: 65, scale: 0.65 },
          { type: "coffee", x: 115, y: 50, scale: 0.45 },
          { type: "coffee", x: 100, y: 85, scale: 0.4 },
          { type: "star", x: 125, y: 15, scale: 0.4 },
        ],
        stickers: [
          { label: "FAST", x: 5, y: 70, rotation: -8 },
          { label: "SHIP IT", x: 90, y: 5, rotation: 5 },
        ],
        notes: [{ text: "due TODAY", x: 30, y: 100, rotation: 3 }],
      },
      board: {
        objects: [
          { type: "monitor", x: 200, y: 220, scale: 1.15 },
          { type: "monitor", x: 480, y: 200, scale: 1.1 },
          { type: "cat", x: 400, y: 360, scale: 1.2 },
          { type: "laptop", x: 280, y: 400, scale: 1 },
          { type: "coffee", x: 160, y: 380, scale: 1 },
          { type: "coffee", x: 640, y: 340, scale: 0.95 },
          { type: "popup", x: 620, y: 200, scale: 1 },
          { type: "star", x: 120, y: 120, scale: 0.9 },
          { type: "star", x: 700, y: 480, scale: 0.85 },
          { type: "zzz", x: 350, y: 180, scale: 0.9 },
        ],
        stickers: [
          { label: "FAST", x: 100, y: 480, rotation: -6 },
          { label: "SHIP IT", x: 720, y: 140, rotation: 5 },
          { label: "AI", x: 500, y: 520, rotation: -3 },
          { label: "BOUNCE", x: 180, y: 140, rotation: 8 },
        ],
        notes: [
          { text: "deadline!!!", x: 240, y: 520, rotation: -2 },
          { text: "help", x: 600, y: 440, rotation: 4 },
          { text: "caffeine IV", x: 140, y: 300, rotation: -5 },
        ],
      },
    },
  },
  "dog-work": {
    simple: {
      title: "Morning commute",
      description: "Calm dog, coffee, briefcase and sunny cloud.",
      preview: {
        objects: [
          { type: "cloud", x: 8, y: 6, scale: 0.62 },
          { type: "dog", x: 42, y: 38, scale: 0.88 },
          { type: "coffee", x: 98, y: 48, scale: 0.58 },
          { type: "plant", x: 108, y: 78, scale: 0.45 },
        ],
        stickers: [],
        notes: [{ text: "briefcase ✓", x: 6, y: 82, rotation: -3 }],
      },
      board: {
        objects: [
          { type: "dog", x: 400, y: 300, scale: 1.35 },
          { type: "coffee", x: 620, y: 320, scale: 1.05 },
          { type: "cloud", x: 180, y: 140, scale: 1.1 },
          { type: "plant", x: 680, y: 420, scale: 0.9 },
        ],
        stickers: [{ label: "SMOOTH", x: 200, y: 450, rotation: -3 }],
        notes: [
          { text: "good boy at work", x: 160, y: 280, rotation: -2 },
          { text: "9am sharp", x: 580, y: 480, rotation: 3 },
        ],
        connectObjects: true,
      },
    },
    funny: {
      title: "Late for work",
      description: "Dog sprinting, flying papers, laptop chaos and WOW reactions.",
      preview: {
        objects: [
          { type: "dog", x: 28, y: 52, scale: 0.85 },
          { type: "laptop", x: 88, y: 58, scale: 0.58 },
          { type: "plane", x: 8, y: 18, scale: 0.5 },
          { type: "plane", x: 105, y: 12, scale: 0.48 },
          { type: "popup", x: 95, y: 28, scale: 0.55 },
          { type: "coffee", x: 115, y: 72, scale: 0.42 },
        ],
        stickers: [
          { label: "WOW", x: 4, y: 6, rotation: -6 },
          { label: "FAST", x: 72, y: 88, rotation: 5 },
        ],
        notes: [{ text: "LATE!!!", x: 38, y: 98, rotation: 4 }],
      },
      board: {
        objects: [
          { type: "dog", x: 340, y: 300, scale: 1.4 },
          { type: "laptop", x: 560, y: 360, scale: 1.2 },
          { type: "popup", x: 600, y: 180, scale: 1.1 },
          { type: "plane", x: 160, y: 200, scale: 1 },
          { type: "plane", x: 200, y: 380, scale: 0.95 },
          { type: "coffee", x: 200, y: 240, scale: 0.95 },
          { type: "ball", x: 680, y: 420, scale: 0.9 },
        ],
        stickers: [
          { label: "WOW", x: 120, y: 160, rotation: -5 },
          { label: "MAGIC", x: 680, y: 420, rotation: 4 },
          { label: "BOUNCE", x: 480, y: 520, rotation: 3 },
        ],
        notes: [
          { text: "where's my tie?", x: 520, y: 480, rotation: 2 },
          { text: "boss is watching", x: 140, y: 180, rotation: -4 },
          { text: "RUN", x: 380, y: 140, rotation: 6 },
        ],
      },
    },
    chaotic: {
      title: "Office explosion",
      description: "Multiple dogs, sticky notes everywhere, bounce and sticker storm.",
      preview: {
        objects: [
          { type: "dog", x: 20, y: 48, scale: 0.72 },
          { type: "dog", x: 72, y: 62, scale: 0.65 },
          { type: "dog", x: 110, y: 40, scale: 0.6 },
          { type: "monitor", x: 8, y: 28, scale: 0.5 },
          { type: "coffee", x: 95, y: 78, scale: 0.45 },
          { type: "ball", x: 118, y: 68, scale: 0.42 },
          { type: "star", x: 115, y: 8, scale: 0.48 },
          { type: "star", x: 5, y: 70, scale: 0.4 },
          { type: "plane", x: 55, y: 8, scale: 0.45 },
        ],
        stickers: [
          { label: "BOUNCE", x: 2, y: 2, rotation: -10 },
          { label: "FAST", x: 58, y: 92, rotation: 7 },
          { label: "SHIP IT", x: 88, y: 50, rotation: -4 },
        ],
        notes: [
          { text: "HELP", x: 30, y: 100, rotation: 5 },
          { text: "meeting??", x: 70, y: 95, rotation: -3 },
          { text: "woof x3", x: 100, y: 105, rotation: 8 },
        ],
      },
      board: {
        objects: [
          { type: "dog", x: 320, y: 300, scale: 1.2 },
          { type: "dog", x: 480, y: 340, scale: 1.1 },
          { type: "dog", x: 600, y: 280, scale: 1.05 },
          { type: "monitor", x: 200, y: 220, scale: 1.15 },
          { type: "monitor", x: 520, y: 200, scale: 1.1 },
          { type: "ball", x: 160, y: 420, scale: 1 },
          { type: "ball", x: 640, y: 400, scale: 0.95 },
          { type: "plane", x: 580, y: 160, scale: 1.1 },
          { type: "rocket", x: 200, y: 180, scale: 0.95 },
          { type: "star", x: 700, y: 260, scale: 0.9 },
          { type: "star", x: 120, y: 140, scale: 0.85 },
          { type: "coffee", x: 480, y: 500, scale: 0.95 },
          { type: "popup", x: 640, y: 360, scale: 1 },
        ],
        stickers: [
          { label: "BOUNCE", x: 100, y: 140, rotation: -6 },
          { label: "FAST", x: 720, y: 480, rotation: 5 },
          { label: "SHIP IT", x: 300, y: 520, rotation: -2 },
          { label: "WOW", x: 180, y: 520, rotation: 4 },
          { label: "AI", x: 560, y: 120, rotation: -3 },
        ],
        notes: [
          { text: "inbox: 999", x: 180, y: 300, rotation: -3 },
          { text: "woof!", x: 620, y: 340, rotation: 4 },
          { text: "SOS", x: 400, y: 480, rotation: 6 },
          { text: "deadline", x: 240, y: 520, rotation: -2 },
        ],
      },
    },
  },
  "rocket-launch": {
    simple: {
      title: "Clean launchpad",
      description: "Rocket, cloud, star — minimal and iconic.",
      preview: {
        objects: [
          { type: "rocket", x: 60, y: 35, scale: 0.7 },
          { type: "cloud", x: 20, y: 70, scale: 0.45 },
          { type: "star", x: 110, y: 25, scale: 0.4 },
        ],
        stickers: [],
        notes: [{ text: "liftoff", x: 15, y: 95, rotation: -1 }],
      },
      board: {
        objects: [
          { type: "rocket", x: 440, y: 260, scale: 1.4 },
          { type: "cloud", x: 200, y: 400, scale: 1.1 },
          { type: "cloud", x: 620, y: 420, scale: 1 },
          { type: "star", x: 680, y: 140, scale: 0.9 },
          { type: "star", x: 160, y: 160, scale: 0.85 },
        ],
        stickers: [{ label: "SHIP IT", x: 560, y: 480, rotation: 3 }],
        notes: [
          { text: "we're live", x: 180, y: 300, rotation: -2 },
          { text: "🚀", x: 640, y: 320, rotation: 2 },
        ],
        connectObjects: true,
      },
    },
    funny: {
      title: "Oops wrong button",
      description: "Rocket sideways, popup, nervous coffee.",
      preview: {
        objects: [
          { type: "rocket", x: 70, y: 50, scale: 0.65 },
          { type: "popup", x: 25, y: 30, scale: 0.5 },
          { type: "coffee", x: 105, y: 65, scale: 0.5 },
        ],
        stickers: [{ label: "WOW", x: 95, y: 10, rotation: 5 }],
        notes: [],
      },
      board: {
        objects: [
          { type: "rocket", x: 400, y: 300, scale: 1.3 },
          { type: "popup", x: 580, y: 200, scale: 1.1 },
          { type: "coffee", x: 200, y: 380, scale: 1 },
          { type: "plane", x: 640, y: 380, scale: 0.95 },
          { type: "star", x: 300, y: 160, scale: 0.8 },
        ],
        stickers: [
          { label: "WOW", x: 140, y: 180, rotation: -4 },
          { label: "MAGIC", x: 680, y: 260, rotation: 6 },
        ],
        notes: [
          { text: "not a drill?", x: 560, y: 460, rotation: 2 },
          { text: "ceo watching", x: 160, y: 260, rotation: -3 },
        ],
      },
    },
    chaotic: {
      title: "Launch party",
      description: "Rockets, stars, planes, stickers, pure hype.",
      preview: {
        objects: [
          { type: "rocket", x: 40, y: 40, scale: 0.6 },
          { type: "rocket", x: 95, y: 55, scale: 0.5 },
          { type: "star", x: 120, y: 15, scale: 0.45 },
          { type: "plane", x: 10, y: 75, scale: 0.45 },
          { type: "ball", x: 70, y: 85, scale: 0.35 },
        ],
        stickers: [
          { label: "SHIP IT", x: 5, y: 5, rotation: -5 },
          { label: "FAST", x: 85, y: 95, rotation: 4 },
        ],
        notes: [{ text: "HYPE", x: 30, y: 100, rotation: 3 }],
      },
      board: {
        objects: [
          { type: "rocket", x: 320, y: 280, scale: 1.25 },
          { type: "rocket", x: 520, y: 320, scale: 1.1 },
          { type: "star", x: 160, y: 140, scale: 1 },
          { type: "star", x: 700, y: 200, scale: 0.95 },
          { type: "plane", x: 640, y: 440, scale: 1.05 },
          { type: "ball", x: 200, y: 450, scale: 1 },
          { type: "cloud", x: 480, y: 480, scale: 1 },
        ],
        stickers: [
          { label: "SHIP IT", x: 120, y: 500, rotation: -4 },
          { label: "FAST", x: 720, y: 400, rotation: 5 },
          { label: "AI", x: 400, y: 140, rotation: -2 },
          { label: "BOUNCE", x: 680, y: 520, rotation: 6 },
        ],
        notes: [
          { text: "to the moon", x: 240, y: 220, rotation: -3 },
          { text: "v2 soon", x: 600, y: 480, rotation: 4 },
        ],
      },
    },
  },
  "designer-deadline": {
    simple: {
      title: "One more revision",
      description: "Plant, coffee, calm star — survive Monday softly.",
      preview: {
        objects: [
          { type: "plant", x: 30, y: 60, scale: 0.55 },
          { type: "coffee", x: 90, y: 50, scale: 0.55 },
          { type: "laptop", x: 55, y: 75, scale: 0.5 },
        ],
        stickers: [],
        notes: [{ text: "final_final v3", x: 8, y: 95, rotation: -2 }],
      },
      board: {
        objects: [
          { type: "plant", x: 200, y: 380, scale: 1.1 },
          { type: "coffee", x: 600, y: 300, scale: 1 },
          { type: "laptop", x: 420, y: 340, scale: 1.15 },
          { type: "star", x: 680, y: 160, scale: 0.8 },
        ],
        stickers: [{ label: "SMOOTH", x: 180, y: 220, rotation: -3 }],
        notes: [
          { text: "pixels matter", x: 160, y: 480, rotation: -2 },
          { text: "monday again", x: 580, y: 480, rotation: 3 },
        ],
        connectObjects: true,
      },
    },
    funny: {
      title: "Feedback loop",
      description: "Popups, spilled coffee, plant judging you.",
      preview: {
        objects: [
          { type: "popup", x: 85, y: 22, scale: 0.55 },
          { type: "laptop", x: 45, y: 68, scale: 0.55 },
          { type: "coffee", x: 110, y: 75, scale: 0.45 },
          { type: "plant", x: 15, y: 55, scale: 0.5 },
        ],
        stickers: [{ label: "WOW", x: 5, y: 88, rotation: -5 }],
        notes: [],
      },
      board: {
        objects: [
          { type: "popup", x: 560, y: 180, scale: 1.15 },
          { type: "popup", x: 620, y: 240, scale: 1 },
          { type: "laptop", x: 380, y: 360, scale: 1.2 },
          { type: "coffee", x: 180, y: 420, scale: 0.95 },
          { type: "plant", x: 200, y: 260, scale: 1.05 },
          { type: "star", x: 700, y: 400, scale: 0.75 },
        ],
        stickers: [
          { label: "WOW", x: 120, y: 160, rotation: -4 },
          { label: "MAGIC", x: 680, y: 500, rotation: 5 },
        ],
        notes: [
          { text: "make logo bigger", x: 520, y: 460, rotation: 2 },
          { text: "asap pls", x: 140, y: 340, rotation: -5 },
        ],
      },
    },
    chaotic: {
      title: "Deadline cyclone",
      description: "Monitors, notes, stickers, energy — total chaos.",
      preview: {
        objects: [
          { type: "monitor", x: 10, y: 38, scale: 0.48 },
          { type: "monitor", x: 48, y: 32, scale: 0.46 },
          { type: "laptop", x: 75, y: 68, scale: 0.48 },
          { type: "coffee", x: 115, y: 48, scale: 0.42 },
          { type: "plant", x: 25, y: 78, scale: 0.42 },
        ],
        stickers: [
          { label: "FAST", x: 100, y: 8, rotation: 5 },
          { label: "SHIP IT", x: 5, y: 55, rotation: -7 },
        ],
        notes: [{ text: "DUE NOW", x: 40, y: 100, rotation: 4 }],
      },
      board: {
        objects: [
          { type: "monitor", x: 220, y: 200, scale: 1.1 },
          { type: "monitor", x: 500, y: 190, scale: 1.05 },
          { type: "laptop", x: 360, y: 400, scale: 1.15 },
          { type: "coffee", x: 140, y: 360, scale: 1 },
          { type: "coffee", x: 660, y: 380, scale: 0.95 },
          { type: "plant", x: 180, y: 480, scale: 1 },
          { type: "popup", x: 600, y: 320, scale: 1 },
          { type: "star", x: 720, y: 160, scale: 0.9 },
          { type: "ball", x: 480, y: 520, scale: 0.85 },
        ],
        stickers: [
          { label: "FAST", x: 100, y: 140, rotation: -6 },
          { label: "SHIP IT", x: 700, y: 480, rotation: 5 },
          { label: "AI", x: 320, y: 120, rotation: -2 },
          { label: "BOUNCE", x: 560, y: 520, rotation: 4 },
        ],
        notes: [
          { text: "monday.exe", x: 240, y: 520, rotation: -3 },
          { text: "send help", x: 640, y: 260, rotation: 4 },
          { text: "???", x: 400, y: 180, rotation: -6 },
        ],
      },
    },
  },
  generic: {
    simple: {
      title: "Soft & simple",
      description: "Hero doodle with calm supporting props.",
      preview: {
        objects: [
          { type: "star", x: 100, y: 20, scale: 0.45 },
          { type: "cloud", x: 20, y: 70, scale: 0.45 },
        ],
        stickers: [],
        notes: [{ text: "nice", x: 12, y: 95, rotation: -1 }],
      },
      board: {
        objects: [
          { type: "star", x: 680, y: 140, scale: 0.9 },
          { type: "cloud", x: 200, y: 400, scale: 1.1 },
          { type: "coffee", x: 620, y: 360, scale: 1 },
        ],
        stickers: [{ label: "SMOOTH", x: 180, y: 220, rotation: -3 }],
        notes: [
          { text: "your idea ✨", x: 160, y: 480, rotation: -2 },
          { text: "made with love", x: 560, y: 500, rotation: 2 },
        ],
        connectObjects: true,
      },
    },
    funny: {
      title: "Plot twist",
      description: "Popup, extra props, playful stickers.",
      preview: {
        objects: [
          { type: "popup", x: 90, y: 25, scale: 0.5 },
          { type: "coffee", x: 105, y: 70, scale: 0.45 },
        ],
        stickers: [{ label: "WOW", x: 8, y: 88, rotation: -5 }],
        notes: [],
      },
      board: {
        objects: [
          { type: "popup", x: 580, y: 200, scale: 1.1 },
          { type: "coffee", x: 200, y: 400, scale: 1 },
          { type: "ball", x: 640, y: 420, scale: 1 },
          { type: "star", x: 300, y: 160, scale: 0.85 },
        ],
        stickers: [
          { label: "WOW", x: 140, y: 180, rotation: -4 },
          { label: "MAGIC", x: 680, y: 300, rotation: 5 },
        ],
        notes: [
          { text: "didn't expect that", x: 480, y: 480, rotation: 2 },
          { text: "lol", x: 180, y: 280, rotation: -3 },
        ],
      },
    },
    chaotic: {
      title: "Maximum doodle",
      description: "Everything at once — stickers, notes, motion.",
      preview: {
        objects: [
          { type: "star", x: 115, y: 12, scale: 0.4 },
          { type: "ball", x: 10, y: 75, scale: 0.4 },
          { type: "cloud", x: 70, y: 80, scale: 0.4 },
        ],
        stickers: [
          { label: "FAST", x: 5, y: 5, rotation: -6 },
          { label: "BOUNCE", x: 90, y: 95, rotation: 5 },
        ],
        notes: [{ text: "!!!", x: 35, y: 100, rotation: 4 }],
      },
      board: {
        objects: [
          { type: "star", x: 160, y: 120, scale: 1 },
          { type: "star", x: 700, y: 440, scale: 0.9 },
          { type: "ball", x: 200, y: 440, scale: 1 },
          { type: "cloud", x: 480, y: 480, scale: 1.1 },
          { type: "plane", x: 620, y: 200, scale: 1.05 },
          { type: "coffee", x: 340, y: 520, scale: 0.95 },
        ],
        stickers: [
          { label: "FAST", x: 100, y: 160, rotation: -5 },
          { label: "BOUNCE", x: 720, y: 320, rotation: 6 },
          { label: "SHIP IT", x: 280, y: 140, rotation: -2 },
          { label: "AI", x: 560, y: 520, rotation: 4 },
        ],
        notes: [
          { text: "go wild", x: 400, y: 200, rotation: -4 },
          { text: "yes!", x: 180, y: 320, rotation: 3 },
        ],
      },
    },
  },
};

export function getConceptRecipes(prompt: string) {
  const theme = getThemeFromPrompt(prompt);
  return RECIPES[theme];
}

/** Inject hero type into generic/simple boards */
export function applyHeroToBlueprint(
  blueprint: SceneBlueprint,
  hero: import("@/types/canvas").CanvasObjectType,
  center = { x: 420, y: 300 },
): SceneBlueprint {
  const hasHero = blueprint.objects.some((o) => o.type === hero);
  if (hasHero) return blueprint;
  return {
    ...blueprint,
    objects: [
      { type: hero, x: center.x, y: center.y, scale: 1.25 },
      ...blueprint.objects,
    ],
  };
}
