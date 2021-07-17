import Message from '@libs/models/message';
import { Pool } from 'pg';
import connectionString from './connection';


export class DAOMessage {
    private pool: Pool;

    constructor() {
      this.pool = new Pool({
        connectionString,
        min: 5,
        max: 20,
      });
    }


    public async getMessage():Promise<Message[]> {
      const client = await this.pool.connect();

      try {
        const res = await client.query<Message>('SELECT * FROM getMessages()');
        const rows = res.rows as Message[];
        if(res.rows.length > 0) {
          return rows as Message[];
        }
        return []as Message[];
      } catch(error) {
      // log.error(error);
        throw error;
      } finally {
        client.release();
      }
    }

    public async addMessage(
        text: string,
        created_at: string,
        created_by: string,
    ):Promise<boolean> {
      const client = await this.pool.connect();

      try {
        await client.query('CALL addMessage($1,$2,$3)', [text ,created_at, created_by]);
        return true;
      } catch(error) {
      // log.error(error);
        return false;
      } finally {
        client.release();
      }
    }

    
}

const DAO_Message = new DAOMessage();

export default DAO_Message;