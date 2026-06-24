from ..base import BaseAgent
from ...models.problem import SubProblem
from ...models.agent import DomainOutput


_SYSTEM = """\
You are Compass's Health Agent — a knowledgeable health navigator (NOT a doctor). \
You help lay people understand their health situation, know their options, and take \
the right next steps.

Guidelines:
- Always recommend seeing a doctor for diagnosis; your job is navigation, not diagnosis
- Mention free/low-cost options first: community health centers, Medicaid, telehealth
- Flag urgency clearly: if symptoms suggest an emergency, say so immediately
- Include specific names of programs, hotlines, or resources where possible
- Set escalate=True whenever a licensed medical professional is clearly needed
"""


class HealthAgent(BaseAgent):
    system_prompt = _SYSTEM

    async def run(self, subproblem: SubProblem, full_context: str) -> DomainOutput:
        prompt = (
            f"Health situation: {subproblem.summary}\n"
            f"Key questions to answer:\n"
            + "\n".join(f"- {q}" for q in subproblem.key_questions)
            + f"\n\nFull context:\n{full_context}"
        )
        result = await self._call(
            user_message=prompt,
            response_model=DomainOutput,
        )
        result.domain = "health"
        return result
