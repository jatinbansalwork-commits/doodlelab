import type { CanvasObjectType } from "@/types/canvas";

export interface ReplaceOption {
  type: CanvasObjectType;
  label: string;
}

const GROUPS: Record<string, ReplaceOption[]> = {
  laptop: [
    { type: "monitor", label: "Desktop" },
    { type: "plane", label: "Tablet" },
    { type: "popup", label: "Phone" },
    { type: "rocket", label: "Robot screen" },
    { type: "moon", label: "Retro monitor" },
  ],
  monitor: [
    { type: "monitor", label: "Monitor" },
    { type: "laptop", label: "Laptop" },
    { type: "popup", label: "Error popup" },
    { type: "coffee", label: "Coffee" },
  ],
  coffee: [
    { type: "coffee", label: "Coffee cup" },
    { type: "plant", label: "Desk plant" },
    { type: "laptop", label: "Laptop" },
    { type: "star", label: "Sparkle" },
  ],
  default: [
    { type: "dog", label: "Dog" },
    { type: "cat", label: "Cat" },
    { type: "plant", label: "Plant" },
    { type: "coffee", label: "Coffee" },
    { type: "laptop", label: "Laptop" },
    { type: "star", label: "Star" },
    { type: "cloud", label: "Cloud" },
    { type: "rocket", label: "Rocket" },
    { type: "ball", label: "Ball" },
    { type: "plane", label: "Paper plane" },
    { type: "popup", label: "Popup" },
    { type: "moon", label: "Moon" },
  ],
};

const ALIASES: Partial<Record<CanvasObjectType, string>> = {
  dog: "default",
  cat: "default",
  plant: "default",
  star: "default",
  cloud: "default",
  rocket: "default",
  ball: "default",
  plane: "default",
  popup: "default",
  moon: "default",
  zzz: "default",
};

export function getReplaceOptions(current: CanvasObjectType): ReplaceOption[] {
  const key = ALIASES[current] ?? current;
  const list = GROUPS[key] ?? GROUPS.default;
  return list.filter((o) => o.type !== current).length
    ? [...list.filter((o) => o.type !== current), { type: current, label: `Keep ${current}` }]
    : GROUPS.default;
}

export const CHARACTER_PICKER: {
  group: string;
  types: { type: CanvasObjectType; label: string }[];
}[] = [
  {
    group: "People",
    types: [
      { type: "cat", label: "Designer" },
      { type: "dog", label: "Developer" },
      { type: "coffee", label: "PM" },
    ],
  },
  {
    group: "Animals",
    types: [
      { type: "cat", label: "Cat" },
      { type: "dog", label: "Dog" },
      { type: "ball", label: "Rabbit" },
    ],
  },
  {
    group: "Creatures",
    types: [
      { type: "ball", label: "Blob" },
      { type: "star", label: "Alien" },
      { type: "popup", label: "Monster" },
    ],
  },
  {
    group: "Fun",
    types: [
      { type: "rocket", label: "Robot" },
      { type: "moon", label: "Wizard" },
      { type: "cloud", label: "Ghost" },
    ],
  },
];

export const SURPRISE_MESSAGES = [
  "✨ Chaos Added",
  "✨ Tiny Friend Joined",
  "✨ More Energy",
  "✨ Surprise Delivered",
  "✨ Plot Twist",
  "✨ Extra Sparkle",
];
