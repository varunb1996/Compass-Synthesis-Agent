-- Run this in your Supabase SQL editor
-- Drop old tables if they exist from previous run
DROP TABLE IF EXISTS action_items CASCADE;
DROP TABLE IF EXISTS conversations CASCADE;
DROP TABLE IF EXISTS compass_sessions CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;

CREATE TABLE compass_sessions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_active  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  life_context JSONB NOT NULL DEFAULT '{}'
);

CREATE TABLE conversations (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id    UUID NOT NULL REFERENCES compass_sessions(id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_message  TEXT NOT NULL,
  domains       TEXT[] NOT NULL DEFAULT '{}',
  urgency       TEXT,
  problem       JSONB,
  agent_outputs JSONB,
  action_plan   JSONB
);

CREATE TABLE action_items (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id  UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  session_id       UUID NOT NULL REFERENCES compass_sessions(id) ON DELETE CASCADE,
  domain           TEXT NOT NULL,
  priority         TEXT NOT NULL,
  title            TEXT NOT NULL,
  description      TEXT,
  confidence       FLOAT,
  source_hint      TEXT,
  completed        BOOLEAN NOT NULL DEFAULT FALSE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_conversations_session ON conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_action_items_session ON action_items(session_id);
CREATE INDEX IF NOT EXISTS idx_action_items_conversation ON action_items(conversation_id);

ALTER TABLE compass_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE action_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_all_compass_sessions" ON compass_sessions FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_conversations" ON conversations FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_action_items" ON action_items FOR ALL TO anon USING (true) WITH CHECK (true);
