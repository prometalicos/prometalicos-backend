import { DataBaseService } from "../../db_connection/services/dataBaseService";

export class DataBaseConection{
    public name: string;
    public instance: DataBaseService;

    constructor(name: string,instance: DataBaseService){
        this.name = name;
        this.instance = instance;
    }
}