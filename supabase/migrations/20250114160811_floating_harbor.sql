/*
  # Add passive-aggressive card meanings

  1. Changes
    - Update Major Arcana cards with passive-aggressive descriptions
    - Add reversed meanings that are particularly snarky

  2. Security
    - No changes to existing RLS policies needed
*/

-- Update Major Arcana cards with passive-aggressive meanings
UPDATE cards SET
  description = 'Oh look, another "free spirit" who thinks they can just wing it through life without a plan. How''s that working out for you?',
  reversed_description = 'Finally realizing that actions have consequences? Welcome to adulthood.'
WHERE name = 'The Fool';

UPDATE cards SET
  description = 'Compensating for something with all that power? Maybe try therapy instead of world domination.',
  reversed_description = 'Turns out you''re not as clever as you think you are. Shocking, I know.'
WHERE name = 'The Magician';

UPDATE cards SET
  description = 'Yes, yes, you''re very intuitive. Have you considered actually doing something with those insights?',
  reversed_description = 'Ignoring your inner voice? That''s going well, clearly.'
WHERE name = 'The High Priestess';

UPDATE cards SET
  description = 'Must be nice to have everything so perfectly balanced. Some of us live in the real world.',
  reversed_description = 'Your life''s about as balanced as a one-legged flamingo in a windstorm.'
WHERE name = 'The Empress';

UPDATE cards SET
  description = 'Another authority figure telling everyone what to do. How original.',
  reversed_description = 'Lost control of the situation? I''m sure micromanaging will fix everything.'
WHERE name = 'The Emperor';

UPDATE cards SET
  description = 'Oh great, more unsolicited spiritual advice. Just what everyone needed.',
  reversed_description = 'Breaking traditions isn''t always rebellion. Sometimes it''s just poor judgment.'
WHERE name = 'The Hierophant';

UPDATE cards SET
  description = 'Love is in the air. Along with poor decision-making and unrealistic expectations.',
  reversed_description = 'Relationship problems? Have you tried not being yourself?'
WHERE name = 'The Lovers';

UPDATE cards SET
  description = 'Charging forward without looking? Bold strategy. Let''s see how that works out.',
  reversed_description = 'Maybe the universe is trying to tell you something. Just a thought.'
WHERE name = 'The Chariot';

UPDATE cards SET
  description = 'Yes, you''re very strong. We''re all very impressed. Now try using your words.',
  reversed_description = 'Having trouble controlling your inner beast? How inconvenient for everyone else.'
WHERE name = 'Strength';

UPDATE cards SET
  description = 'Time for introspection. Try not to get lost in there, though your ego might need its own zip code.',
  reversed_description = 'Avoiding self-reflection? Can''t imagine why.'
WHERE name = 'The Hermit';

UPDATE cards SET
  description = 'Life''s ups and downs. Mostly downs in your case, but who''s counting?',
  reversed_description = 'Bad luck? Or just poor life choices? The cards suggest both.'
WHERE name = 'Wheel of Fortune';

UPDATE cards SET
  description = 'Justice is blind, but she can still sense your BS from a mile away.',
  reversed_description = 'Karma''s only unfair when it''s happening to you, right?'
WHERE name = 'Justice';

UPDATE cards SET
  description = 'Sometimes you need to let go. Like, right now. Seriously, let it go.',
  reversed_description = 'Stuck in limbo? Maybe it''s not the universe - maybe it''s you.'
WHERE name = 'The Hanged Man';

UPDATE cards SET
  description = 'Change is coming. Probably not the kind you want, but beggars can''t be choosers.',
  reversed_description = 'Resisting the inevitable? That''s going well.'
WHERE name = 'Death';

UPDATE cards SET
  description = 'Finding balance? More like finding excuses.',
  reversed_description = 'Moderation isn''t your strong suit, is it?'
WHERE name = 'Temperance';

UPDATE cards SET
  description = 'Ah yes, the Devil card. Finally, some honesty about your "self-care" habits.',
  reversed_description = 'Breaking free from chains you put on yourself. Slow clap.'
WHERE name = 'The Devil';

UPDATE cards SET
  description = 'Sudden change incoming. Maybe this time you''ll actually learn from it.',
  reversed_description = 'Avoiding necessary destruction? How''s that working out?'
WHERE name = 'The Tower';

UPDATE cards SET
  description = 'Hope springs eternal. So do delusions.',
  reversed_description = 'Lost your optimism? Join the club.'
WHERE name = 'The Star';

UPDATE cards SET
  description = 'Living in a fantasy world must be nice. Send a postcard.',
  reversed_description = 'Reality check incoming. Might want to sit down for this one.'
WHERE name = 'The Moon';

UPDATE cards SET
  description = 'Success and vitality ahead. Try not to mess it up this time.',
  reversed_description = 'Feeling a bit dim lately? There might be a reason for that.'
WHERE name = 'The Sun';

UPDATE cards SET
  description = 'Time for a wake-up call. Whether you answer is another matter.',
  reversed_description = 'Ignoring the obvious? Bold choice.'
WHERE name = 'Judgement';

UPDATE cards SET
  description = 'Achievement unlocked: basic competence. Congratulations?',
  reversed_description = 'The world isn''t against you. It''s just disappointed.'
WHERE name = 'The World';