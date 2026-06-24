"use client";

import { create } from "zustand";

export type AgentStatus = "queued" | "thinking" | "done" | "error";

export interface AgentState {
  domain: string;
  status: AgentStatus;
  headline?: string;
  itemCount?: number;
  escalate?: boolean;
}

export interface PlanItem {
  id: string;
  domain: string;
  priority: "IMMEDIATE" | "THIS_WEEK" | "THIS_MONTH";
  title: string;
  description: string;
  confidence: number;
  source_hint?: string;
  completed: boolean;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  domains?: string[];
  urgency?: string;
  isStreaming?: boolean;
}

interface CompassStore {
  messages: Message[];
  agentStates: Record<string, AgentState>;
  planItems: PlanItem[];
  activeDomains: string[];
  urgency: string | null;
  isLoading: boolean;
  headline: string | null;
  conversationId: string | null;
  escalations: string[];

  addMessage: (msg: Message) => void;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  setAgentStatus: (domain: string, status: AgentStatus, extra?: Partial<AgentState>) => void;
  addPlanItem: (item: PlanItem) => void;
  togglePlanItem: (id: string) => void;
  setActiveDomains: (domains: string[]) => void;
  setUrgency: (urgency: string) => void;
  setLoading: (loading: boolean) => void;
  setHeadline: (headline: string) => void;
  setConversationId: (id: string) => void;
  setEscalations: (domains: string[]) => void;
  reset: () => void;
}

export const useCompassStore = create<CompassStore>((set) => ({
  messages: [],
  agentStates: {},
  planItems: [],
  activeDomains: [],
  urgency: null,
  isLoading: false,
  headline: null,
  conversationId: null,
  escalations: [],

  addMessage: (msg) =>
    set((s) => ({ messages: [...s.messages, msg] })),

  updateMessage: (id, updates) =>
    set((s) => ({
      messages: s.messages.map((m) => (m.id === id ? { ...m, ...updates } : m)),
    })),

  setAgentStatus: (domain, status, extra = {}) =>
    set((s) => ({
      agentStates: {
        ...s.agentStates,
        [domain]: { ...s.agentStates[domain], domain, status, ...extra },
      },
    })),

  addPlanItem: (item) =>
    set((s) => ({ planItems: [...s.planItems, item] })),

  togglePlanItem: (id) =>
    set((s) => ({
      planItems: s.planItems.map((i) =>
        i.id === id ? { ...i, completed: !i.completed } : i
      ),
    })),

  setActiveDomains: (domains) => set({ activeDomains: domains }),
  setUrgency: (urgency) => set({ urgency }),
  setLoading: (isLoading) => set({ isLoading }),
  setHeadline: (headline) => set({ headline }),
  setConversationId: (conversationId) => set({ conversationId }),
  setEscalations: (escalations) => set({ escalations }),

  reset: () =>
    set({
      agentStates: {},
      planItems: [],
      activeDomains: [],
      urgency: null,
      isLoading: false,
      headline: null,
      conversationId: null,
      escalations: [],
    }),
}));
