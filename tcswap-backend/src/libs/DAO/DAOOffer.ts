import { Pool } from 'pg';
import connectionString from './connection';

export class DAOOffer {
    private pool: Pool;
  
    constructor() {
      this.pool = new Pool({
        connectionString,
        min: 5,
        max: 20,
      });
    }
}

const DAO_Offer = new DAOOffer();

export default DAO_Offer;