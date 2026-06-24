"use client";

import { motion } from "framer-motion";
import { DOMAIN_COLORS, DOMAIN_LABELS } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { toggleActionItem } from "@/lib/api";
import { useCompassStore } from "@/store/compass";
import type { PlanItem as PlanItemType } from "@/store/compass";

export function PlanItem({ item }: { item: PlanItemType }) {
  const togglePlanItem = useCompassStore((s) => s.togglePlanItem);
  const color = DOMAIN_COLORS[item.domain] ?? "#71717a";

  const handleToggle = async () => {
    togglePlanItem(item.id);
    await toggleActionItem(item.id, !item.completed).catch(console.error);
  };

  const confidence = item.confidence ?? 1;
  const confidenceColor =
    confidence >= 0.8 ? "#22c55e" : confidence >= 0.5 ? "#f59e0b" : "#ef4444";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        "group flex items-start gap-3 rounded-xl border p-3 transition-colors",
        item.completed
          ? "border-[var(--border-subtle)] bg-[var(--surface)] opacity-50"
          : "border-[var(--border)] bg-[var(--surface-elevated)] hover:border-zinc-600"
      )}
    >
      {/* Checkbox */}
      <button
        onClick={handleToggle}
        className={cn(
          "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all",
          item.completed
            ? "border-zinc-600 bg-zinc-600"
            : "border-zinc-600 hover:border-zinc-400"
        )}
        aria-label={item.completed ? "Mark incomplete" : "Mark complete"}
      >
        {item.completed && (
          <svg className="h-2.5 w-2.5 text-white" fill="currentColor" viewBox="0 0 12 12">
            <path d="M10.28 2.28L4 8.56 1.72 6.28a1 1 0 00-1.44 1.44l3 3a1 1 0 001.44 0l7-7a1 1 0 00-1.44-1.44z" />
          </svg>
        )}
      </button>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p
            className={cn(
              "text-sm font-medium leading-snug",
              item.completed ? "line-through text-zinc-500" : "text-zinc-100"
            )}
          >
            {item.title}
          </p>
          {/* Confidence dot */}
          <span
            className="mt-1 h-2 w-2 shrink-0 rounded-full"
            style={{ backgroundColor: confidenceColor }}
            title={`Confidence: ${Math.round(confidence * 100)}%`}
          />
        </div>

        <p className="mt-1 text-xs leading-relaxed text-zinc-500">
          {item.description}
        </p>

        {item.source_hint && (
          <p className="mt-1.5 text-xs text-zinc-600 italic">{item.source_hint}</p>
        )}

        {/* Domain badge */}
        <div className="mt-2 flex items-center gap-1.5">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: color }}
          />
          <span className="text-[10px] font-medium uppercase tracking-wide text-zinc-600">
            {DOMAIN_LABELS[item.domain] ?? item.domain}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
