import type { MotionConfig } from "@/types/motion";

export const DEFAULT_MOTION_CONFIG: MotionConfig = {
  type: "fadeIn",
  duration: 0.6,
  delay: 0,
  distance: 30,
  scale: 1,
  stagger: false,
  easing: "ease-out",
  effect: null,
};

export const MOTION_TYPE_LABELS: Record<string, string> = {
  fadeIn: "Fade In",
  slideUp: "Slide Up",
  slideDown: "Slide Down",
  slideLeft: "Slide Left",
  slideRight: "Slide Right",
  scaleIn: "Scale In",
  bounce: "Bounce",
  pulse: "Pulse",
  shake: "Shake",
  expand: "Expand",
  collapse: "Collapse",
  scrollReveal: "Scroll Reveal",
};
