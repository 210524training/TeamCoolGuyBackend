import User from '@libs/models/user';
import { Pool } from 'pg';
import connectionString from './connection';

export type DBUser = {
  username: string,
	pass?: string,
	first_name: string,
	last_name: string,
	role: 'player'|'store owner'
}

export class DAOUser {
    private pool: Pool;

    constructor() {
      this.pool = new Pool({
        connectionString,
        min: 5,
        max: 20,
      });
    }

    public async verifyLogin(username: string, password: string):Promise<User| null> {
      const client = await this.pool.connect();

      try {
        const res = await client.query<DBUser>('SELECT * FROM verifyLogin($1, $2)', [username, password]);
        const dbUser = res.rows[0];
        if(res.rows.length > 0) {
          return {
            username: dbUser.username,
            password: dbUser.pass ? dbUser.pass : '',
            firstname: dbUser.first_name,
            lastname: dbUser.last_name,
            role: dbUser.role,
          };
        }
        return null;
      } catch(error) {
      // log.error(error);
        throw error;
      } finally {
        client.release();
      }
    }

    public async getAllUsers():Promise<User[]> {
      const client = await this.pool.connect();

      try {
        const res = await client.query<DBUser>('SELECT * FROM searchUsers($1)', ['']);
        const rows = res.rows as DBUser[];
        if(res.rows.length > 0) {
          return rows.map<User>((dbUser:DBUser) => ({
            username: dbUser.username,
            password: dbUser.pass ? dbUser.pass : '',
            firstname: dbUser.first_name,
            lastname: dbUser.last_name,
            role: dbUser.role,
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

    public async searchUsers(searchStr: string):Promise<User[]> {
      const client = await this.pool.connect();

      try {
        const res = await client.query<DBUser>('SELECT * FROM searchUsers($1)', [searchStr]);
        const rows = res.rows as DBUser[];
        if(res.rows.length > 0) {
          return rows.map<User>((dbUser:DBUser) => ({
            username: dbUser.username,
            password: dbUser.pass ? dbUser.pass : '',
            firstname: dbUser.first_name,
            lastname: dbUser.last_name,
            role: dbUser.role,
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

    public async registerUser(user: User):Promise<boolean> {
      const client = await this.pool.connect();

      try {
        if(user.role === 'player') {
          await client.query('CALL registerPlayer($1,$2,$3,$4)', [user.username, user.password, user.firstname, user.lastname]);
        } else {
          await client.query('CALL registerStoreOwner($1,$2,$3,$4)', [user.username, user.password, user.firstname, user.lastname]);
        }
        return true;
      } catch(error) {
      // log.error(error);
        return false;
      } finally {
        client.release();
      }
    }
}

const DAO_User = new DAOUser();

export default DAO_User;