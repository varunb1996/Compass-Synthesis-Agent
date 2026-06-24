"use client";

import { useCallback } from "react";
import { streamCompass } from "@/lib/api";
import { getSessionId } from "@/lib/utils";
import { useCompassStore } from "@/store/compass";

export function useCompass() {
  const store = useCompassStore();

  const send = useCallback(
    async (message: string) => {
      if (!message.trim() || store.isLoading) return;

      store.reset();
      store.setLoading(true);

      const userMsgId = crypto.randomUUID();
      store.addMessage({ id: userMsgId, role: "user", content: message });

      const assistantMsgId = crypto.randomUUID();
      store.addMessage({
        id: assistantMsgId,
        role: "assistant",
        content: "",
        isStreaming: true,
      });

      try {
        for await (const event of streamCompass(message, getSessionId())) {
          const e = event.event as string;

          if (e === "status") {
            store.updateMessage(assistantMsgId, {
              content: event.message as string,
              isStreaming: true,
            });
          } else if (e === "triage:done") {
            const domains = event.domains as string[];
            store.setActiveDomains(domains);
            store.setUrgency(event.urgency as string);
            domains.forEach((d) => store.setAgentStatus(d, "queued"));
          } else if (e === "agent:start") {
            store.setAgentStatus(event.domain as string, "thinking");
          } else if (e === "agent:done") {
            store.setAgentStatus(event.domain as string, "done", {
              headline: event.headline as string,
              itemCount: event.item_count as number,
              escalate: event.escalate as boolean,
            });
          } else if (e === "agent:error") {
            store.setAgentStatus(event.domain as string, "error");
          } else if (e === "plan:item") {
            store.addPlanItem({
              id: event.id as string,
              domain: event.domain as string,
              priority: event.priority as "IMMEDIATE" | "THIS_WEEK" | "THIS_MONTH",
              title: event.title as string,
              description: event.description as string,
              confidence: event.confidence as number,
              source_hint: event.source_hint as string | undefined,
              completed: false,
            });
          } else if (e === "session:complete") {
            store.setHeadline(event.headline as string);
            store.setConversationId(event.conversation_id as string);
            store.setEscalations((event.escalations as string[]) ?? []);
            store.updateMessage(assistantMsgId, {
              content: event.headline as string,
              isStreaming: false,
              domains: store.activeDomains,
              urgency: store.urgency ?? undefined,
            });
          }
        }
      } catch (err) {
        store.updateMessage(assistantMsgId, {
          content: "Something went wrong. Please try again.",
          isStreaming: false,
        });
        console.error("Compass stream error:", err);
      } finally {
        store.setLoading(false);
      }
    },
    [store]
  );

  return { send, ...store };
}
