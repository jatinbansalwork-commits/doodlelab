import { DEFAULT_MOTION_CONFIG } from "@/lib/constants";
import type {
  MotionConfig,
  MotionParser,
  MotionType,
  ParserResult,
} from "@/types/motion";

export class KeywordMotionParser implements MotionParser {
  parse(prompt: string, base: Partial<MotionConfig> = {}): ParserResult {
    const text = prompt.toLowerCase().trim();
    const matchedKeywords: string[] = [];
    const config: MotionConfig = { ...DEFAULT_MOTION_CONFIG, ...base };

    config.type = this.resolveType(text, matchedKeywords);

    if (/\bstagger\b/.test(text)) {
      config.stagger = true;
      matchedKeywords.push("stagger");
    }

    if (/\bslow\b|\bsoft\b|\bgentle\b/.test(text)) {
      config.duration = 1.2;
      config.easing = "ease-out";
      matchedKeywords.push("slow");
    }
    if (/\bfast\b|\bsnappy\b|\bquick\b/.test(text)) {
      config.duration = 0.3;
      matchedKeywords.push("fast");
    }
    if (/\bspring\b/.test(text)) {
      config.easing = "spring";
      matchedKeywords.push("spring");
    }

    const durationMs = text.match(/(\d+(?:\.\d+)?)\s*ms/);
    if (durationMs) {
      config.duration = parseFloat(durationMs[1]) / 1000;
      matchedKeywords.push("duration-ms");
    }

    const staggerMs = text.match(/(\d+)\s*ms\s*stagger/);
    if (staggerMs) {
      config.stagger = true;
      matchedKeywords.push("stagger-ms");
    }

    const delayMatch = text.match(/delay\s*(\d+(?:\.\d+)?)/);
    if (delayMatch) {
      config.delay = parseFloat(delayMatch[1]) / (text.includes("ms") ? 1000 : 1);
      matchedKeywords.push("delay");
    }

    const pxMatch = text.match(/(\d+)\s*px/);
    if (pxMatch) config.distance = parseInt(pxMatch[1], 10);

    if (/\bsubtle\b/.test(text)) {
      config.distance = 16;
      config.scale = 0.98;
    }

    return { config, matchedKeywords };
  }

  private resolveType(text: string, matched: string[]): MotionType {
    const rules: Array<{ pattern: RegExp; type: MotionType; key: string }> = [
      { pattern: /\bscroll\s*reveal\b/, type: "scrollReveal", key: "scroll reveal" },
      { pattern: /\bcollapse\b/, type: "collapse", key: "collapse" },
      { pattern: /\bexpand\b/, type: "expand", key: "expand" },
      { pattern: /\bbounce\b/, type: "bounce", key: "bounce" },
      { pattern: /\bpulse\b|\bloading\b/, type: "pulse", key: "pulse" },
      { pattern: /\bshake\b/, type: "shake", key: "shake" },
      { pattern: /\bslide\s*up\b|\bupward\b/, type: "slideUp", key: "slide up" },
      { pattern: /\bslide\s*down\b/, type: "slideDown", key: "slide down" },
      { pattern: /\bslide\s*left\b/, type: "slideLeft", key: "slide left" },
      { pattern: /\bslide\s*right\b/, type: "slideRight", key: "slide right" },
      { pattern: /\bscale\s*in\b|\bzoom\b|\bmodal\b/, type: "scaleIn", key: "scale" },
      { pattern: /\bfade\b|\breveal\b|\bappear\b/, type: "fadeIn", key: "fade" },
      { pattern: /\bcard\b|\bhero\b|\bdashboard\b/, type: "slideUp", key: "cards" },
    ];

    for (const rule of rules) {
      if (rule.pattern.test(text)) {
        matched.push(rule.key);
        return rule.type;
      }
    }
    return "fadeIn";
  }
}

export const motionParser: MotionParser = new KeywordMotionParser();

export function parseMotionPrompt(
  prompt: string,
  base?: Partial<MotionConfig>,
): ParserResult {
  return motionParser.parse(prompt, base);
}
