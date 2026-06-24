import logging
from contextlib import asynccontextmanager
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from .config import settings
from .api.routes import compass, sessions, plans

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Compass backend starting — env: %s", settings.environment)
    yield
    logger.info("Compass backend shutting down")


app = FastAPI(
    title="Compass API",
    description="Multi-agent compound problem solver",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(compass.router, prefix="/api")
app.include_router(sessions.router, prefix="/api")
app.include_router(plans.router, prefix="/api")


@app.get("/health")
async def health() -> dict:
    return {"status": "ok", "model": settings.groq_model}


# Serve Next.js static export — must be last
_STATIC = Path(__file__).parent.parent / "frontend_dist"
if _STATIC.exists():
    app.mount("/_next", StaticFiles(directory=str(_STATIC / "_next")), name="next-assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        # Try exact file match first (e.g. /chat/index.html)
        candidate = _STATIC / full_path
        if candidate.is_file():
            return FileResponse(str(candidate))
        # Try as directory with index.html
        index = candidate / "index.html"
        if index.is_file():
            return FileResponse(str(index))
        # Fallback to root index.html (SPA routing)
        return FileResponse(str(_STATIC / "index.html"))
