

import * as uuid from "uuid";
import { DataBaseService } from "../../../util/db_connection/services/dataBaseService";
import { Sede } from "global/sede/models/sede.model";
import { DataBaseInterface } from "../../../util/db_connection/services/databaseInterface";


export interface NavData {
    name?: string;
    url?: string;
    icon?: string;
    children?: NavData[];
}

export class SedeDAO {

    private log
    private connection;
    constructor() {
        this.connection = DataBaseInterface.getInstance('global')
    }

    public async insertSede(sede: Sede) {
        try {
            let id = uuid.v4();
            sede.sede_id = id;

            let query = await this.connection.pool.query(`INSERT INTO adm.sede (
                sede_id,
                concesion_id,
                descripcion,
                estado) VALUES ($1,$2,$3,$4);`, [sede.sede_id, 
                    sede.concesion_id,
                    sede.descripcion,
                    sede.estado]);

            return sede
        } catch (error) {
            throw new Error(error)
        }
    }

    public async getSede() {
        try {

            let query = await this.connection.pool.query(`SELECT
                        sede_id,
                        concesion_id,
                        descripcion,
                        estado
                        FROM adm.sede;`);

            return query
        } catch (error) {
            throw new Error(error)
        }
    }

    public async getSedeById(sedeId: Sede) {
        try {

            let query = await this.connection.pool.query(`SELECT
                        sede_id,
                        concesion_id,
                        descripcion,
                        estado
                        FROM adm.sede
                        WHERE sede_id = $1;`, [sedeId.sede_id]);

            return query;
        } catch (error) {
            return new Error(error);
        }
    }

    public async updateSede(sede: Sede) {
        try {

            let query = await this.connection.pool.query(`UPDATE adm.sede SET
                concesion_id = $1,
                descripcion = $2,
                estado = $3
                WHERE sede_id = $4;`,
                    [sede.concesion_id,
                    sede.descripcion,
                    sede.estado,
                    sede.sede_id]);

            return query
        } catch (error) {
            throw new Error(error)
        }
    }

    public async deleteSede(sedeId: string) {
        try {

            let query = await this.connection.pool.query(`DELETE FROM adm.sede 
                        WHERE sede_id = $1;`, [sedeId]);

            return query
        } catch (error) {
            throw new Error(error)
        }
    }

}
