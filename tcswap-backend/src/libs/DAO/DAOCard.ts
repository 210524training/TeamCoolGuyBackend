import Card from '@libs/models/card';
import { Pool } from 'pg';
import connectionString from './connection';


export type DBCard = {
  card_id: number,
  card_owner: string,
  card_identifier: string,
  game: string,
  card_condition: string,
  num_owned: number,
  role?: 'player'|'store owner',
}

export class DAOCard {
    private pool: Pool;

    constructor() {
      this.pool = new Pool({
        connectionString,
        min: 5,
        max: 20,
      });
    }

    public async searchCards(searchStr:string):Promise<Card[]> {
      const client = await this.pool.connect();

      try {
        const res = await client.query<DBCard>('SELECT * FROM searchCards($1)', [searchStr]);
        const rows = res.rows as DBCard[];
        if(res.rows.length > 0) {
          return rows.map<Card>((dbCard) => ({
            id: dbCard.card_id,
            card_owner: dbCard.card_owner,
            card_identifier: dbCard.card_identifier,
            game: dbCard.game,
            condition: dbCard.card_condition,
            num_owned: dbCard.num_owned,
            role: dbCard.role,
          }));
        }
        return [];
      } catch(error) {
      // log.error(error);
        throw error;
      } finally {
        client.release();
      }
    }

    public async getUserCards(username:string):Promise<Card[]> {
      const client = await this.pool.connect();

      try {
        const res = await client.query<DBCard>('SELECT * from getUserCards($1)', [username]);
        const rows = res.rows as DBCard[];
        if(res.rows.length > 0) {
          return rows.map<Card>((dbCard) => ({
            id: dbCard.card_id,
            card_owner: dbCard.card_owner,
            card_identifier: dbCard.card_identifier,
            game: dbCard.game,
            condition: dbCard.card_condition,
            num_owned: dbCard.num_owned,
          }));
        }
        return [];
      } catch(error) {
      // log.error(error);
        throw error;
      } finally {
        client.release();
      }
    }

    public async addUserCard(
      cardOwner:string,
      cardIdentifier:string,
      game:string,
      condition:string,
    ):Promise<boolean> {
      const client = await this.pool.connect();

      try {
        await client.query('CALL addUserCard($1,$2,$3,$4)', [cardOwner, cardIdentifier, game, condition]);
        return true;
      } catch(error) {
      // log.error(error);
        return false;
      } finally {
        client.release();
      }
    }

    public async removeUserCard(
      cardOwner:string,
      cardIdentifier:string,
      condition:string,
    ):Promise<boolean> {
      const client = await this.pool.connect();

      try {
        await client.query('CALL removeUserCard($1,$2,$3)', [cardOwner, cardIdentifier, condition]);
        return true;
      } catch(error) {
      // log.error(error);
        return false;
      } finally {
        client.release();
      }
    }
}