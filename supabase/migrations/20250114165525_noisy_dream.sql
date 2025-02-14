/*
  # Add Monster Pairings to Cards

  1. New Columns
    - `monster_name` (text): Name of the associated monster
    - `monster_description` (text): Description of the monster pairing

  2. Security
    - Maintains existing RLS policies
    - No data loss or destructive changes
*/

-- Add monster pairing columns if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'cards' AND column_name = 'monster_name'
  ) THEN
    ALTER TABLE cards ADD COLUMN monster_name TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'cards' AND column_name = 'monster_description'
  ) THEN
    ALTER TABLE cards ADD COLUMN monster_description TEXT;
  END IF;
END $$;

-- Update Major Arcana cards with monster pairings
UPDATE cards SET
  monster_name = 'Shiva the Pit Bull',
  monster_description = 'The overly friendly pit bull in a pink harness'
WHERE name = 'The Fool';

UPDATE cards SET
  monster_name = 'The Sphinx',
  monster_description = 'Mistress of riddles and intellectual condescension'
WHERE name = 'The Magician';

UPDATE cards SET
  monster_name = 'Medusa',
  monster_description = 'With a "mirror of the soul" gaze that petrifies you with your own flaws'
WHERE name = 'The High Priestess';

UPDATE cards SET
  monster_name = 'Echidna',
  monster_description = 'Proud parent to a brood of horrors'
WHERE name = 'The Empress';

UPDATE cards SET
  monster_name = 'The Minotaur',
  monster_description = 'Sulking in his labyrinth with passive-aggressive signage'
WHERE name = 'The Emperor';

UPDATE cards SET
  monster_name = 'The Hydra',
  monster_description = 'Spawning two new complaints for every single solution'
WHERE name = 'The Hierophant';

UPDATE cards SET
  monster_name = 'The Sirens',
  monster_description = 'Arms crossed, giving silent treatment to passing ships'
WHERE name = 'The Lovers';

UPDATE cards SET
  monster_name = 'Pegasus',
  monster_description = 'The majestic steed who''s absolutely done with your nonsense'
WHERE name = 'The Chariot';

UPDATE cards SET
  monster_name = 'The Nemean Lion',
  monster_description = 'Boasting invulnerable fur'
WHERE name = 'Strength';

UPDATE cards SET
  monster_name = 'The Cyclops',
  monster_description = 'Forging in lonely caves, rolling that one eye in sullen introspection'
WHERE name = 'The Hermit';

UPDATE cards SET
  monster_name = 'Scylla & Charybdis',
  monster_description = 'Punishing sailors from opposite sides'
WHERE name = 'Wheel of Fortune';

UPDATE cards SET
  monster_name = 'The Petties',
  monster_description = 'Reading your sins in bored monotones'
WHERE name = 'Justice';

UPDATE cards SET
  monster_name = 'A Suspended Satyr',
  monster_description = 'A hapless Satyr caught in vines, dangling upside down'
WHERE name = 'The Hanged Man';

UPDATE cards SET
  monster_name = 'Cerberus',
  monster_description = 'Guardian of the Underworld, triple-headed and triple-sarcastic'
WHERE name = 'Death';

UPDATE cards SET
  monster_name = 'The Harpies',
  monster_description = 'Balancing two bowls of...who-knows-what'
WHERE name = 'Temperance';

UPDATE cards SET
  monster_name = 'Eris',
  monster_description = 'Goddess of Discord, brandishing illusions and petty sabotage'
WHERE name = 'The Devil';

UPDATE cards SET
  monster_name = 'The Kraken',
  monster_description = 'Emerging to topple your carefully built illusions'
WHERE name = 'The Tower';

UPDATE cards SET
  monster_name = 'Stymphalian Birds',
  monster_description = 'Metallic feathers glinting under night sky'
WHERE name = 'The Star';

UPDATE cards SET
  monster_name = 'The Chimera',
  monster_description = 'Part lion, goat, serpent—one big confusing night terror'
WHERE name = 'The Moon';

UPDATE cards SET
  monster_name = 'Argus',
  monster_description = 'The hundred-eyed giant'
WHERE name = 'The Sun';

UPDATE cards SET
  monster_name = 'Underworld Judges',
  monster_description = 'The trio of Underworld Judges who pass snarky verdicts on souls'
WHERE name = 'Judgement';

UPDATE cards SET
  monster_name = 'The Monstrous Pantheon',
  monster_description = 'A grand convergence of all these sarcastic beasts in a triumphant circle'
WHERE name = 'The World';