

import * as uuid from "uuid";
import { DataBaseService } from "../../../util/db_connection/services/dataBaseService";
import { Periferico } from "global/periferico/models/periferico";
import { DataBaseInterface } from "../../../util/db_connection/services/databaseInterface";

export class PerifericoDAO {

    private log
    private connection;
    constructor() {
        this.connection = DataBaseInterface.getInstance('global');
    }

    public async insertPeriferico(periferico: Periferico) {
        try {
            let id = uuid.v4();
            periferico.periferico_id = id;

            let query = await this.connection.pool.query(`INSERT INTO adm.periferico (
                periferico_id, 
                sub_sistema_id,
                tipo_periferico_id,
                nombre_periferico,
                marca,
                serial,
                modelo,
                voltaje,
                numero_puertos,
                ip,
                puerto,
                ruta_ftp,
                ruta_ftp_http,
                tiempo_espera,
                estado bool
                ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15);`, [
                    periferico.periferico_id, 
                    periferico.sub_sistema_id,
                    periferico.tipo_periferico_id,
                    periferico.nombre_periferico,
                    periferico.marca,
                    periferico.serial,
                    periferico.modelo,
                    periferico.voltaje,
                    periferico.numero_puertos,
                    periferico.ip,
                    periferico.puerto,
                    periferico.ruta_ftp,
                    periferico.ruta_ftp_http,
                    periferico.tiempo_espera,
                    periferico.estado,
                    periferico.ruta_ftp
                ]);

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
                    nombre_periferico,
                    marca,
                    serial,
                    modelo,
                    voltaje,
                    numero_puertos,
                    ip,
                    puerto,
                    ruta_ftp,
                    ruta_ftp_http,
                    tiempo_espera,
                    estado bool
                FROM adm.periferico;`);

            return query.rows;
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
                    nombre_periferico,
                    marca,
                    serial,
                    modelo,
                    voltaje,
                    numero_puertos,
                    ip,
                    puerto,
                    ruta_ftp,
                    ruta_ftp_http,
                    tiempo_espera,
                    estado bool
                FROM adm.periferico
                WHERE periferico_id = $1;`, [perifericoId.periferico_id]);
            return query.rows;
        } catch (error) {
            return new Error(error);
        }
    }

    public async updatePeriferico(periferico: Periferico) {
        try {

            let query = await this.connection.pool.query(`UPDATE adm.periferico SET
                sub_sistema_id = $1,
                tipo_periferico_id = $2,
                nombre_periferico = $3,
                marca = $4,
                serial = $5,
                modelo = $6,
                voltaje = $7,
                numero_puertos = $8,
                ip = $9,
                puerto = $10,
                ruta_ftp = $11,
                ruta_ftp_http = $12,
                tiempo_espera = $13,
                estado = $14
                WHERE periferico_id = $15;`, [
                    periferico.periferico_id, 
                    periferico.sub_sistema_id,
                    periferico.tipo_periferico_id,
                    periferico.nombre_periferico,
                    periferico.marca,
                    periferico.serial,
                    periferico.modelo,
                    periferico.voltaje,
                    periferico.numero_puertos,
                    periferico.ip,
                    periferico.puerto,
                    periferico.ruta_ftp,
                    periferico.ruta_ftp_http,
                    periferico.tiempo_espera,
                    periferico.estado,
                    periferico.ruta_ftp
                ]);

            return query.rows;
        } catch (error) {
            throw new Error(error)
        }
    }

    public async deletePeriferico(periferico_id: string) {
        try {

            let query = await this.connection.pool.query(`DELETE FROM adm.periferico 
                        WHERE periferico_id = $1;`, [periferico_id]);

            return query.rows;
        } catch (error) {
            throw new Error(error)
        }
    }

}
