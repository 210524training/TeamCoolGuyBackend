import Card from '@libs/models/card';
import Offer from '@libs/models/offer';
import { Pool, QueryResult } from 'pg';
import connectionString from './connection';


export type newOfferId=
{ offer_id:number };
export type DBOffer = {
  id: number,
  requestor: string,
  decider: string,
  status: 'accepted'|'rejected'|'pending'
}
export type DBOfferItem = {
  id: number,
  card_id: number,
  card_num_owned: number,
  card_owner: string,
  card_identifier: string,
  game: string,
  card_condition: string,
  offer_side: 'requestor'| 'decider',
}

export class DAOOffer {
    private pool: Pool;

    constructor() {
      this.pool = new Pool({
        connectionString,
        min: 5,
        max: 20,
      });
    }

    public async getUserRequests(username:string):Promise<Offer[]> {
      const client = await this.pool.connect();

      try {
        const res = await client.query<DBOffer>('SELECT * FROM getUserRequests($1)', [username]);
        const rows = res.rows as DBOffer[];
        let offerItemRes:QueryResult<DBOfferItem>;
        let offerItemRows: DBOfferItem[];
        const offers:Offer[] = [];
        if(res.rows.length > 0) {
          // eslint-disable-next-line no-restricted-syntax
          for(let offer of rows) {
            offerItemRes = await client.query<DBOfferItem>('SELECT * FROM getOfferDetails($1)', [offer.id]);
            offerItemRows = offerItemRes.rows;
            const requestorCards: Card[] = [];
            const deciderCards: Card[] = [];
            offerItemRows.forEach((offerItem) => {
              const item: Card = {
                id: offerItem.card_id,
                card_owner: offerItem.card_owner,
                card_identifier: offerItem.card_identifier,
                game: offerItem.game,
                condition: offerItem.card_condition,
                num_owned: offerItem.card_num_owned,
              };
              if(offerItem.offer_side === 'requestor') {
                requestorCards.push(item);
              } else {
                deciderCards.push(item);
              }
            });
            offers.push({
              id: offer.id,
              requestor: offer.requestor,
              decider: offer.decider,
              status: offer.status,
              requestorCards,
              deciderCards,
            });
          }
        }
        return offers;
      } catch(error) {
      // log.error(error);
        throw error;
      } finally {
        client.release();
      }
    }

    public async getUserOffers(username:string):Promise<Offer[]> {
      const client = await this.pool.connect();

      try {
        const res = await client.query<DBOffer>('SELECT * FROM getUserOffers($1)', [username]);
        const rows = res.rows as DBOffer[];
        let offerItemRes:QueryResult<DBOfferItem>;
        let offerItemRows: DBOfferItem[];
        const offers:Offer[] = [];
        if(res.rows.length > 0) {
          // eslint-disable-next-line no-restricted-syntax
          for(let offer of rows) {
            offerItemRes = await client.query<DBOfferItem>('SELECT * FROM getOfferDetails($1)', [offer.id]);
            offerItemRows = offerItemRes.rows;
            const requestorCards: Card[] = [];
            const deciderCards: Card[] = [];
            offerItemRows.forEach((offerItem) => {
              const item: Card = {
                id: offerItem.card_id,
                card_owner: offerItem.card_owner,
                card_identifier: offerItem.card_identifier,
                game: offerItem.game,
                condition: offerItem.card_condition,
                num_owned: offerItem.card_num_owned,
              };
              if(offerItem.offer_side === 'requestor') {
                requestorCards.push(item);
              } else {
                deciderCards.push(item);
              }
            });
            offers.push({
              id: offer.id,
              requestor: offer.requestor,
              decider: offer.decider,
              status: offer.status,
              requestorCards,
              deciderCards,
            });
          }
        }
        return offers;
      } catch(error) {
      // log.error(error);
        throw error;
      } finally {
        client.release();
      }
    }

    public async createOffer(requestor:string, decider:string):Promise<number> {
      const client = await this.pool.connect();

      try {
        const res = await client.query<newOfferId>('SELECT * FROM createOffer($1,$2)', [requestor, decider]);
        return res.rows[0].offer_id;
      } catch(error) {
      // log.error(error);
        return 0;
      } finally {
        client.release();
      }
    }

    public async addToOffer(offerID:number, cardID:number, offerSide:'requestor'|'decider'):Promise<boolean> {
      const client = await this.pool.connect();

      try {
        await client.query<DBOffer>('CALL addToOffer($1,$2,$3)', [offerID, cardID, offerSide]);
        return true;
      } catch(error) {
      // log.error(error);
        return false;
      } finally {
        client.release();
      }
    }

    public async removeFromOffer(offerItemID:number):Promise<boolean> {
      const client = await this.pool.connect();

      try {
        await client.query<DBOffer>('CALL removeFromOffer($1)', [offerItemID]);
        return true;
      } catch(error) {
      // log.error(error);
        return false;
      } finally {
        client.release();
      }
    }

    public async alterOfferStatus(offerID:number, status:'accepted'|'rejected'|'pending'):Promise<boolean> {
      const client = await this.pool.connect();

      try {
        await client.query<DBOffer>('CALL alterOfferStatus($1,$2)', [offerID, status]);
        return true;
      } catch(error) {
      // log.error(error);
        return false;
      } finally {
        client.release();
      }
    }
}

const DAO_Offer = new DAOOffer();

export default DAO_Offer;