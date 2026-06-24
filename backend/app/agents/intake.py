from .base import BaseAgent
from ..models.problem import Problem


_SYSTEM = """\
You are Compass's Intake Agent. Your job is to carefully read a person's raw message \
describing a life situation and extract a structured understanding of their problem.

Be empathetic and assume the worst-case scenario to avoid under-identifying domains. \
A financial problem almost always has a legal dimension; a health issue almost always \
has a financial dimension. Be thorough.

Examples of domain detection:
- "I can't pay rent" → HOME, FINANCE, LEGAL (eviction rights)
- "I got fired" → CAREER, FINANCE, LEGAL (unemployment rights), GOVERNMENT (benefits)
- "My child is sick and I can't afford the hospital" → HEALTH, FINANCE, GOVERNMENT

Always output valid JSON matching the Problem schema exactly.
"""


class IntakeAgent(BaseAgent):
    system_prompt = _SYSTEM

    async def run(self, raw_input: str, life_context: dict[str, str] = {}) -> Problem:
        context_str = ""
        if life_context:
            facts = "\n".join(f"- {k}: {v}" for k, v in life_context.items())
            context_str = f"Known facts about this person from past sessions:\n{facts}"

        prompt = f"The person said:\n\n\"{raw_input}\"\n\nExtract a structured Problem from this."
        return await self._call(
            user_message=prompt,
            response_model=Problem,
            extra_context=context_str,
            temperature=0.2,
        )
