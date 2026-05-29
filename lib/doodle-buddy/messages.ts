export type BuddyTrigger =
  | "boardReady"
  | "addCharacter"
  | "addSticker"
  | "remix"
  | "export"
  | "delete"
  | "select"
  | "surprise"
  | "animate"
  | "dragDrop"
  | "teachCharacter"
  | "teachSticker"
  | "teachRemix"
  | "teachSurprise"
  | "teachAnimate"
  | "idleColorful"
  | "idleFriendly";

export type BuddyMood = "happy" | "celebrate" | "teach" | "wave";

export const BUDDY_MESSAGES: Record<BuddyTrigger, string[]> = {
  boardReady: ["✨ Nice choice!", "🎨 Let's doodle!", "👋 Hi there!"],
  addCharacter: ["🎉 New friend!", "👋 Someone joined!", "✨ Tiny pal!"],
  addSticker: ["⭐ Looking better!", "🏷 Sticky fun!", "✨ More color!"],
  remix: ["🎉 Chaos upgraded!", "🚀 Fresh scene!", "✨ Remix magic!"],
  export: ["🎨 Saved masterpiece!", "📤 Ship it!", "✨ Saved art!"],
  delete: ["👋 Bye doodle!", "✨ Poof!", "🧹 All tidy!"],
  select: ["👀 Got it!", "✨ Nice pick!", "🎯 Selected!"],
  surprise: ["🎉 Chaos added.", "✨ Plot twist!", "🎲 Surprise!"],
  animate: ["⚡ More wiggle!", "✨ So bouncy!", "🎬 Action!"],
  dragDrop: ["✨ Placed it!", "👌 Nice spot!", "🎯 Landed!"],
  teachCharacter: ["➕ Add friends!", "🐱 Try a cat!", "👤 Add character!"],
  teachSticker: ["🎭 Add stickers!", "🏷 Try WOW!", "✨ Sticker time!"],
  teachRemix: ["🚀 Try remixing!", "✨ Remix scene!", "🔄 New layout!"],
  teachSurprise: ["🎲 Surprise me!", "✨ Shake things!", "🎉 Try surprise!"],
  teachAnimate: ["⚡ Tap animate!", "✨ Add motion!", "🎬 Make it move!"],
  idleColorful: ["🎨 Looking colorful.", "✨ So much art!", "🌈 Rainbow vibes!"],
  idleFriendly: ["✨ Keep doodling!", "🖍 Have fun!", "💫 You're doing great!"],
};

export function buddyMoodFor(trigger: BuddyTrigger): BuddyMood {
  switch (trigger) {
    case "boardReady":
      return "wave";
    case "remix":
    case "surprise":
    case "export":
    case "addCharacter":
    case "addSticker":
      return "celebrate";
    case "teachCharacter":
    case "teachSticker":
    case "teachRemix":
    case "teachSurprise":
    case "teachAnimate":
      return "teach";
    default:
      return "happy";
  }
}

const TEACH_TRIGGERS: BuddyTrigger[] = [
  "teachCharacter",
  "teachSticker",
  "teachRemix",
  "teachSurprise",
  "teachAnimate",
];

const IDLE_TRIGGERS: BuddyTrigger[] = ["idleColorful", "idleFriendly"];

export function pickTeachTrigger(): BuddyTrigger {
  return TEACH_TRIGGERS[Math.floor(Math.random() * TEACH_TRIGGERS.length)]!;
}

export function pickIdleTrigger(stickerHeavy: boolean): BuddyTrigger {
  return stickerHeavy
    ? "idleColorful"
    : IDLE_TRIGGERS[Math.floor(Math.random() * IDLE_TRIGGERS.length)]!;
}
