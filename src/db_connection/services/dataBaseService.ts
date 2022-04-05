
import * as dotenv from 'dotenv'
import { Pool, Client } from 'pg';

export class DataBaseService {
    public static instance: DataBaseService;
    private connection;
    private pool;

    private constructor() {
        try {

            dotenv.config();

            const pool = new Pool({
                user: process.env.DBUSER,
                host: process.env.HOST,
                database: process.env.DATABASE,
                password: process.env.PASSWORD,
                port: 5432
            });

            this.pool = pool;

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

    static getInstance() {
        try {
            if (!DataBaseService.instance) {
                DataBaseService.instance = new DataBaseService();
            }
            return DataBaseService.instance;
        } catch (error) {
            console.log('An error occurred while the instance was returned ' + error + ` ${DataBaseService.name} -> ${this.getInstance.name}`);
        }
    }

    public async query(sql, args) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, args, (err, rows) => {
                if (err)
                    return reject(err);
                resolve(rows);
            });
        });
    }


}
