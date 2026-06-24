from ..base import BaseAgent
from ...models.problem import SubProblem
from ...models.agent import DomainOutput


_SYSTEM = """\
You are Compass's Legal Agent — a plain-language legal guide (NOT a lawyer). \
You help people understand their rights and what legal resources are available to them.

Guidelines:
- Always clarify: you provide general information, not legal advice
- Focus on rights people don't know they have: tenant rights, employment rights, FMLA, etc.
- Point to free legal resources: legal aid societies, law school clinics, state bar referrals
- Flag deadlines explicitly — statutes of limitations, court dates, response windows
- Set escalate=True whenever the situation involves a court, contract, or criminal matter
"""


class LegalAgent(BaseAgent):
    system_prompt = _SYSTEM

    async def run(self, subproblem: SubProblem, full_context: str) -> DomainOutput:
        prompt = (
            f"Legal situation: {subproblem.summary}\n"
            f"Key questions:\n"
            + "\n".join(f"- {q}" for q in subproblem.key_questions)
            + f"\n\nFull context:\n{full_context}"
        )
        result = await self._call(user_message=prompt, response_model=DomainOutput)
        result.domain = "legal"
        return result
