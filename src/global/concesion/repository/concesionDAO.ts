

import * as uuid from "uuid";
import { DataBaseService } from "../../../util/db_connection/services/dataBaseService";
import { Concesion } from "global/concesion/models/concesion";
import { DataBaseInterface } from "../../../util/db_connection/services/databaseInterface";

export class ConcesionDAO {

    private log
    private connection;
    constructor() {
        this.connection = DataBaseInterface.getInstance('global');
    }

    public async insertConcesion(concesion: Concesion) {
        try {
            let id = uuid.v4();
            concesion.concesion_id = id;

            let query = await this.connection.pool.query(`INSERT INTO adm.concesion (
                concesion_id,
                nombre_concesion,
                direccion,
                estado,
                telefono_contacto,
                correo_e,
                url) VALUES ($1,$2,$3,$4,$5,$6,$7);`, [concesion.concesion_id, 
                    concesion.nombre, 
                    concesion.direccion, 
                    concesion.estado, 
                    concesion.telefono_contacto,
                    concesion.correo_e,
                    concesion.url]);

            return concesion
        } catch (error) {
            throw new Error(error)
        }
    }

    public async getConcesion() {
        try {

            let query = await this.connection.pool.query(`SELECT
                        concesion_id,
                        nombre_concesion,
                        direccion,
                        estado,
                        telefono_contacto,
                        correo_e,
                        url
                        FROM adm.concesion;`);
            return query.rows
        } catch (error) {
            throw new Error(error)
        }
    }

    public async getConcesionById(concesionId: Concesion) {
        try {

            let query = await this.connection.pool.query(`SELECT
                        concesion_id,
                        nombre_concesion,
                        direccion,
                        estado,
                        telefono_contacto,
                        correo_e,
                        url
                        FROM adm.concesion
                        WHERE concesion_id = $1;`, [concesionId.concesion_id]);
            return query.rows;
        } catch (error) {
            return new Error(error);
        }
    }

    public async updateConcesion(concesion: Concesion) {
        try {

            let query = await this.connection.pool.query(`UPDATE adm.concesion SET
            nombre_concesion = $1,
                direccion = $2,
                estado = $3,
                telefono_contacto = $4,
                correo_e = $5,
                url = $6
                WHERE concesion_id = $7;`,
                    [
                    concesion.nombre, 
                    concesion.direccion, 
                    concesion.estado, 
                    concesion.telefono_contacto,
                    concesion.correo_e,
                    concesion.url,
                    concesion.concesion_id]);
            return query.rows
        } catch (error) {
            throw new Error(error)
        }
    }

    public async deleteConcesion(concesion_id: string) {
        try {

            let query = await this.connection.pool.query(`DELETE FROM adm.concesion WHERE concesion_id = $1;`, [concesion_id]);
            return query
        } catch (error) {
            throw new Error(error)
        }
    }

}
