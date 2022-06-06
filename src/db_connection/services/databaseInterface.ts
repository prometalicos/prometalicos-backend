import * as util from "util";
import * as dotenv from 'dotenv'
import { DataBaseService } from "./dataBaseService";
import { DataBaseConection } from "../model/dataBaseConection.model";


export class DataBaseInterface {

    private log
    private static connectionList: DataBaseConection[];

    private constructor() {
    }

    public static getInstance(database: string) {
        try {
            console.log('db ', database);
            let instance: DataBaseService;
            if (this.connectionList == undefined) {
                dotenv.config();
                this.connectionList = []
                if (database == 'global') {
                    instance = this.createInstance(
                        process.env.GLOBAL_DBUSER,
                        process.env.GLOBAL_HOST,
                        process.env.GLOBAL_DATABASE,
                        process.env.GLOBAL_PASSWORD,
                        parseInt(process.env.GLOBAL_PORT),
                        'global')
                } else if (database == 'evasion') {
                    instance = this.createInstance(process.env.EVASION_DBUSER,
                        process.env.EVASION_HOST,
                        process.env.EVASION_DATABASE,
                        process.env.EVASION_PASSWORD,
                        parseInt(process.env.EVASION_PORT),
                        'evasion')
                } else if (database == 'dimensionamiento') {
                    console.log('hdppppp');
                    instance = this.createInstance(process.env.DIMENSIONAMIENTO_DBUSER,
                        process.env.DIMENSIONAMIENTO_HOST,
                        process.env.DIMENSIONAMIENTO_DATABASE,
                        process.env.DIMENSIONAMIENTO_PASSWORD,
                        parseInt(process.env.DIMENSIONAMIENTO_PORT),
                        'dimensionamiento')
                }
            } else {
                let index = this.connectionList.findIndex(i => i.name == database)
                if (index != -1) {
                    instance = this.connectionList[index].instance
                }
            }
            return instance;
        } catch (error) {
            console.log('An error occurred while the instance was returned ' + error + ` ${DataBaseInterface.name} -> ${this.getInstance.name}`);
        }
    }

    private static createInstance(user: string, host: string, database: string, password: string, port: number, name: string) {
        try {
            let newInstance = new DataBaseService(user, host, database, password, port)
            this.connectionList.push({ instance: newInstance, name: name })
            return newInstance;
        } catch (error) {
            console.log('An error occurred while the instance was cretated ' + error + ` ${DataBaseInterface.name} -> ${this.createInstance.name}`);
        }
    }

}

