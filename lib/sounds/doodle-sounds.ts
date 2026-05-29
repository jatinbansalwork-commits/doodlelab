/**
 * DoodleLab sound engine — procedural Web Audio, no samples.
 * Playful / paper-toy character; all cues ≤ 400ms; non-blocking.
 */

const MUTE_KEY = "doodlelab-sound-muted";
const MAX_DURATION_S = 0.4;

let audioCtx: AudioContext | null = null;
let audioDisabled = false;

function getCtx(): AudioContext | null {
  if (audioDisabled || typeof window === "undefined") return null;
  try {
    if (!audioCtx) {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctx) {
        audioDisabled = true;
        return null;
      }
      audioCtx = new Ctx();
    }
    if (audioCtx.state === "suspended") {
      void audioCtx.resume().catch(() => {
        /* user gesture may be required */
      });
    }
    return audioCtx;
  } catch {
    audioDisabled = true;
    return null;
  }
}

function clampDuration(seconds: number): number {
  return Math.min(seconds, MAX_DURATION_S);
}

function tone(
  frequency: number,
  duration: number,
  type: OscillatorType = "sine",
  volume = 0.065,
  when = 0,
) {
  const c = getCtx();
  if (!c) return;
  const dur = clampDuration(duration);
  const t = c.currentTime + when;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, t);
  gain.gain.setValueAtTime(volume, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
  osc.connect(gain);
  gain.connect(c.destination);
  osc.start(t);
  osc.stop(t + dur + 0.015);
}

function noiseTap(duration: number, volume = 0.028) {
  const c = getCtx();
  if (!c) return;
  const dur = clampDuration(duration);
  const bufferSize = Math.floor(c.sampleRate * dur);
  const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize) * 0.6;
  }
  const src = c.createBufferSource();
  src.buffer = buffer;
  const gain = c.createGain();
  const t = c.currentTime;
  gain.gain.setValueAtTime(volume, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
  src.connect(gain);
  gain.connect(c.destination);
  src.start(t);
}

function runSound(fn: () => void) {
  if (isSoundMuted() || audioDisabled) return;
  try {
    fn();
  } catch {
    audioDisabled = true;
  }
}

/** Schedule on next frame so UI handlers never wait on audio. */
function play(fn: () => void) {
  if (typeof requestAnimationFrame !== "undefined") {
    requestAnimationFrame(() => runSound(fn));
  } else {
    runSound(fn);
  }
}

// —— Mute / prefs ——

export function isSoundMuted(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(MUTE_KEY) === "1";
  } catch {
    return false;
  }
}

export function setSoundMuted(muted: boolean): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(MUTE_KEY, muted ? "1" : "0");
  } catch {
    /* storage unavailable */
  }
}

export function toggleSoundMuted(): boolean {
  const next = !isSoundMuted();
  setSoundMuted(next);
  return next;
}

// —— Playful cues (≤ 400ms each) ——

/** Tiny tick — toolbar / button hover */
export function playHover(): void {
  play(() => tone(920, 0.028, "sine", 0.03));
}

/** Soft paper tap — generic button press */
export function playClick(): void {
  play(() => {
    tone(520, 0.04, "sine", 0.07);
    noiseTap(0.03, 0.02);
  });
}

/** Cute pop + little boing — new character */
export function playAddCharacter(): void {
  play(() => {
    tone(360, 0.05, "sine", 0.075);
    tone(540, 0.07, "triangle", 0.06, 0.04);
    tone(720, 0.08, "sine", 0.045, 0.09);
  });
}

/** Sticky double pop — new sticker */
export function playAddSticker(): void {
  play(() => {
    tone(580, 0.035, "sine", 0.08);
    tone(760, 0.045, "sine", 0.065, 0.04);
    noiseTap(0.025, 0.018);
  });
}

/** Soft pop — canvas selection */
export function playSelect(): void {
  play(() => {
    tone(620, 0.045, "sine", 0.08);
    tone(880, 0.035, "triangle", 0.045, 0.035);
  });
}

/** Gentle pluck — drag start */
export function playDragStart(): void {
  play(() => tone(300, 0.065, "triangle", 0.055));
}

/** Soft thump — drop */
export function playDrop(): void {
  play(() => {
    tone(190, 0.07, "sine", 0.075);
    tone(130, 0.09, "sine", 0.04, 0.035);
  });
}

/** Quick magical swirl — remix scene */
export function playRemix(): void {
  play(() => {
    const steps = [420, 520, 640, 580, 720];
    steps.forEach((f, i) => tone(f, 0.055, i % 2 ? "triangle" : "sine", 0.045, i * 0.045));
    noiseTap(0.08, 0.02);
  });
}

/** Short success chime — export */
export function playExport(): void {
  play(() => {
    tone(587, 0.09, "sine", 0.065);
    tone(740, 0.1, "sine", 0.055, 0.085);
  });
}

/** Ding + sparkle — board ready / surprise / wins */
export function playSuccess(): void {
  play(() => {
    tone(523, 0.09, "sine", 0.07);
    tone(659, 0.09, "sine", 0.06, 0.07);
    tone(784, 0.12, "sine", 0.05, 0.14);
    tone(988, 0.08, "triangle", 0.035, 0.22);
  });
}
