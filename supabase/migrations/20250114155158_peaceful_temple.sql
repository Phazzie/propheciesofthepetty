/*
  # Add reversed meanings to cards table

  1. Changes
    - Add `reversed_description` column to `cards` table
    - Add sample reversed meanings for Major Arcana cards

  2. Security
    - No changes to existing RLS policies needed
*/

-- Add reversed_description column
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'cards' AND column_name = 'reversed_description'
  ) THEN
    ALTER TABLE cards ADD COLUMN reversed_description TEXT;
  END IF;
END $$;