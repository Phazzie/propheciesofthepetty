/*
  # Initial Schema Setup for Passive-Aggressive Tarot

  1. New Tables
    - `users`: User accounts and subscription info
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `subscription_type` (text)
      - `created_at` (timestamptz)
      - `last_reading_at` (timestamptz)
    
    - `readings`: Tarot reading records
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `spread_type` (text)
      - `interpretation` (text)
      - `created_at` (timestamptz)
    
    - `cards`: Tarot card definitions
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `image_url` (text)
      - `type` (text: major/minor)
      - `created_at` (timestamptz)
    
    - `reading_cards`: Cards used in readings
      - `id` (uuid, primary key)
      - `reading_id` (uuid, references readings)
      - `card_id` (uuid, references cards)
      - `position` (integer)
      - `is_reversed` (boolean)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Protect user data privacy
*/

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  subscription_type TEXT NOT NULL DEFAULT 'free',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_reading_at TIMESTAMPTZ
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Readings table
CREATE TABLE readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  spread_type TEXT NOT NULL,
  interpretation TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE readings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own readings"
  ON readings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own readings"
  ON readings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Cards table
CREATE TABLE cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('major', 'minor')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read cards"
  ON cards
  FOR SELECT
  TO authenticated
  USING (true);

-- Reading cards table
CREATE TABLE reading_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reading_id UUID NOT NULL REFERENCES readings(id),
  card_id UUID NOT NULL REFERENCES cards(id),
  position INTEGER NOT NULL,
  is_reversed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE reading_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own reading cards"
  ON reading_cards
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM readings
      WHERE readings.id = reading_cards.reading_id
      AND readings.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create own reading cards"
  ON reading_cards
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM readings
      WHERE readings.id = reading_cards.reading_id
      AND readings.user_id = auth.uid()
    )
  );