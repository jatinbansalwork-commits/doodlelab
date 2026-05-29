import type { MotionConfig } from "@/types/motion";
import { MOTION_TYPE_LABELS } from "@/lib/constants";

export function generateReactTailwindCode(config: MotionConfig): string {
  const label = MOTION_TYPE_LABELS[config.type] ?? config.type;
  const hidden = hiddenProps(config);
  const visible = visibleProps(config);

  return `"use client";

import { motion, AnimatePresence } from "framer-motion";

function cn(...c: (string | false | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

const itemVariants = {
  hidden: ${JSON.stringify(hidden, null, 2).replace(/"([^"]+)":/g, "$1:")},
  visible: ${JSON.stringify(visible, null, 2).replace(/"([^"]+)":/g, "$1:")},
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: ${config.duration},
      delay: ${config.delay},${config.stagger ? "\n      staggerChildren: 0.15," : ""}
    },
  },
};

/** ${label} — DoodleLab AI */
export function MotionCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.article
      variants={itemVariants}
      className={cn(
        "rounded-2xl border border-white/[0.08] bg-[#15151B] p-5 shadow-lg",
        className,
      )}
    >
      {children}
    </motion.article>
  );
}

export function MotionCardGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={cn("grid gap-4 md:grid-cols-3", className)}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  );
}

export function MotionButton({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-xl bg-[#7C5CFF] px-5 py-2.5 text-sm font-medium text-white",
        "shadow-[0_0_24px_rgba(124,92,255,0.3)]",
        className,
      )}
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
    >
      {children}
    </motion.button>
  );
}

export function MotionModal({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-md rounded-2xl border border-white/[0.08] bg-[#15151B] p-6"
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: ${config.duration}, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function MotionToast({
  visible,
  message,
}: {
  visible: boolean;
  message: string;
}) {
  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl border border-white/[0.08] bg-[#15151B] px-4 py-3 text-sm shadow-xl"
          initial={{ opacity: 0, y: 12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8 }}
        >
          {message}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
`;
}

function hiddenProps(config: MotionConfig): Record<string, number> {
  const base: Record<string, number> = { opacity: 0 };
  switch (config.type) {
    case "slideUp":
      return { ...base, y: config.distance };
    case "slideDown":
      return { ...base, y: -config.distance };
    case "slideLeft":
      return { ...base, x: config.distance };
    case "slideRight":
      return { ...base, x: -config.distance };
    case "scaleIn":
      return { ...base, scale: config.scale * 0.85 };
    default:
      return base;
  }
}

function visibleProps(config: MotionConfig): Record<string, unknown> {
  return {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    transition: {
      duration: config.duration,
      delay: config.delay,
      ease: config.easing,
    },
  };
}
