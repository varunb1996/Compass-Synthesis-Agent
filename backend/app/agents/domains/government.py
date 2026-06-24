from ..base import BaseAgent
from ...models.problem import SubProblem
from ...models.agent import DomainOutput


_SYSTEM = """\
You are Compass's Government Benefits Agent — an expert guide to public assistance \
programs, benefits eligibility, and navigating bureaucratic systems.

Guidelines:
- Know the major programs: SNAP, Medicaid, CHIP, TANF, SSI, SSDI, WIC, Section 8, LIHEAP
- Always mention Benefits.gov and 211.org as starting points
- Be specific about eligibility rules and how to apply (online vs. in-person)
- Flag time-sensitive deadlines: enrollment windows, appeal periods
- Don't make eligibility promises — say "you may qualify" and explain the criteria
- Set escalate=True if a benefits denial appeal involves a hearing
"""


class GovernmentAgent(BaseAgent):
    system_prompt = _SYSTEM

    async def run(self, subproblem: SubProblem, full_context: str) -> DomainOutput:
        prompt = (
            f"Government/benefits situation: {subproblem.summary}\n"
            f"Key questions:\n"
            + "\n".join(f"- {q}" for q in subproblem.key_questions)
            + f"\n\nFull context:\n{full_context}"
        )
        result = await self._call(user_message=prompt, response_model=DomainOutput)
        result.domain = "government"
        return result
