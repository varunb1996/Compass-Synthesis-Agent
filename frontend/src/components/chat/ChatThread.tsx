"use client";

import { useEffect, useRef } from "react";
import type { Message } from "@/store/compass";
import { ChatMessage } from "./ChatMessage";

export function ChatThread({ messages }: { messages: Message[] }) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--surface-elevated)] text-2xl">
          🧭
        </div>
        <div>
          <p className="text-base font-medium text-zinc-200">
            Tell Compass what&apos;s going on
          </p>
          <p className="mt-1 text-sm text-zinc-500">
            Describe your situation in plain language — the messier the better.
            <br />
            Compass handles health, money, legal, career, housing, benefits, and family.
          </p>
        </div>
        <div className="mt-2 flex flex-wrap justify-center gap-2">
          {EXAMPLE_PROMPTS.map((p) => (
            <span
              key={p}
              className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs text-zinc-400"
            >
              {p}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-4 py-6">
      {messages.map((msg) => (
        <ChatMessage key={msg.id} message={msg} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}

const EXAMPLE_PROMPTS = [
  "I just got diagnosed with diabetes",
  "My landlord won't fix the heating",
  "I lost my job last week",
  "I'm 3 months behind on rent",
];
