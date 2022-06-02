
import * as dotenv from 'dotenv'
import { Pool, Client } from 'pg';

export class DataBaseService {
    public static instance: DataBaseService;
    private pool;

    constructor(user:string, host: string, database: string, password:string, port: number) {
        try {
            
            const pool = new Pool({
                user: user,
                host: host,
                database: database,
                password: password,
                port: port
            });
            this.pool = pool
            // the pool will emit an error on behalf of any idle clients
            // it contains if a backend error or network partition happens
            pool.on('error', (err, client) => {
                console.error('Unexpected error on idle client', err)
                process.exit(-1)
            });

        } catch (error) {
            console.log('An error occurred while the connection was created ' + error + ` ${DataBaseService.name} -> constructor`);
        }
    }


}
