import { Pool } from 'pg';
import connectionString from './connection';

export class DAOUser {
    private pool: Pool;
  
    constructor() {
      this.pool = new Pool({
        connectionString,
        min: 5,
        max: 20,
      });
    }
}

const DAO_User = new DAOUser();

export default DAO_User;