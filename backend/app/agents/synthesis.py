import uuid
from .base import BaseAgent
from ..models.agent import DomainOutput
from ..models.plan import ActionPlan, Conflict
from ..models.problem import Problem


_SYSTEM = """\
You are Compass's Synthesis Agent. You take advice from multiple domain agents and \
produce a single, prioritized, human-friendly action plan.

Rules for prioritization:
- IMMEDIATE: actions that must happen TODAY to prevent irreversible harm
  (eviction filing, medical emergency, court deadline, service shutoff in 24h)
- THIS_WEEK: actions that should happen within 7 days to prevent escalation
- THIS_MONTH: important but not urgent actions

Rules for the plan:
- Maximum 12 items total (quality over quantity)
- Each item must be a specific, concrete action — not vague advice
- Order items within each priority group by importance
- The headline must capture the full situation in one sentence
- Include escalation warnings for domains that need professional help

Output valid JSON matching the ActionPlan schema.
"""


class SynthesisAgent(BaseAgent):
    system_prompt = _SYSTEM

    async def run(
        self,
        problem: Problem,
        domain_outputs: list[DomainOutput],
        conflicts: list[Conflict],
        session_id: str,
        conversation_id: str,
    ) -> ActionPlan:
        domain_text = []
        for output in domain_outputs:
            items_text = "\n".join(
                f"  [{item.confidence:.0%}] {item.title}: {item.description}"
                for item in output.items
            )
            domain_text.append(
                f"=== {output.domain.upper()} ===\n"
                f"Headline: {output.headline}\n"
                f"Items:\n{items_text}\n"
                f"Escalate: {output.escalate}"
                + (f" ({output.escalation_reason})" if output.escalation_reason else "")
            )

        conflict_text = ""
        if conflicts:
            conflict_text = "\nCONFLICTS RESOLVED:\n" + "\n".join(
                f"- {c.description} → {c.resolution}" for c in conflicts
            )

        prompt = (
            f"Situation: {problem.summary}\n"
            f"Urgency: {problem.urgency.value}\n\n"
            + "\n\n".join(domain_text)
            + conflict_text
            + f"\n\nMissing info: {problem.missing_info or 'none'}"
            + f"\n\nProduce an ActionPlan with session_id='{session_id}' and conversation_id='{conversation_id}'."
        )

        return await self._call(
            user_message=prompt,
            response_model=ActionPlan,
            temperature=0.2,
            max_tokens=3000,
        )
