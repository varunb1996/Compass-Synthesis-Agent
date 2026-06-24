from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from ...services.orchestrator import run_compass

router = APIRouter()


class CompassRequest(BaseModel):
    message: str
    session_id: str


@router.post("/compass")
async def compass_endpoint(body: CompassRequest) -> StreamingResponse:
    return StreamingResponse(
        run_compass(body.message, body.session_id),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )
