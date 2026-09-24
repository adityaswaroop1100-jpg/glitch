-- ═══════════════════════════════════════════════════════════════
-- GLITCH MATRIX — SUPABASE PARTICIPANTS TABLE SCHEMA
-- Run this in your Supabase SQL Editor: Dashboard > SQL Editor > New query
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  reg_number TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  score INT DEFAULT 0,
  modules_cleared INT DEFAULT 0,
  time_left INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;

-- Allow anonymous participant registration from game frontend
CREATE POLICY "Allow anonymous insert" ON participants
  FOR INSERT WITH CHECK (true);

-- Allow participants to read leaderboard or their own entries
CREATE POLICY "Allow public read" ON participants
  FOR SELECT USING (true);

-- Allow score telemetry updates
CREATE POLICY "Allow public update" ON participants
  FOR UPDATE USING (true);

-- Helpful Index for search and rankings
CREATE INDEX IF NOT EXISTS idx_participants_reg_number ON participants(reg_number);
CREATE INDEX IF NOT EXISTS idx_participants_score ON participants(score DESC);
