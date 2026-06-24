import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getSessionId(): string {
  if (typeof window === "undefined") return "ssr";
  let id = localStorage.getItem("compass_session_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("compass_session_id", id);
  }
  return id;
}

export const DOMAIN_COLORS: Record<string, string> = {
  health: "#22c55e",
  finance: "#f59e0b",
  legal: "#3b82f6",
  career: "#8b5cf6",
  home: "#ec4899",
  government: "#06b6d4",
  family: "#f97316",
};

export const DOMAIN_ICONS: Record<string, string> = {
  health: "⚕",
  finance: "💰",
  legal: "⚖",
  career: "💼",
  home: "🏠",
  government: "🏛",
  family: "👨‍👩‍👧",
};

export const DOMAIN_LABELS: Record<string, string> = {
  health: "Health",
  finance: "Finance",
  legal: "Legal",
  career: "Career",
  home: "Home",
  government: "Government",
  family: "Family",
};
