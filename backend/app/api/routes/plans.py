from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ...db.supabase import get_supabase_sync

router = APIRouter()


class ToggleItem(BaseModel):
    completed: bool


@router.get("/plans/{conversation_id}/items")
async def get_plan_items(conversation_id: str) -> list:
    db = get_supabase_sync()
    result = (
        db.table("action_items")
        .select("*")
        .eq("conversation_id", conversation_id)
        .order("created_at")
        .execute()
    )
    return result.data


@router.patch("/plans/items/{item_id}")
async def toggle_item(item_id: str, body: ToggleItem) -> dict:
    db = get_supabase_sync()
    result = (
        db.table("action_items")
        .update({"completed": body.completed})
        .eq("id", item_id)
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Item not found")
    return result.data[0]
