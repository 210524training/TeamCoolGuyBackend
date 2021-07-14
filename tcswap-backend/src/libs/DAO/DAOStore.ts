import { Pool } from 'pg';
import connectionString from './connection';

export class DAOStore {
    private pool: Pool;
  
    constructor() {
      this.pool = new Pool({
        connectionString,
        min: 5,
        max: 20,
      });
    }
}

const DAO_Store = new DAOStore();

export default DAO_Store;