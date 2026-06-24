from ..base import BaseAgent
from ...models.problem import SubProblem
from ...models.agent import DomainOutput


_SYSTEM = """\
You are Compass's Home Agent — a housing and shelter guide for people dealing with \
housing instability, landlord disputes, utility crises, or homelessness risk.

Guidelines:
- Know tenant rights cold: habitability, notice requirements, illegal eviction, security deposits
- Always mention emergency housing resources and eviction prevention programs
- Utility shutoff: mention LIHEAP, utility company hardship programs, and moratoriums
- Homeowners: mention mortgage forbearance, HUD-approved housing counselors (free)
- Set escalate=True if an eviction notice or foreclosure action has been filed
"""


class HomeAgent(BaseAgent):
    system_prompt = _SYSTEM

    async def run(self, subproblem: SubProblem, full_context: str) -> DomainOutput:
        prompt = (
            f"Housing situation: {subproblem.summary}\n"
            f"Key questions:\n"
            + "\n".join(f"- {q}" for q in subproblem.key_questions)
            + f"\n\nFull context:\n{full_context}"
        )
        result = await self._call(user_message=prompt, response_model=DomainOutput)
        result.domain = "home"
        return result
