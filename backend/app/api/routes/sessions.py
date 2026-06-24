from fastapi import APIRouter, HTTPException
from ...db.supabase import get_supabase_sync

router = APIRouter()


@router.get("/sessions/{session_id}")
async def get_session(session_id: str) -> dict:
    db = get_supabase_sync()
    result = db.table("compass_sessions").select("*").eq("id", session_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Session not found")
    return result.data[0]


@router.get("/sessions/{session_id}/conversations")
async def get_conversations(session_id: str) -> list:
    db = get_supabase_sync()
    result = (
        db.table("conversations")
        .select("id, created_at, user_message, domains, urgency")
        .eq("session_id", session_id)
        .order("created_at", desc=True)
        .limit(20)
        .execute()
    )
    return result.data
