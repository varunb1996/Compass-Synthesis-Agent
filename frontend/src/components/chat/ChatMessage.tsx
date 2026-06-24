"use client";

import { DOMAIN_COLORS, DOMAIN_LABELS } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Message } from "@/store/compass";

const URGENCY_STYLES: Record<string, string> = {
  critical: "bg-red-500/10 text-red-400 border-red-500/20",
  high: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  low: "bg-zinc-800 text-zinc-400 border-zinc-700",
};

export function ChatMessage({ message }: { message: Message }) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[75%] rounded-2xl rounded-br-sm bg-zinc-800 px-4 py-3 text-sm text-zinc-100">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        className={cn(
          "max-w-[85%] rounded-2xl rounded-bl-sm px-4 py-3 text-sm",
          "bg-[var(--surface-elevated)] text-zinc-200 border border-[var(--border-subtle)]",
          message.isStreaming && "cursor-blink"
        )}
      >
        {message.content || (
          <span className="text-zinc-500 italic">Analyzing your situation…</span>
        )}
      </div>

      {/* Domain tags */}
      {message.domains && message.domains.length > 0 && (
        <div className="flex flex-wrap gap-2 pl-1">
          {message.domains.map((d) => (
            <span
              key={d}
              className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium"
              style={{
                borderColor: DOMAIN_COLORS[d] + "40",
                color: DOMAIN_COLORS[d],
                backgroundColor: DOMAIN_COLORS[d] + "12",
              }}
            >
              {DOMAIN_LABELS[d] ?? d}
            </span>
          ))}
          {message.urgency && message.urgency !== "low" && (
            <span
              className={cn(
                "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide",
                URGENCY_STYLES[message.urgency] ?? URGENCY_STYLES.low
              )}
            >
              {message.urgency}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
