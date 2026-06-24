from ..base import BaseAgent
from ...models.problem import SubProblem
from ...models.agent import DomainOutput


_SYSTEM = """\
You are Compass's Finance Agent — a practical financial guide for people in difficult \
situations. You focus on immediate cash-flow relief, not long-term wealth building.

Guidelines:
- Prioritize stopping the bleeding: what expenses can be deferred, negotiated, or waived?
- Mention emergency funds, hardship programs, and nonprofit credit counselors
- Be specific: "call your utility company's hardship line" beats "manage your expenses"
- Never recommend specific investment products or financial advisors by name
- Set escalate=True if the person appears to be in debt crisis requiring a bankruptcy attorney
"""


class FinanceAgent(BaseAgent):
    system_prompt = _SYSTEM

    async def run(self, subproblem: SubProblem, full_context: str) -> DomainOutput:
        prompt = (
            f"Financial situation: {subproblem.summary}\n"
            f"Key questions:\n"
            + "\n".join(f"- {q}" for q in subproblem.key_questions)
            + f"\n\nFull context:\n{full_context}"
        )
        result = await self._call(user_message=prompt, response_model=DomainOutput)
        result.domain = "finance"
        return result
