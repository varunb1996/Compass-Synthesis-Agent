import logging
from ..db.supabase import get_supabase_sync
from ..models.plan import ActionPlan

logger = logging.getLogger(__name__)


async def get_or_create_session(session_id: str) -> dict:
    db = get_supabase_sync()
    result = db.table("compass_sessions").select("*").eq("id", session_id).execute()

    if result.data:
        db.table("compass_sessions").update({"last_active": "NOW()"}).eq("id", session_id).execute()
        return result.data[0]

    new_session = db.table("compass_sessions").insert({"id": session_id}).execute()
    return new_session.data[0]


async def get_life_context(session_id: str) -> dict[str, str]:
    db = get_supabase_sync()
    result = db.table("compass_sessions").select("life_context").eq("id", session_id).execute()
    if result.data:
        return result.data[0].get("life_context") or {}
    return {}


async def save_conversation(
    session_id: str,
    conversation_id: str,
    user_message: str,
    domains: list[str],
    urgency: str,
    problem: dict,
    agent_outputs: list[dict],
    action_plan: dict,
) -> None:
    db = get_supabase_sync()
    db.table("conversations").upsert({
        "id": conversation_id,
        "session_id": session_id,
        "user_message": user_message,
        "domains": domains,
        "urgency": urgency,
        "problem": problem,
        "agent_outputs": agent_outputs,
        "action_plan": action_plan,
    }).execute()


async def save_action_items(session_id: str, conversation_id: str, plan: ActionPlan) -> None:
    db = get_supabase_sync()
    rows = [
        {
            "id": item.id,
            "conversation_id": conversation_id,
            "session_id": session_id,
            "domain": item.domain,
            "priority": item.priority,
            "title": item.title,
            "description": item.description,
            "confidence": item.confidence,
            "source_hint": item.source_hint,
            "completed": item.completed,
        }
        for item in plan.items
    ]
    if rows:
        db.table("action_items").upsert(rows).execute()


async def update_life_context(session_id: str, new_facts: dict[str, str]) -> None:
    db = get_supabase_sync()
    existing = await get_life_context(session_id)
    merged = {**existing, **new_facts}
    db.table("compass_sessions").update({"life_context": merged}).eq("id", session_id).execute()
