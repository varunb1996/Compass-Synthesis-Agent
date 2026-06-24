# Compass

> Your compound problems, solved together.

Compass is a multi-agent AI system for everyday humans. Describe any complex life situation — job loss, health diagnosis, housing crisis — and Compass decomposes it across specialized agents (Health, Finance, Legal, Career, Home, Government, Family) running in parallel, then synthesizes a single prioritized action plan.

## Architecture

```
User Message → IntakeAgent → TriageAgent → 7 Domain Agents (parallel)
             → ConflictAgent → SynthesisAgent → ActionPlan
```

## Stack

| Layer | Technology |
|---|---|
| AI | Groq API (llama-3.1-8b-instant) — free tier |
| Backend | FastAPI + Python 3.12 |
| Database | Supabase free tier (PostgreSQL) |
| Frontend | Next.js 15 + React 19 + Tailwind v4 + shadcn/ui + Framer Motion |
| Deployment | Render (single Docker container — backend serves frontend) |

## Local Setup

### Prerequisites
- Python 3.12+
- Node.js 20+
- [uv](https://docs.astral.sh/uv/) (Python package manager)
- [pnpm](https://pnpm.io/) (Node package manager)
- Groq API key (free at [console.groq.com](https://console.groq.com))
- Supabase project (free at [supabase.com](https://supabase.com))

### Database

Run `backend/app/db/schema.sql` in your Supabase SQL editor. This creates three tables: `compass_sessions`, `conversations`, and `action_items`.

### Backend

```bash
cd backend
cp .env.example .env   # fill in your keys
uv sync
uv run uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

Frontend runs at `http://localhost:3000`, backend at `http://localhost:8000`.

## Deployment (Render)

The root `Dockerfile` builds the Next.js frontend as a static export and embeds it inside the FastAPI backend. One service, one URL.

1. Push to GitHub
2. Create a new **Web Service** on [render.com](https://render.com)
3. Connect your repo — root directory: `.`, runtime: Docker
4. Add these environment variables:

| Key | Description |
|-----|-------------|
| `GROQ_API_KEY` | From [console.groq.com](https://console.groq.com) |
| `SUPABASE_URL` | Your Supabase project URL (`https://xxxx.supabase.co`) |
| `SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
| `ENVIRONMENT` | `production` |

5. Deploy — your app will be live at the Render URL.

   https://compass-synthesis-agent.onrender.com/

## Project Structure

```
compass/
├── Dockerfile           # single container: builds frontend + runs backend
├── render.yaml          # Render deployment config
├── backend/
│   ├── app/
│   │   ├── agents/      # IntakeAgent, TriageAgent, 7 domain agents, ConflictAgent, SynthesisAgent
│   │   ├── api/         # FastAPI routes (SSE streaming, sessions, plans)
│   │   ├── db/          # Supabase client + schema.sql
│   │   ├── models/      # Pydantic v2 models
│   │   └── services/    # Orchestrator, memory, Groq client
│   └── requirements.txt
└── frontend/
    └── src/
        ├── app/         # Next.js App Router pages
        ├── components/  # Chat, AgentPanel, ActionPlan
        ├── hooks/       # useCompass (SSE stream handler)
        └── store/       # Zustand state
```
