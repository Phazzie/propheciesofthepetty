import { supabase } from './supabase';
import { logger } from './logger';
import { DatabaseError } from './errors';
import { RecoverySystem } from './recovery';
import type { Card, Reading, CardInReading } from './database.types';

export class Database {
  async getCards(): Promise<Card[]> {
    return RecoverySystem.withRetry(async () => {
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
    }, {
      maxAttempts: 3,
      initialDelay: 1000
    });
  }

  async saveReading(
    userId: string,
    spreadType: string,
    interpretation: string,
    cards: CardInReading[]
  ): Promise<string> {
    return RecoverySystem.withRetry(async () => {
      const { data, error } = await supabase
        .from('readings')
        .insert([{
          user_id: userId,
          spread_type: spreadType,
          interpretation,
          cards
        }])
        .select('id')
        .single();

      if (error) {
        logger.error('Failed to save reading', error);
        throw new DatabaseError('Failed to save reading', { error });
      }

      logger.info('Successfully saved reading', { readingId: data.id });
      return data.id;
    }, {
      maxAttempts: 2,
      initialDelay: 500
    });
  }

  async getReading(readingId: string): Promise<Reading> {
    return RecoverySystem.withRetry(async () => {
      const { data, error } = await supabase
        .from('readings')
        .select(`
          id,
          spread_type,
          interpretation,
          created_at,
          cards (
            card_id,
            position,
            is_reversed
          )
        `)
        .eq('id', readingId)
        .single();

      if (error) {
        logger.error('Failed to fetch reading', error);
        throw new DatabaseError('Failed to fetch reading', { error });
      }

      if (!data) {
        throw new DatabaseError('Reading not found');
      }

      logger.debug('Successfully fetched reading', { readingId });
      return {
        id: data.id,
        spreadType: data.spread_type,
        interpretation: data.interpretation,
        createdAt: new Date(data.created_at),
        cards: data.cards
      };
    }, {
      maxAttempts: 3,
      initialDelay: 1000
    });
  }

  async getUserReadings(userId: string): Promise<Reading[]> {
    return RecoverySystem.withRetry(async () => {
      const { data, error } = await supabase
        .from('readings')
        .select(`
          id,
          spread_type,
          interpretation,
          created_at,
          cards (
            card_id,
            position,
            is_reversed
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        logger.error('Failed to fetch user readings', error);
        throw new DatabaseError('Failed to fetch user readings', { error });
      }

      logger.debug('Successfully fetched user readings', { 
        userId, 
        count: data.length 
      });
      
      return data.map(reading => ({
        id: reading.id,
        spreadType: reading.spread_type,
        interpretation: reading.interpretation,
        createdAt: new Date(reading.created_at),
        cards: reading.cards
      }));
    }, {
      maxAttempts: 3,
      initialDelay: 1000
    });
  }
}