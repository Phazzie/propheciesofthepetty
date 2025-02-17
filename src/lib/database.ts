import { supabase } from './supabase';
import type { Card } from '../types';
import { DatabaseError } from './errors';
import { logger } from './logger';

export const cardOperations = {
  async getCards(): Promise<Card[]> {
    logger.debug('Fetching all cards');
    let retryCount = 0;
    const maxRetries = 3;

    while (retryCount < maxRetries) {
      try {
        const { data, error } = await supabase
          .from('cards')
          .select('*')
          .order('name');

        if (error) {
          logger.error('Failed to fetch cards', error);
          throw new DatabaseError('Failed to fetch cards', { error });
        }

        logger.debug('Successfully fetched cards', { count: data.length });
        return data.map(card => ({
          id: card.id,
          name: card.name,
          description: card.description,
          reversedDescription: card.reversed_description,
          imageUrl: card.image_url,
          type: card.type,
          monsterPair: card.monster_name ? {
            name: card.monster_name,
            description: card.monster_description || ''
          } : undefined
        }));
      } catch (err) {
        retryCount++;
        if (retryCount === maxRetries) {
          logger.error('Max retries reached for fetching cards', err instanceof Error ? err : new Error(String(err)));
          throw err;
        }
        logger.warn(`Retry attempt ${retryCount} for fetching cards`, err instanceof Error ? err : new Error(String(err)));
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
      }
    }
    throw new DatabaseError('Failed to fetch cards after retries');
  },

  async saveReading(
    userId: string,
    spreadType: string,
    interpretation: string,
    cards: { cardId: string; position: number; isReversed: boolean }[]
  ): Promise<string> {
    logger.debug('Saving new reading', { userId, spreadType });
    const { data: reading, error: readingError } = await supabase
      .from('readings')
      .insert({
        user_id: userId,
        spread_type: spreadType,
        interpretation
      })
      .select()
      .single();

    if (readingError) {
      logger.error('Failed to save reading', readingError);
      throw new DatabaseError('Failed to save reading', { error: readingError });
    }

    const readingCards = cards.map(card => ({
      reading_id: reading.id,
      card_id: card.cardId,
      position: card.position,
      is_reversed: card.isReversed
    }));

    const { error: cardsError } = await supabase
      .from('reading_cards')
      .insert(readingCards);

    if (cardsError) {
      logger.error('Failed to save reading cards', cardsError);
      throw new DatabaseError('Failed to save reading cards', { error: cardsError });
    }

    logger.info('Successfully saved reading', { readingId: reading.id });
    return reading.id;
  },
};

export const readingOperations = {
  async getUserReadings(userId: string) {
    logger.debug('Fetching readings for user', { userId });
    const { data, error } = await supabase
      .from('readings')
      .select(`
        *,
        reading_cards (
          card_id,
          position,
          is_reversed,
          cards (*)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Failed to fetch user readings', error);
      throw new DatabaseError('Failed to fetch readings', { error });
    }

    return data;
  },

  async getReading(readingId: string) {
    logger.debug('Fetching reading', { readingId });
    const { data, error } = await supabase
      .from('readings')
      .select(`
        *,
        reading_cards (
          card_id,
          position,
          is_reversed,
          cards (*)
        )
      `)
      .eq('id', readingId)
      .single();

    if (error) {
      logger.error('Failed to fetch reading', error);
      throw new DatabaseError('Failed to fetch reading', { error });
    }

    return data;
  }
};