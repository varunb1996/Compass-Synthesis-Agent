from pydantic import BaseModel, Field
from .base import BaseAgent

from ..models.agent import DomainOutput
from ..models.plan import Conflict


class ConflictAnalysis(BaseModel):
    conflicts: list[Conflict]
    has_conflicts: bool


_SYSTEM = """\
You are Compass's Conflict Resolution Agent. Given advice from multiple domain agents, \
identify contradictions and resolve them into a coherent position.

A conflict exists when two domain agents give advice that cannot both be followed \
simultaneously or that directly contradict each other.

Examples of real conflicts:
- HealthAgent: "take 2 weeks bed rest" vs CareerAgent: "return to work immediately"
- FinanceAgent: "file for bankruptcy" vs LegalAgent: "negotiate payment plan before filing"

For each conflict, provide a clear, human-readable resolution that a lay person can act on.
"""


class ConflictAgent(BaseAgent):
    system_prompt = _SYSTEM

    async def run(self, domain_outputs: list[DomainOutput]) -> ConflictAnalysis:
        summaries = []
        for output in domain_outputs:
            items_text = "; ".join(item.title for item in output.items[:3])
            summaries.append(
                f"{output.domain.upper()}: {output.headline} | Items: {items_text}"
            )

        prompt = (
            "Domain agent outputs:\n\n"
            + "\n".join(summaries)
            + "\n\nIdentify any conflicts and resolve them."
        )
        return await self._call(
            user_message=prompt,
            response_model=ConflictAnalysis,
            temperature=0.2,
        )
