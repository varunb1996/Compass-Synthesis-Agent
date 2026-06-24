"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AgentCard } from "./AgentCard";
import type { AgentState } from "@/store/compass";

interface AgentPanelProps {
  agents: Record<string, AgentState>;
  activeDomains: string[];
}

export function AgentPanel({ agents, activeDomains }: AgentPanelProps) {
  const hasAgents = activeDomains.length > 0;

  return (
    <aside className="flex w-72 shrink-0 flex-col border-l border-[var(--border)] bg-[var(--surface)]">
      <div className="border-b border-[var(--border)] px-4 py-3">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
          Agents
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3">
        {!hasAgents ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
            <div className="text-2xl opacity-20">🤖</div>
            <p className="text-xs text-zinc-600">
              Agents will activate after you send a message
            </p>
          </div>
        ) : (
          <motion.div layout className="flex flex-col gap-2">
            <AnimatePresence>
              {activeDomains.map((domain) =>
                agents[domain] ? (
                  <AgentCard key={domain} agent={agents[domain]} />
                ) : null
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </aside>
  );
}
