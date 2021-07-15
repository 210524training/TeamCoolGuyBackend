import Store from '@libs/models/store';
import { Pool } from 'pg';
import connectionString from './connection';

export type DBStore = {
  store_owner:string,
  store_name:string,
  featured_card_id: number|null
}

export class DAOStore {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString,
      min: 5,
      max: 20,
    });
  }

  public async getAllStores():Promise<Store[]> {
    const client = await this.pool.connect();

    try {
      const res = await client.query<DBStore>('SELECT * from getStores()');
      const rows = res.rows as DBStore[];
      if(res.rows.length > 0) {
        return rows.map<Store>((dbStore) => ({
          storeName: dbStore.store_name,
          storeOwner: dbStore.store_owner,
          featuredCardId: dbStore.featured_card_id,
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

  public async searchStores(searchStr:string):Promise<Store[]> {
    const client = await this.pool.connect();

    try {
      const res = await client.query<DBStore>('SELECT * FROM searchStores($1)', [searchStr]);
      const rows = res.rows as DBStore[];
      if(res.rows.length > 0) {
        return rows.map<Store>((dbStore) => ({
          storeName: dbStore.store_name,
          storeOwner: dbStore.store_owner,
          featuredCardId: dbStore.featured_card_id,
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

  public async getUserStores(username:string):Promise<Store[]> {
    const client = await this.pool.connect();

    try {
      const res = await client.query<DBStore>('SELECT * from getUserStores($1)', [username]);
      const rows = res.rows as DBStore[];
      if(res.rows.length > 0) {
        return rows.map<Store>((dbStore) => ({
          storeName: dbStore.store_name,
          storeOwner: dbStore.store_owner,
          featuredCardId: dbStore.featured_card_id,
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

  public async setFeatured(storeName: string, featured_card_id:number):Promise<boolean> {
    const client = await this.pool.connect();

    try {
       await client.query<DBStore>('CALL setFeatured($1,$2)', [storeName, featured_card_id]);
      return true;
    } catch(error) {
    // log.error(error);
      return false;
    } finally {
      client.release();
    }
  }

  public async unsetFeatured(storeName: string):Promise<boolean> {
    const client = await this.pool.connect();

    try {
       await client.query<DBStore>('CALL unSetFeatured($1)', [storeName]);
      return true;
    } catch(error) {
    // log.error(error);
      return false;
    } finally {
      client.release();
    }
  }

  public async createStore(storeName: string, storeOwner:string):Promise<boolean> {
    const client = await this.pool.connect();

    try {
       await client.query<DBStore>('CALL createStore($1,$2)', [storeOwner, storeName]);
      return true;
    } catch(error) {
    // log.error(error);
      return false;
    } finally {
      client.release();
    }
  }
}

const DAO_Store = new DAOStore();

export default DAO_Store;