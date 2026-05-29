/** Lightweight synthesized doodle sounds — Web Audio API, no samples. */

export type DoodleSoundId =
  | "select"
  | "hover"
  | "success"
  | "create"
  | "delete"
  | "dragStart"
  | "drop"
  | "remix"
  | "export"
  | "animate"
  | "sticker"
  | "character"
  | "sceneReady"
  | "surprise";

const MUTE_KEY = "doodlelab-sound-muted";

let audioCtx: AudioContext | null = null;

function ctx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) audioCtx = new AudioContext();
  if (audioCtx.state === "suspended") void audioCtx.resume();
  return audioCtx;
}

function tone(
  frequency: number,
  duration: number,
  type: OscillatorType = "sine",
  volume = 0.07,
  when = 0,
) {
  const c = ctx();
  if (!c) return;
  const t = c.currentTime + when;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, t);
  gain.gain.setValueAtTime(volume, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
  osc.connect(gain);
  gain.connect(c.destination);
  osc.start(t);
  osc.stop(t + duration + 0.02);
}

function noiseBurst(duration: number, volume = 0.04) {
  const c = ctx();
  if (!c) return;
  const bufferSize = c.sampleRate * duration;
  const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  const src = c.createBufferSource();
  src.buffer = buffer;
  const gain = c.createGain();
  gain.gain.setValueAtTime(volume, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
  src.connect(gain);
  gain.connect(c.destination);
  src.start();
}

const PLAYERS: Record<DoodleSoundId, () => void> = {
  select: () => {
    tone(640, 0.05, "sine", 0.09);
    tone(920, 0.04, "triangle", 0.05, 0.04);
  },
  hover: () => tone(880, 0.03, "sine", 0.035),
  success: () => {
    tone(523, 0.1, "sine", 0.08);
    tone(659, 0.1, "sine", 0.07, 0.08);
    tone(784, 0.14, "sine", 0.06, 0.16);
  },
  create: () => {
    tone(440, 0.06, "sine", 0.08);
    tone(660, 0.08, "sine", 0.07, 0.05);
    tone(880, 0.1, "triangle", 0.05, 0.1);
  },
  delete: () => {
    tone(280, 0.12, "sawtooth", 0.05);
    noiseBurst(0.12, 0.03);
  },
  dragStart: () => tone(320, 0.07, "triangle", 0.06),
  drop: () => {
    tone(180, 0.08, "sine", 0.09);
    tone(120, 0.1, "sine", 0.05, 0.04);
  },
  remix: () => {
    for (let i = 0; i < 5; i++) {
      tone(400 + i * 90, 0.08, "sine", 0.05, i * 0.06);
    }
    noiseBurst(0.2, 0.025);
  },
  export: () => {
    tone(587, 0.1, "sine", 0.07);
    tone(740, 0.12, "sine", 0.06, 0.1);
  },
  animate: () => {
    tone(300, 0.05, "sine", 0.08);
    tone(500, 0.12, "triangle", 0.07, 0.04);
    tone(700, 0.08, "sine", 0.05, 0.14);
  },
  sticker: () => {
    tone(520, 0.04, "sine", 0.09);
    tone(700, 0.06, "sine", 0.06, 0.03);
  },
  character: () => {
    tone(380, 0.07, "sine", 0.08);
    tone(560, 0.09, "triangle", 0.07, 0.06);
  },
  sceneReady: () => {
    tone(440, 0.12, "sine", 0.06);
    tone(554, 0.12, "sine", 0.06, 0.1);
    tone(659, 0.16, "sine", 0.05, 0.2);
    tone(880, 0.2, "triangle", 0.04, 0.32);
  },
  surprise: () => {
    const freqs = [400, 520, 680, 500, 760, 620];
    freqs.forEach((f, i) => tone(f, 0.07, i % 2 ? "triangle" : "sine", 0.06, i * 0.05));
  },
};

export function isSoundMuted(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(MUTE_KEY) === "1";
}

export function setSoundMuted(muted: boolean) {
  if (typeof window === "undefined") return;
  localStorage.setItem(MUTE_KEY, muted ? "1" : "0");
}

export function playDoodleSound(id: DoodleSoundId) {
  if (isSoundMuted()) return;
  try {
    PLAYERS[id]();
  } catch {
    /* ignore audio failures */
  }
}
