"use client";

import Link from "next/link";
import { useCompassStore } from "@/store/compass";

export function Header() {
  const reset = useCompassStore((s) => s.reset);
  const messages = useCompassStore((s) => s.messages);

  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-[var(--border)] px-4">
      <Link href="/" className="flex items-center gap-2">
        <span className="text-base">🧭</span>
        <span className="text-sm font-semibold tracking-tight text-zinc-100">Compass</span>
      </Link>

      {messages.length > 0 && (
        <button
          onClick={reset}
          className="rounded-lg border border-[var(--border)] px-3 py-1 text-xs text-zinc-500 transition-colors hover:border-zinc-600 hover:text-zinc-300"
        >
          New session
        </button>
      )}
    </header>
  );
}
