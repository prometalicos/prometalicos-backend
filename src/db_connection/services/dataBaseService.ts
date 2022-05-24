
import * as dotenv from 'dotenv'
import { Pool, Client } from 'pg';
import { DatabaseConection } from 'db_connection/model/dataBaseConection.model';

export class DataBaseService {
    public static instance: DataBaseService;
    private pool;
    private static connectionList: DatabaseConection[];

    private constructor(database: string) {
        try {
            let selected: string = ''
            dotenv.config();
            if(database ==="global"){
                selected = process.env.DATABASE
            } else if( database === "dimensionamiento"){
                selected = process.env.DATABASE2
            }
            const pool = new Pool({
                user: process.env.DBUSER,
                host: process.env.HOST,
                database: selected,
                password: process.env.PASSWORD,
                port: 5432
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

    static getInstance(database: string) {
        try {
            let instance: DataBaseService;
            if(this.connectionList == undefined){
                this.connectionList = []
                instance = this.createInstance(database)
            } else{
                let index = this.connectionList.findIndex(i => i.name == database)
                if(index == -1){
                    instance = this.createInstance(database);
                } else{
                    instance = this.connectionList[index].instance
                }
            }
            return instance;
        } catch (error) {
            console.log('An error occurred while the instance was returned ' + error + ` ${DataBaseService.name} -> ${this.getInstance.name}`);
        }
    }

    static createInstance(database: string){
        try{
            let newInstance = new DataBaseService(database)
            this.connectionList.push({instance: newInstance, name: database})
            return newInstance;
        } catch(error){
            console.log('An error occurred while the instance was cretated ' + error + ` ${DataBaseService.name} -> ${this.createInstance.name}`);
        }
    }


}
