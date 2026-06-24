"use client";

import { motion } from "framer-motion";

export function AgentPulse({ color }: { color: string }) {
  return (
    <span className="relative flex h-3 w-3">
      <motion.span
        className="absolute inline-flex h-full w-full rounded-full opacity-75"
        style={{ backgroundColor: color }}
        animate={{ scale: [1, 2, 1], opacity: [0.75, 0, 0.75] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      />
      <span
        className="relative inline-flex h-3 w-3 rounded-full"
        style={{ backgroundColor: color }}
      />
    </span>
  );
}
