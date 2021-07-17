import IMessage from '@libs/models/imessage';
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


    public async getMessage():Promise<IMessage[]> {
      const client = await this.pool.connect();

      try {
        const res = await client.query<Message>('SELECT * FROM getMessages()');
        const rows = res.rows;
        if(res.rows.length > 0) {
          const formatRows: IMessage[] = rows.map((row: Message) => {
              return {
                _id: row.id,
                text: row.text,
                createdAt: row.created_at,
                user: { 
                  _id: row.created_by,
                  name: row.created_by
                }
              }
            });
          return formatRows as IMessage[];
        }
        return [] as IMessage[];
      } catch(error) {
      // log.error(error);
        throw error;
      } finally {
        client.release();
      }
    }

    public async addMessage(
      id: string,
      text: string,
      created_at: string,
      created_by: string,
  ):Promise<boolean> {
    const client = await this.pool.connect();

    try {
      await client.query('CALL addMessage($1,$2,$3,$4)', [id, text ,created_at, created_by]);
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