import {
  BUDDY_MESSAGES,
  buddyMoodFor,
  type BuddyTrigger,
} from "@/lib/doodle-buddy/messages";

export function pickBuddyMessage(trigger: BuddyTrigger): string {
  const pool = BUDDY_MESSAGES[trigger];
  return pool[Math.floor(Math.random() * pool.length)]!;
}

export function buildBuddyCue(trigger: BuddyTrigger) {
  return {
    text: pickBuddyMessage(trigger),
    mood: buddyMoodFor(trigger),
    seq: Date.now(),
  };
}
