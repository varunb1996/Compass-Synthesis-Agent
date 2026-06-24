# ── Stage 1: Build Next.js static export ─────────────────────────
FROM node:20-alpine AS frontend-builder

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /frontend
COPY frontend/package.json frontend/pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

COPY frontend/ ./

# Build-time public env vars
ARG NEXT_PUBLIC_API_URL=/
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN pnpm build
# output: "export" writes to /frontend/out

# ── Stage 2: Python backend + static files ───────────────────────
FROM python:3.12-slim

WORKDIR /app

RUN pip install uv --no-cache-dir

COPY backend/pyproject.toml ./
RUN uv sync --no-dev

COPY backend/app/ app/

# Copy the Next.js static export into the location main.py expects
COPY --from=frontend-builder /frontend/out ./frontend_dist

EXPOSE 8000

CMD ["uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
