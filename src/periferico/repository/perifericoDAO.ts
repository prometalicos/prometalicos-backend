

import * as uuid from "uuid";
import { DataBaseService } from "../../db_connection/services/dataBaseService";
import { Periferico } from "periferico/models/periferico";

export class PerifericoDAO {

    private log
    private connection;
    constructor() {
        this.connection = DataBaseService.getInstance('global');
    }

    public async insertPeriferico(periferico: Periferico) {
        try {
            let id = uuid.v4();
            periferico.periferico_id = id;

            let query = await this.connection.pool.query(`INSERT INTO adm.periferico (
                periferico_id, 
                sub_sistema_id,
                tipo_periferico_id,
                descripcion,
                marca,
                serial,
                modelo,
                voltaje,
                numero_puertos,
                ip,
                documento_identificacion,
                ruta_ftp) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12);`, [periferico.periferico_id, 
                    periferico.sub_sistema_id,
                    periferico.tipo_periferico_id,
                    periferico.descripcion,
                    periferico.marca,
                    periferico.serial,
                    periferico.modelo,
                    periferico.voltaje,
                    periferico.numero_puertos,
                    periferico.ip,
                    periferico.documento_identificacion,
                    periferico.ruta_ftp]);

            return periferico
        } catch (error) {
            throw new Error(error)
        }
    }

    public async getPeriferico() {
        try {

            let query = await this.connection.pool.query(`SELECT
                        periferico_id, 
                        sub_sistema_id,
                        tipo_periferico_id,
                        descripcion,
                        marca,
                        serial,
                        modelo,
                        voltaje,
                        numero_puertos,
                        ip,
                        documento_identificacion,
                        ruta_ftp
                        FROM adm.periferico;`);

            return query
        } catch (error) {
            throw new Error(error)
        }
    }

    public async getPerifericoById(perifericoId: Periferico) {
        try {

            let query = await this.connection.pool.query(`SELECT
                        periferico_id, 
                        sub_sistema_id,
                        tipo_periferico_id,
                        descripcion,
                        marca,
                        serial,
                        modelo,
                        voltaje,
                        numero_puertos,
                        ip,
                        documento_identificacion,
                        ruta_ftp
                        FROM adm.periferico
                        WHERE periferico_id = $1;`, [perifericoId.periferico_id]);

            return query;
        } catch (error) {
            return new Error(error);
        }
    }

    public async updatePeriferico(periferico: Periferico) {
        try {

            let query = await this.connection.pool.query(`UPDATE adm.periferico SET
                sub_sistema_id = $1,
                tipo_periferico_id = $2,
                descripcion = $3,
                marca = $4,
                serial = $5,
                modelo = $6,
                voltaje = $7,
                numero_puertos = $8,
                ip = $9,
                documento_identificacion = $10,
                ruta_ftp = $11
                WHERE periferico_id = $12;`,
                    [periferico.sub_sistema_id,
                    periferico.tipo_periferico_id,
                    periferico.descripcion,
                    periferico.marca,
                    periferico.serial,
                    periferico.modelo,
                    periferico.voltaje,
                    periferico.numero_puertos,
                    periferico.ip,
                    periferico.documento_identificacion,
                    periferico.ruta_ftp,
                    periferico.periferico_id]);

            return query
        } catch (error) {
            throw new Error(error)
        }
    }

    public async deletePeriferico(perifericoId: string) {
        try {

            let query = await this.connection.pool.query(`DELETE FROM adm.periferico 
                        WHERE periferico_id = $1;`, [perifericoId]);

            return query
        } catch (error) {
            throw new Error(error)
        }
    }

}
