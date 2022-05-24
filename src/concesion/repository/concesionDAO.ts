

import * as uuid from "uuid";
import { DataBaseService } from "../../db_connection/services/dataBaseService";
import { Concesion } from "concesion/models/concesion";

export class ConcesionDAO {

    private log
    private connection;
    constructor() {
        this.connection = DataBaseService.getInstance('global');
    }

    public async insertConcesion(concesion: Concesion) {
        try {
            let id = uuid.v4();
            concesion.concesion_id = id;

            let query = await this.connection.pool.query(`INSERT INTO adm.concesion (
                concesion_id,
                id,
                nombre,
                direccion,
                estado,
                telefono_contacto,
                correo_e,
                url) VALUES ($1,$2,$3,$4,$5,$6,$7,$8);`, [concesion.concesion_id, 
                    concesion.id, 
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
                        id,
                        nombre,
                        direccion,
                        estado,
                        telefono_contacto,
                        correo_e,
                        url
                        FROM adm.concesion;`);

            return query
        } catch (error) {
            throw new Error(error)
        }
    }

    public async getConcesionById(concesionId: Concesion) {
        try {

            let query = await this.connection.pool.query(`SELECT
                        concesion_id,
                        id,
                        nombre,
                        direccion,
                        estado,
                        telefono_contacto,
                        correo_e,
                        url
                        FROM adm.concesion
                        WHERE concesion_id = $1;`, [concesionId.concesion_id]);

            return query;
        } catch (error) {
            return new Error(error);
        }
    }

    public async updateConcesion(concesion: Concesion) {
        try {

            let query = await this.connection.pool.query(`UPDATE adm.concesion SET
                id = $1,
                nombre = $2,
                direccion = $3,
                estado = $4,
                telefono_contacto = $5,
                correo_e = $6,
                url = $7
                WHERE concesion_id = $8;`,
                    [concesion.id, 
                    concesion.nombre, 
                    concesion.direccion, 
                    concesion.estado, 
                    concesion.telefono_contacto,
                    concesion.correo_e,
                    concesion.url,
                    concesion.concesion_id]);

            return query
        } catch (error) {
            throw new Error(error)
        }
    }

    public async deleteConcesion(concesionId: string) {
        try {

            let query = await this.connection.pool.query(`DELETE FROM adm.concesion 
                        WHERE concesion_id = $1;`, [concesionId]);

            return query
        } catch (error) {
            throw new Error(error)
        }
    }

}
