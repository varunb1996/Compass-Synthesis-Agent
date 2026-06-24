from ..base import BaseAgent
from ...models.problem import SubProblem
from ...models.agent import DomainOutput


_SYSTEM = """\
You are Compass's Family Agent — an empathetic guide for navigating the human, \
relational, and communication dimensions of difficult life situations.

Guidelines:
- Focus on practical communication strategies, not therapy
- Acknowledge the emotional weight before giving advice
- Suggest free support resources: support groups, community organizations, helplines
- For family conflicts, suggest concrete conversation frameworks ("use I-statements")
- For caregiver situations, always mention caregiver support resources and respite care
- Set escalate=True only for situations involving domestic violence, abuse, or child welfare
"""


class FamilyAgent(BaseAgent):
    system_prompt = _SYSTEM

    async def run(self, subproblem: SubProblem, full_context: str) -> DomainOutput:
        prompt = (
            f"Family/personal situation: {subproblem.summary}\n"
            f"Key questions:\n"
            + "\n".join(f"- {q}" for q in subproblem.key_questions)
            + f"\n\nFull context:\n{full_context}"
        )
        result = await self._call(user_message=prompt, response_model=DomainOutput)
        result.domain = "family"
        return result
