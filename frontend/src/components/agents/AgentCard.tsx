"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AgentPulse } from "./AgentPulse";
import { DOMAIN_COLORS, DOMAIN_ICONS, DOMAIN_LABELS } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { AgentState } from "@/store/compass";

const STATUS_LABEL: Record<string, string> = {
  queued: "queued",
  thinking: "thinking…",
  done: "done",
  error: "error",
};

export function AgentCard({ agent }: { agent: AgentState }) {
  const color = DOMAIN_COLORS[agent.domain] ?? "#71717a";
  const icon = DOMAIN_ICONS[agent.domain] ?? "◉";
  const label = DOMAIN_LABELS[agent.domain] ?? agent.domain;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex items-start gap-3 rounded-xl border p-3 transition-colors",
        agent.status === "thinking"
          ? "border-[var(--border)] bg-[var(--surface-elevated)]"
          : "border-[var(--border-subtle)] bg-[var(--surface)]"
      )}
    >
      {/* Icon */}
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-base"
        style={{ backgroundColor: color + "20" }}
      >
        {icon}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium text-zinc-200">{label}</span>
          <span className="flex items-center gap-1.5 text-xs text-zinc-500">
            {agent.status === "thinking" && <AgentPulse color={color} />}
            {agent.status === "done" && (
              <span style={{ color }} className="text-xs">✓</span>
            )}
            {agent.status === "error" && (
              <span className="text-red-400 text-xs">✕</span>
            )}
            {STATUS_LABEL[agent.status]}
          </span>
        </div>

        <AnimatePresence>
          {agent.headline && agent.status === "done" && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-1 text-xs leading-relaxed text-zinc-500 line-clamp-2"
            >
              {agent.headline}
            </motion.p>
          )}
        </AnimatePresence>

        {agent.escalate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-1.5 inline-flex items-center gap-1 rounded-md bg-orange-500/10 px-1.5 py-0.5 text-[10px] font-medium text-orange-400"
          >
            ⚠ Professional help recommended
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
