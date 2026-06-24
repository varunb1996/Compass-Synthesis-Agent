import asyncio
import json
import logging
import uuid
from collections.abc import AsyncGenerator

from ..agents.intake import IntakeAgent
from ..agents.triage import TriageAgent
from ..agents.conflict import ConflictAgent
from ..agents.synthesis import SynthesisAgent
from ..agents.domains.health import HealthAgent
from ..agents.domains.finance import FinanceAgent
from ..agents.domains.legal import LegalAgent
from ..agents.domains.career import CareerAgent
from ..agents.domains.home import HomeAgent
from ..agents.domains.government import GovernmentAgent
from ..agents.domains.family import FamilyAgent
from ..models.problem import Domain, SubProblem
from ..models.agent import DomainOutput
from ..services import memory

logger = logging.getLogger(__name__)

DOMAIN_AGENTS: dict[str, object] = {
    "health": HealthAgent(),
    "finance": FinanceAgent(),
    "legal": LegalAgent(),
    "career": CareerAgent(),
    "home": HomeAgent(),
    "government": GovernmentAgent(),
    "family": FamilyAgent(),
}


def _event(event: str, data: dict) -> str:
    return f"data: {json.dumps({'event': event, **data})}\n\n"


async def run_compass(
    user_message: str,
    session_id: str,
) -> AsyncGenerator[str, None]:
    conversation_id = str(uuid.uuid4())

    yield _event("status", {"message": "Understanding your situation..."})

    await memory.get_or_create_session(session_id)
    life_context = await memory.get_life_context(session_id)

    # Intake
    intake = IntakeAgent()
    problem = await intake.run(user_message, life_context)
    yield _event("intake:done", {"title": problem.title, "urgency": problem.urgency.value})

    # Triage
    triage = TriageAgent()
    triage_result = await triage.run(problem)
    active_domains = [d.value for d in triage_result.active_domains]

    yield _event("triage:done", {
        "domains": active_domains,
        "urgency": triage_result.urgency.value,
        "clarification": triage_result.clarification_question,
    })

    for domain in active_domains:
        yield _event("agent:start", {"domain": domain})

    full_context = f"{problem.summary}\n\nRaw situation: {user_message}"

    async def run_domain(domain: str) -> DomainOutput | None:
        agent = DOMAIN_AGENTS.get(domain)
        if not agent:
            return None
        subproblem = next(
            (sp for sp in problem.subproblems if sp.domain.value == domain),
            None,
        )
        if subproblem is None:
            subproblem = SubProblem(
                domain=Domain(domain),
                summary=problem.summary,
                key_questions=["What should this person do?"],
            )
        try:
            return await agent.run(subproblem, full_context)  # type: ignore[union-attr]
        except Exception as exc:
            logger.error("Domain agent %s failed: %s", domain, exc)
            return None

    results = await asyncio.gather(*[run_domain(d) for d in active_domains])

    domain_outputs: list[DomainOutput] = []
    for domain, output in zip(active_domains, results):
        if output:
            domain_outputs.append(output)
            yield _event("agent:done", {
                "domain": domain,
                "headline": output.headline,
                "item_count": len(output.items),
                "escalate": output.escalate,
            })
        else:
            yield _event("agent:error", {"domain": domain})

    yield _event("status", {"message": "Resolving any conflicts..."})
    conflict_agent = ConflictAgent()
    conflict_analysis = await conflict_agent.run(domain_outputs)

    yield _event("status", {"message": "Building your action plan..."})
    synthesis = SynthesisAgent()
    plan = await synthesis.run(
        problem=problem,
        domain_outputs=domain_outputs,
        conflicts=conflict_analysis.conflicts,
        session_id=session_id,
        conversation_id=conversation_id,
    )

    for item in plan.items:
        yield _event("plan:item", {
            "id": item.id,
            "domain": item.domain,
            "priority": item.priority,
            "title": item.title,
            "description": item.description,
            "confidence": item.confidence,
            "source_hint": item.source_hint,
        })

    await memory.save_conversation(
        session_id=session_id,
        conversation_id=conversation_id,
        user_message=user_message,
        domains=active_domains,
        urgency=triage_result.urgency.value,
        problem=problem.model_dump(),
        agent_outputs=[o.model_dump() for o in domain_outputs],
        action_plan=plan.model_dump(),
    )
    await memory.save_action_items(session_id, conversation_id, plan)

    yield _event("session:complete", {
        "conversation_id": conversation_id,
        "headline": plan.headline,
        "item_count": len(plan.items),
        "escalations": plan.escalations,
        "conflicts_resolved": len(plan.conflicts_resolved),
    })
