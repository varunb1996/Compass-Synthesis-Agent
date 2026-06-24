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
| Deployment | Vercel (frontend) + Render (backend) |

## Setup

### Prerequisites
- Python 3.12+
- Node.js 20+
- [uv](https://docs.astral.sh/uv/) (Python package manager)
- [pnpm](https://pnpm.io/) (Node package manager)
- Groq API key (free at [console.groq.com](https://console.groq.com))
- Supabase project (free at [supabase.com](https://supabase.com))

### Backend

```bash
cd backend
cp .env.example .env        # fill in your API keys
uv sync
uv run uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
cp .env.example .env.local  # fill in your Supabase URL/key
pnpm install
pnpm dev
```

### Database

Run `backend/app/db/schema.sql` in your Supabase SQL editor.

## Development

```
compass/
├── backend/   FastAPI + agents + Supabase
└── frontend/  Next.js 15 + Tailwind + shadcn/ui
```
