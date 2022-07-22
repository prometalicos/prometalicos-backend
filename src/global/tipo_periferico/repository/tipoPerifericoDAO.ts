

import * as uuid from "uuid";
import { DataBaseService } from "../../../util/db_connection/services/dataBaseService";
import { tipoPeriferico } from "../models/tipoPeriferico";
import { DataBaseInterface } from "../../../util/db_connection/services/databaseInterface";

export class TipoPerifericoDAO {

    private log
    private connection;
    constructor() {
        this.connection = DataBaseInterface.getInstance('global')
    }

    public async insertTipoPeriferico(tipoPeriferico: tipoPeriferico) {
        try {
            let id = uuid.v4();
            tipoPeriferico.tipo_periferico_id = id;

            let query = await this.connection.pool.query(`INSERT INTO adm.tipo_periferico (
                tipo_periferico_id,
                nombre_tipo_periferico,
                estado) VALUES ($1,$2,$3);`, [
                    tipoPeriferico.tipo_periferico_id,
                    tipoPeriferico.nombre_tipo_periferico,
                    tipoPeriferico.estado]);

            return tipoPeriferico
        } catch (error) {
            throw new Error(error)
        }
    }

    public async getTipoPeriferico() {
        try {

            let query = await this.connection.pool.query(`select
                        tipo_periferico_id,
                        nombre_tipo_periferico,
                        estado
                        from adm.tipo_periferico`);
            return query.rows
        } catch (error) {
            throw new Error(error)
        }
    }

    public async getTipoPerifericoById(tipo_perifericoId: tipoPeriferico) {
        try {

            let query = await this.connection.pool.query(`SELECT
                        nombre_tipo_periferico,
                        estado
                        FROM adm.tipo_periferico
                        WHERE tipo_periferico_id = $1;`, [tipo_perifericoId.tipo_periferico_id]);

            return query.rows
        } catch (error) {
            return new Error(error);
        }
    }

    public async updateTipoPeriferico(tipoPeriferico: tipoPeriferico) {
        try {

            let query = await this.connection.pool.query(`UPDATE adm.tipo_periferico SET
                nombre_tipo_periferico = $2,
                estado = $3
                WHERE tipo_periferico_id = $4;`,
                    [
                     tipoPeriferico.nombre_tipo_periferico,
                     tipoPeriferico.estado,
                     tipoPeriferico.tipo_periferico_id]);
            return query.rows
        } catch (error) {
            throw new Error(error)
        }
    }

    public async deleteTipoPeriferico(tipo_perifericoId: string) {
        try {

            let query = await this.connection.pool.query(`DELETE FROM adm.tipo_periferico 
                        WHERE tipo_periferico_id = $1;`, [tipo_perifericoId]);

            return query.rows
        } catch (error) {
            throw new Error(error)
        }
    }

}
