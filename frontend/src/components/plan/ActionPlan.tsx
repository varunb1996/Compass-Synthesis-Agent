"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlanItem } from "./PlanItem";
import { cn } from "@/lib/utils";
import type { PlanItem as PlanItemType } from "@/store/compass";

const PRIORITY_LABELS: Record<string, { label: string; color: string }> = {
  IMMEDIATE: { label: "Immediate", color: "#ef4444" },
  THIS_WEEK: { label: "This Week", color: "#f59e0b" },
  THIS_MONTH: { label: "This Month", color: "#3b82f6" },
};

const PRIORITY_ORDER = ["IMMEDIATE", "THIS_WEEK", "THIS_MONTH"];

interface ActionPlanProps {
  items: PlanItemType[];
  headline: string | null;
  escalations: string[];
}

export function ActionPlan({ items, headline, escalations }: ActionPlanProps) {
  const [expanded, setExpanded] = useState(true);

  if (items.length === 0) return null;

  const grouped = PRIORITY_ORDER.reduce<Record<string, PlanItemType[]>>((acc, p) => {
    acc[p] = items.filter((i) => i.priority === p);
    return acc;
  }, {});

  const completedCount = items.filter((i) => i.completed).length;

  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="border-t border-[var(--border)] bg-[var(--surface)]"
    >
      {/* Header */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
            Action Plan
          </span>
          {headline && (
            <span className="hidden text-xs text-zinc-600 sm:block line-clamp-1 max-w-xs">
              {headline}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-zinc-500">
            {completedCount}/{items.length} done
          </span>
          <div className="h-1 w-24 overflow-hidden rounded-full bg-zinc-800">
            <motion.div
              className="h-full rounded-full bg-green-500"
              initial={{ width: 0 }}
              animate={{ width: `${(completedCount / items.length) * 100}%` }}
            />
          </div>
          <span className="text-zinc-600 text-xs">{expanded ? "▼" : "▲"}</span>
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="overflow-hidden"
            style={{ maxHeight: "45vh", overflowY: "auto" }}
          >
            {/* Escalation warnings */}
            {escalations.length > 0 && (
              <div className="mx-4 mb-3 flex items-center gap-2 rounded-xl border border-orange-500/20 bg-orange-500/5 px-3 py-2">
                <span className="text-sm">⚠</span>
                <p className="text-xs text-orange-400">
                  Professional help strongly recommended for:{" "}
                  <strong>{escalations.join(", ")}</strong>
                </p>
              </div>
            )}

            {/* Priority groups */}
            <div className="grid grid-cols-1 gap-4 px-4 pb-4 sm:grid-cols-3">
              {PRIORITY_ORDER.map((priority) => {
                const group = grouped[priority];
                if (group.length === 0) return null;
                const meta = PRIORITY_LABELS[priority];

                return (
                  <div key={priority} className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: meta.color }}
                      />
                      <h3
                        className="text-xs font-semibold uppercase tracking-widest"
                        style={{ color: meta.color }}
                      >
                        {meta.label}
                      </h3>
                      <span className="text-xs text-zinc-600">({group.length})</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      {group.map((item) => (
                        <PlanItem key={item.id} item={item} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
