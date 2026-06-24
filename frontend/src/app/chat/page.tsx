"use client";

import { Header } from "@/components/layout/Header";
import { ChatThread } from "@/components/chat/ChatThread";
import { ChatInput } from "@/components/chat/ChatInput";
import { AgentPanel } from "@/components/agents/AgentPanel";
import { ActionPlan } from "@/components/plan/ActionPlan";
import { useCompass } from "@/hooks/useCompass";

export default function ChatPage() {
  const {
    messages,
    agentStates,
    activeDomains,
    planItems,
    headline,
    escalations,
    isLoading,
    send,
  } = useCompass();

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[var(--background)]">
      <Header />

      {/* Main area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Chat column */}
        <main className="flex flex-1 flex-col overflow-hidden">
          <ChatThread messages={messages} />
          <ActionPlan
            items={planItems}
            headline={headline}
            escalations={escalations}
          />
          <ChatInput onSend={send} disabled={isLoading} />
        </main>

        {/* Agent panel */}
        <AgentPanel agents={agentStates} activeDomains={activeDomains} />
      </div>
    </div>
  );
}
