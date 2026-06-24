"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (!value.trim() || disabled) return;
    onSend(value.trim());
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  };

  return (
    <div className="border-t border-[var(--border)] bg-[var(--background)] px-4 py-4">
      <div
        className={cn(
          "flex items-end gap-3 rounded-2xl border bg-[var(--surface)] px-4 py-3",
          "border-[var(--border)] transition-colors",
          "focus-within:border-zinc-600"
        )}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          disabled={disabled}
          rows={1}
          placeholder="Tell Compass what's going on in your life…"
          className={cn(
            "flex-1 resize-none bg-transparent text-sm text-zinc-100 outline-none",
            "placeholder:text-zinc-600",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "min-h-[24px] max-h-[160px]"
          )}
        />
        <button
          onClick={handleSend}
          disabled={disabled || !value.trim()}
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-all",
            "bg-zinc-100 text-zinc-900 hover:bg-white",
            "disabled:opacity-30 disabled:cursor-not-allowed",
            "text-sm font-medium"
          )}
          aria-label="Send message"
        >
          ↑
        </button>
      </div>
      <p className="mt-2 text-center text-[11px] text-zinc-700">
        Compass provides general guidance, not professional advice. Always verify with a licensed professional.
      </p>
    </div>
  );
}
