import { Pool } from 'pg';
import connectionString from './connection';

export class DAOCard {
    private pool: Pool;
  
    constructor() {
      this.pool = new Pool({
        connectionString,
        min: 5,
        max: 20,
      });
    }
}

const DAO_Card = new DAOCard();

export default DAO_Card;