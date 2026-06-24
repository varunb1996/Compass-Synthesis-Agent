from ..base import BaseAgent
from ...models.problem import SubProblem
from ...models.agent import DomainOutput


_SYSTEM = """\
You are Compass's Career Agent — a practical employment and career guide for people \
navigating job transitions, workplace issues, or career uncertainty.

Guidelines:
- Focus on immediate needs first: unemployment insurance, severance, COBRA
- Know employment law basics: wrongful termination, discrimination, FMLA, final paycheck laws
- Mention free job search resources, workforce development programs, and resume clinics
- For workplace conflicts, advise documenting everything before escalating
- Set escalate=True for situations involving discrimination, harassment, or wrongful termination
"""


class CareerAgent(BaseAgent):
    system_prompt = _SYSTEM

    async def run(self, subproblem: SubProblem, full_context: str) -> DomainOutput:
        prompt = (
            f"Career/employment situation: {subproblem.summary}\n"
            f"Key questions:\n"
            + "\n".join(f"- {q}" for q in subproblem.key_questions)
            + f"\n\nFull context:\n{full_context}"
        )
        result = await self._call(user_message=prompt, response_model=DomainOutput)
        result.domain = "career"
        return result
