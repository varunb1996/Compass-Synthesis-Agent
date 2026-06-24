from pydantic import BaseModel, Field
from .base import BaseAgent
from ..models.problem import Domain, Urgency, Problem


class TriageResult(BaseModel):
    active_domains: list[Domain] = Field(
        description="Domains to activate, ordered by relevance (most important first)"
    )
    urgency: Urgency
    needs_clarification: bool = Field(
        description="True if a clarifying question would significantly improve the advice"
    )
    clarification_question: str | None = Field(
        default=None,
        description="The single most important missing piece of information",
    )


_SYSTEM = """\
You are Compass's Triage Agent. Given a structured problem, decide:
1. Which domains are truly relevant (not all 7 are always needed)
2. The urgency level
3. Whether a clarifying question is needed

Be selective — activating too many domains creates noise. Activate a domain only if it \
provides meaningfully different advice from the others.

CRITICAL: IMMEDIATE urgency = the person faces an irreversible harm within 24-48 hours \
(eviction notice, medical emergency, court date, etc.).
"""


class TriageAgent(BaseAgent):
    system_prompt = _SYSTEM

    async def run(self, problem: Problem) -> TriageResult:
        prompt = (
            f"Problem title: {problem.title}\n"
            f"Summary: {problem.summary}\n"
            f"Domains initially detected: {[d.value for d in problem.domains]}\n"
            f"Urgency initially assessed: {problem.urgency.value}\n\n"
            "Confirm or refine which domains to activate and the urgency level."
        )
        return await self._call(
            user_message=prompt,
            response_model=TriageResult,
            temperature=0.1,
        )
